/**
 * ============================================================================
 * URL SHORTENER — BACKEND TEST SUITE (matches your actual routes/controllers)
 * ============================================================================
 *
 * Matched against your real code:
 *   POST /api/url    body: { url }   -> 201 { message, url: "http://localhost:3000/api/url/<code>" }
 *   GET  /api/url/:id                -> 302 redirect to originalUrl (on success)
 *   GET  /                           -> 200 plain text "this application is running fine "
 *
 * SETUP:
 *   npm install --save-dev vitest supertest mongodb-memory-server
 *
 * Requires "type": "module" in package.json (you already have this since
 * your src files use import/export).
 * ============================================================================
 */

import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import app from '../app.js';
import { Url } from '../models/Url.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
  await Url.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// ----------------------------------------------------------------------------
// GET /  (health check route in app.js)
// ----------------------------------------------------------------------------

describe('GET /', () => {
  it('returns 200 with the running message', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toBe('this application is running fine ');
  });
});

// ----------------------------------------------------------------------------
// POST /api/url — CREATE SHORT URL
// ----------------------------------------------------------------------------

describe('POST /api/url', () => {
  it('creates a short URL for a valid input URL', async () => {
    const res = await request(app)
      .post('/api/url')
      .send({ url: 'https://www.example.com/some/long/path' });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('created url');
    expect(res.body.url).toMatch(/^http:\/\/localhost:3000\/api\/url\/.+/);
  });

  it('persists the URL and shortcode to the database', async () => {
    const res = await request(app).post('/api/url').send({ url: 'https://persist-test.com' });
    const shortcode = res.body.url.split('/').pop();

    const saved = await Url.findOne({ shortcode });
    expect(saved).not.toBeNull();
    expect(saved.url).toBe('https://persist-test.com');
    expect(saved.clickCount).toBe(0);
  });

  it('generates a different shortcode for two different URLs', async () => {
    const res1 = await request(app).post('/api/url').send({ url: 'https://a.com' });
    const res2 = await request(app).post('/api/url').send({ url: 'https://b.com' });
    expect(res1.body.url).not.toBe(res2.body.url);
  });

  // --- Missing / malformed input -------------------------------------------

  it('rejects request with no url field at all', async () => {
    const res = await request(app).post('/api/url').send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Invaild url hai sahi wala url le ke aa bhai please');
  });

  it('rejects an empty string url', async () => {
    const res = await request(app).post('/api/url').send({ url: '' });
    expect(res.status).toBe(400);
  });

  it('rejects a whitespace-only url (passes the !url check, fails URL parsing)', async () => {
    const res = await request(app).post('/api/url').send({ url: '   ' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid URL*');
  });

  it('rejects a url with no protocol (e.g. "example.com")', async () => {
    const res = await request(app).post('/api/url').send({ url: 'example.com' });
    expect(res.status).toBe(400);
  });

  it('rejects a completely non-URL string', async () => {
    const res = await request(app).post('/api/url').send({ url: 'not a url at all' });
    expect(res.status).toBe(400);
  });

  it('rejects when url field is a number (fails "new URL()" parsing)', async () => {
    const res = await request(app).post('/api/url').send({ url: 12345 });
    expect(res.status).toBe(400);
  });

  it('rejects when url field is an object (blocked by URL parsing before it ever reaches the DB)', async () => {
    const res = await request(app).post('/api/url').send({ url: { $ne: null } });
    expect(res.status).toBe(400);
  });

  it('rejects when url field is null', async () => {
    const res = await request(app).post('/api/url').send({ url: null });
    expect(res.status).toBe(400);
  });

  it('rejects unsupported protocols like ftp:// and javascript:', async () => {
    const ftpRes = await request(app).post('/api/url').send({ url: 'ftp://example.com/file' });
    expect(ftpRes.status).toBe(400);
    expect(ftpRes.body.message).toBe('Only HTTP and HTTPS URLs are allowed');

    const jsRes = await request(app).post('/api/url').send({ url: 'javascript:alert(1)' });
    expect(jsRes.status).toBe(400);
  });

  // --- Edge cases on otherwise-valid input ----------------------------------

  it('accepts a URL with query params and a fragment', async () => {
    const res = await request(app)
      .post('/api/url')
      .send({ url: 'https://example.com/search?q=test&page=2#results' });
    expect(res.status).toBe(201);
  });

  it('accepts a very long URL (2000+ characters)', async () => {
    const longPath = 'a'.repeat(2000);
    const res = await request(app).post('/api/url').send({ url: `https://example.com/${longPath}` });
    expect(res.status).toBe(201);
  });

  it('accepts a URL containing unicode characters', async () => {
    const res = await request(app).post('/api/url').send({ url: 'https://example.com/café/日本語' });
    expect(res.status).toBe(201);
  });

  it('handles many concurrent requests without shortcode collisions', async () => {
    const requests = Array.from({ length: 20 }, (_, i) =>
      request(app).post('/api/url').send({ url: `https://concurrent-test.com/${i}` })
    );
    const results = await Promise.all(requests);
    const codes = results.map((r) => r.body.url.split('/').pop());
    expect(new Set(codes).size).toBe(codes.length);
  });
});

// ----------------------------------------------------------------------------
// GET /api/url/:id — REDIRECT
// ----------------------------------------------------------------------------

describe('GET /api/url/:id', () => {
  it('redirects to the original URL for a valid shortcode', async () => {
    const createRes = await request(app).post('/api/url').send({ url: 'https://redirect-target.com' });
    const shortcode = createRes.body.url.split('/').pop();

    const res = await request(app).get(`/api/url/${shortcode}`);
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('https://redirect-target.com');
  });

  it('increments clickCount on each successful redirect', async () => {
    const createRes = await request(app).post('/api/url').send({ url: 'https://click-count-test.com' });
    const shortcode = createRes.body.url.split('/').pop();

    await request(app).get(`/api/url/${shortcode}`);
    await request(app).get(`/api/url/${shortcode}`);

    const doc = await Url.findOne({ shortcode });
    expect(doc.clickCount).toBe(2);
  });

  /**
   * KNOWN BUG in expandUrl (service): when shortcode isn't found, `url` is
   * null, so `url.clickCount += 1` throws a TypeError. The controller's
   * catch block sends `res.json({ message: "error in rediect " })` with NO
   * explicit status code, so Express defaults to 200 — a "not found" case
   * is currently reported as a 200 success to the client.
   * This test documents the CURRENT behavior so it doesn't regress silently.
   * Once you fix it (recommended: check `if (!url) return res.status(404)...`
   * in the service, or in the controller), update this test to expect 404.
   */
  it('[current behavior] returns 200 with an error message for a non-existent shortcode (should be 404 — see comment)', async () => {
    const res = await request(app).get('/api/url/doesNotExist123');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('error in rediect ');
  });

  it('does not crash on a shortcode with unusual characters', async () => {
    const res = await request(app).get('/api/url/%20%3B%27--');
    expect([200, 400, 404]).toContain(res.status);
  });
});
import './App.css'
import UrlForm from "./components/UrlForm.jsx"
import ShowUrl from "./components/UrlList.jsx"

function App() {
  return (
    <div className="app">
      {/* ── Navbar ── */}
      <nav className="navbar" id="navbar">
        <a className="navbar__brand" href="/">
          <div className="navbar__logo">⚡</div>
          <div className="navbar__name">Snip<span>link</span></div>
        </a>
        <div className="navbar__links">
          <button className="navbar__link" id="nav-features">Features</button>
          <button className="navbar__link" id="nav-about">About</button>
        <a href='https://github.com/dineshbadal/url-shortner'><button className="navbar__cta" id="nav-github" >★ GitHub</button></a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <main className="hero" id="hero-section">
        <div className="hero__badge">
          <span className="hero__badge-dot"></span>
          Free & Open Source
        </div>

        <h1 className="hero__title">
          Shorten Your Links,<br />
          <span className="hero__title-accent">Amplify Your Reach</span>
        </h1>

        <p className="hero__subtitle">
          Transform lengthy URLs into clean, memorable short links in seconds.
          Fast, reliable, and beautifully simple.
        </p>

        {/* ── Shortener Card ── */}
        <div className="shortener-card" id="shortener-card">
          <UrlForm />
          <ShowUrl />
        </div>

        {/* ── Features Grid ── */}
        <div className="features" id="features-section">
          <div className="feature">
            <span className="feature__icon">⚡</span>
            <span className="feature__title">Lightning Fast</span>
            <span className="feature__desc">URLs shortened in milliseconds</span>
          </div>
          <div className="feature">
            <span className="feature__icon">🔒</span>
            <span className="feature__title">Secure & Private</span>
            <span className="feature__desc">Your data stays safe always</span>
          </div>
          <div className="feature">
            <span className="feature__icon">📊</span>
            <span className="feature__title">Analytics Ready</span>
            <span className="feature__desc">Track clicks & performance</span>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="footer" id="footer">
        Built with <span className="footer__heart">♥</span> by{' '}
        <a href="https://github.com/dineshbadal/" target="_blank" rel="noopener noreferrer">
          Dinesh Badal
        </a>
      </footer>
    </div>
  )
}

export default App

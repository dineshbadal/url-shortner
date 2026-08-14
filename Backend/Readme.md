url-shortener/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── env.js
│   │   ├── controllers/
│   │   │   └── url.controller.js
│   │   ├── models/
│   │   │   └── Url.js
│   │   ├── routes/
│   │   │   └── url.routes.js
│   │   ├── middlewares/
│   │   │   ├── errorHandler.js
│   │   │   └── rateLimiter.js
│   │   ├── services/
│   │   │   └── shortener.service.js
│   │   ├── utils/
│   │   │   └── validateUrl.js
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── UrlForm.jsx
│   │   │   ├── UrlList.jsx
│   │   │   └── Stats.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   └── Redirect.jsx
│   │   ├── services/
│   │   │   └── api.js         # axios calls to backend
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md
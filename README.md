# MBKTech.org Website

<img height="48px" src="https://handlebarsjs.com/handlebars-icon.svg"/> <img src="https://skillicons.dev/icons?i=html,css,js,nodejs,vercel,postgres,sqlite"/> <img height="48px" src="https://console.neon.tech/favicon/favicon.svg"/>

A multi-domain Node.js website showcasing the portfolio, projects, and services of Muhammad Bin Khalid. Standardized with the **`mbkcore` ecosystem architecture**, supporting **PostgreSQL (Neon)** and **SQLite (better-sqlite3)** via `mbkauthe` repository abstractions — hosted on **Vercel**.

---

## 🌐 Live Sites

| Domain | Purpose |
|---|---|
| [mbktech.org](https://mbktech.org/) | Main portfolio & services site |
| [www.mbktech.org](https://www.mbktech.org/) | Redirects to main |
| [download.mbktech.org](https://download.mbktech.org/) | App downloads portal |

---

## 🛠️ Tech Stack & Ecosystem Architecture

| Layer | Technology |
|---|---|
| Runtime | Node.js (ES Modules) |
| Framework | Express 4 (Decoupled `src/app.js` & `src/server.js`) |
| Templating | Handlebars (`express-handlebars`) |
| Database Layer | Dual-Database (`PostgreSQL` / `SQLite`) via `mbkauthe` abstraction |
| Repositories | Domain repositories extending `BaseRepository` from `mbkauthe` |
| Testing Suite | `vitest` + `supertest` with in-memory SQLite runner |
| Hosting | [Vercel](https://vercel.com) |
| Security | Anti-bot challenge (`MBK Shield`), rate limiting, CORS, compression |
| Caching | `node-cache` (in-memory) |
| Sitemap | `sitemap` (dynamic XML generation) |

---

## 📁 Project Structure

```
mbktech.org/
├── app.js                          # Root backward-compatible re-export of src/app.js
├── package.json                    # Ecosystem scripts & dependencies
├── vercel.json                     # Vercel deployment config (points to src/server.js)
├── vitest.config.js                # Vitest testing suite configuration
├── .env.example                    # Environment variables template
├── data/                           # Legal markdown docs & local SQLite databases
│   ├── PrivacyPolicy.md
│   └── TermsofService.md
├── public/                         # Static assets (CSS, JS, images)
│   ├── robots.txt
│   └── Assets/
├── src/
│   ├── app.js                      # Express application assembly & middleware
│   ├── server.js                   # Dedicated server bootstrap & listener
│   ├── config/
│   │   └── handlebars.js           # Handlebars engine & helpers
│   ├── db/
│   │   ├── connection.js           # Pool / SQLite connection & health-check
│   │   ├── index.js                # Instantiates & exports defaultAdapter & dialects
│   │   └── schema/
│   │       ├── schema.sql          # PostgreSQL DDL (canonical mbkcore_ tables + views)
│   │       └── schema.sqlite.sql   # SQLite DDL
│   ├── repositories/
│   │   ├── TicketRepository.js     # Manages mbkcore_support_submissions
│   │   ├── SpamRepository.js       # Manages mbkcore_blocked_entries
│   │   └── index.js                # Barrel export for repositories
│   ├── controllers/
│   │   ├── apiController.js        # /api/portalAppVersion, /api/Test
│   │   ├── formController.js       # POST /post/SubmitForm
│   │   ├── pageController.js       # Page rendering + 404
│   │   ├── sitemapController.js    # sitemap.xml, robots.txt
│   │   └── ticketController.js     # Support ticket CRUD
│   ├── middleware/
│   │   ├── botProtection.js        # MBK Shield cryptographic challenge & honeypot
│   │   ├── domainRedirect.js       # Multi-domain routing
│   │   └── security.js             # Rate limits, cache, request logging
│   ├── routes/
│   │   ├── index.js                # Route mount orchestrator
│   │   ├── pageRoutes.js           # GET page routes
│   │   ├── apiRoutes.js            # GET /api/*
│   │   ├── ticketRoutes.js         # /api/tickets/*
│   │   └── postRoutes.js           # POST /post/*
│   ├── scripts/
│   │   └── init-sqlite.js          # SQLite schema initialization CLI
│   ├── services/
│   │   ├── legalContentService.js  # Markdown document renderer
│   │   ├── portalVersionService.js # Cached portal version
│   │   ├── spamService.js          # Blocked entries & spam check (delegates to repository)
│   │   └── ticketService.js        # Ticket creation & lookup (delegates to repository)
│   └── utils/
│       ├── icon.js                 # Base64 icon helper
│       └── sitemapGenerator.js     # Dynamic sitemap builder
├── tests/
│   ├── setup.js                    # Global test runner setup (SQLite in-memory)
│   ├── helpers/
│   │   └── createTestDb.js         # Test database initialization
│   ├── unit/                       # Repository & service unit tests
│   └── integration/                # Supertest HTTP integration tests
└── views/
    ├── layouts/
    │   └── main.handlebars         # Main layout template
    └── mainPages/                  # Page templates
```

---

## 🔀 Domain Routing

The app runs as a single Vercel instance serving multiple domains. The `domainRedirect` middleware inspects the request hostname and sets `req.site`:

| Hostname | `req.site` | Views served from |
|---|---|---|
| `mbktech.org` | `main` | `views/mainPages/mainDomain/` |
| `www.mbktech.org` | `main` | `views/mainPages/mainDomain/` |
| `download.mbktech.org` | `download` | `views/mainPages/otherDomain/` |

In local development (`localenv=true`), the site is determined by the `site` env variable.

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** 18+
- **PostgreSQL** database (e.g., [Neon](https://neon.tech) serverless) or **SQLite** (built-in via better-sqlite3)

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Copy `.env.example` to `.env` and fill in the values:
```env
NODE_ENV=development
PORT=4133
localenv=true
site=main

# Database configuration
DB_TYPE=sqlite                     # 'postgres' or 'sqlite'
SQLITE_PATH=./data/mbktech.org.db   # Used when DB_TYPE=sqlite
NEON_POSTGRES=postgresql://user:password@ep-sample.region.neon.tech/dbname?sslmode=require

# Version control & Security
PortalVersionControlJson={"latestVersion":"1.5.0","downloadUrl":"https://mbktech.org/download","mandatory":false}
BOT_PROTECTION_SECRET=your-random-hmac-salt-here
```

### 3. Initialize SQLite (optional, for local development without Neon)
```bash
npm run schema:sqlite
```

---

## 🏃 Running the Application

```bash
# Development (PostgreSQL)
npm run dev

# Development (SQLite)
npm run dev:sqlite

# Production mode
npm start
```

The app will be available at **http://localhost:4133** (or the port set in `PORT`).

---

## 🧪 Testing

```bash
# Run all tests (unit & integration)
npm test

# Run tests in watch mode
npm run test:watch

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Generate code coverage report
npm run test:coverage
```

---

## 📄 License

The source code is licensed under the [MIT License](LICENSE).

Project documentation is licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Images, blog posts, and other content remain the intellectual property of the author.

---

## 📬 Contact

For questions or contributions, reach out to **Muhammad Bin Khalid**:

- [mbktech.org/Support](https://mbktech.org/Support/?Project=MIbnEKhalidWeb)
- [support@mbktech.org](mailto:support@mbktech.org)

**Developed by [Muhammad Bin Khalid](https://github.com/MIbnEKhalid)**
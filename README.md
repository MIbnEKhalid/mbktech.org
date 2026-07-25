# MBKTech.org Website

<img height="48px" src="https://handlebarsjs.com/handlebars-icon.svg"/> <img src="https://skillicons.dev/icons?i=html,css,js,nodejs,vercel,postgres"/> <img height="48px" src="https://console.neon.tech/favicon/favicon.svg"/>

A multi-domain Node.js website showcasing the portfolio, projects, and services of Muhammad Bin Khalid. Built with **Express**, **Handlebars**, and **PostgreSQL (Neon)** — hosted on **Vercel**.

---

## 🌐 Live Sites

| Domain | Purpose |
|---|---|
| [mbktech.org](https://mbktech.org/) | Main portfolio & services site |
| [www.mbktech.org](https://www.mbktech.org/) | Redirects to main |
| [download.mbktech.org](https://download.mbktech.org/) | App downloads portal |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ES Modules) |
| Framework | Express 4 |
| Templating | Handlebars (`express-handlebars`) |
| Database | PostgreSQL via [Neon](https://neon.tech) (`pg`) |
| Hosting | [Vercel](https://vercel.com) |
| Security | Rate limiting (`express-rate-limit`), CORS, compression |
| Caching | `node-cache` (in-memory) |
| Sitemap | `sitemap` (dynamic XML generation) |

---

## 📁 Project Structure

```
mbktech.org/
├── app.js                          # Express app entry point
├── package.json
├── vercel.json                     # Vercel deployment config
├── .env.example                    # Environment variables template
├── database/                       # SQL migration files
├── documentation/                  # Docs (env.md)
├── public/                         # Static assets (CSS, JS, images)
│   ├── robots.txt
│   └── Assets/
│       ├── Cookie/
│       ├── FAQs/
│       ├── Images/
│       ├── Scripts/
│       ├── Style/
│       └── Tickett/
├── src/
│   ├── config/
│   │   ├── database.js             # PostgreSQL connection pool
│   │   └── handlebars.js           # Handlebars engine & helpers
│   ├── controllers/
│   │   ├── apiController.js        # /api/portalAppVersion, /api/Test
│   │   ├── formController.js       # POST /post/SubmitForm
│   │   ├── pageController.js       # Page rendering + 404
│   │   ├── sitemapController.js    # sitemap.xml, robots.txt
│   │   └── ticketController.js     # Support ticket CRUD
│   ├── middleware/
│   │   ├── domainRedirect.js       # Multi-domain routing
│   │   └── security.js             # Rate limits, cache, request logging
│   ├── routes/
│   │   ├── index.js                # Route mount orchestrator
│   │   ├── pageRoutes.js           # GET page routes
│   │   ├── apiRoutes.js            # GET /api/*
│   │   ├── ticketRoutes.js         # /api/tickets/*
│   │   └── postRoutes.js           # POST /post/*
│   ├── services/
│   │   ├── portalVersionService.js # Cached portal version
│   │   ├── spamService.js          # Blocked entries & spam check
│   │   └── ticketService.js        # Ticket creation & lookup
│   └── utils/
│       ├── icon.js                 # Base64 icon helper
│       └── sitemapGenerator.js     # Dynamic sitemap builder
└── views/
    ├── layouts/
    │   └── main.handlebars         # Main layout template
    └── mainPages/
        ├── 404.handlebars
        ├── mainDomain/             # mbktech.org pages
        │   ├── index.handlebars
        │   ├── FAQs.handlebars
        │   ├── services.handlebars
        │   ├── Support&Contact.handlebars
        │   ├── Terms&Conditions.handlebars
        │   ├── TrackTicket.handlebars
        │   ├── BasicPackage.handlebars
        │   └── AdvancedPackage.handlebars
        └── otherDomain/
            └── download.handlebars  # download.mbktech.org
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
- **PostgreSQL** database (e.g., [Neon](https://neon.tech) serverless)

### 1. Clone the repository
```bash
git clone https://github.com/MIbnEKhalid/MIbnEKhalid.github.io.git
cd MIbnEKhalid.github.io
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Copy `.env.example` to `.env` and fill in the values:
```env
NODE_ENV=development
PORT=5000
PortalVersionControlJson=
localenv=true
NEON_POSTGRES=postgresql://username:password@host/database
site=main
```

| Variable | Description |
|---|---|
| `NODE_ENV` | `development` or `production` |
| `PORT` | Server port (default: `4133` if unset) |
| `PortalVersionControlJson` | JSON config for the portal app download page |
| `localenv` | `true` for local dev, `false` for production |
| `NEON_POSTGRES` | PostgreSQL connection string |
| `site` | Target site for local dev: `main` or `download` |

> See [`documentation/env.md`](documentation/env.md) for detailed descriptions.

---

## 🏃 Running the Application

```bash
# Development (with auto-reload)
npm run dev

# Production mode
npm start
```

The app will be available at **http://localhost:4133** (or the port set in `PORT`).

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
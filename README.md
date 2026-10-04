# AgriShare 🌾

**A full-stack rural resource-exchange marketplace connecting farmers with underused agricultural machinery and crop residue**

🔗 **Live demo:** [agrisharep2p.vercel.app](https://agrisharep2p.vercel.app)
📦 **Repo:** [github.com/himanyagupta/Agrishare](https://github.com/himanyagupta/Agrishare)

---

## The Problem

Farm machinery in rural India sits idle most of the year, while crop residue often gets burned simply because there's no easy way to find someone nearby who needs it. AgriShare solves this discovery problem with a two-sided marketplace matched by **location, availability, cost, and demand**.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend / DB | Supabase (PostgreSQL, Auth, Row Level Security) |
| Hosting | Vercel (CI/CD via GitHub integration) |
| Version Control | Git / GitHub |

## Key Features

- **Full authentication system** — email/password signup and login via Supabase Auth, with a Postgres trigger that auto-provisions user profiles on signup
- **Complete CRUD marketplace** — create, browse, filter, and edit resource listings, all secured by database-level Row Level Security (not just app-layer checks)
- **Two-sided demand matching** — a public "Community Demand" board (the wanted side) alongside listings (the supply side), with automatic urgency tagging based on deadline proximity
- **Transparent, rule-based matching engine** — ranks listings by a weighted, fully explainable score (distance, availability, cost fit, demand match) rather than an opaque black-box model
- **Bilingual UI (English/Hindi)** — a custom, dependency-free i18n system built with React Context, addressing real accessibility needs for the target user base
- **Knowledge Hub** — curated, research-backed content on real Indian government agricultural schemes and practical machinery/residue usage guides
- **Protected routing** — Next.js middleware enforces auth on sensitive routes, with graceful fallback handling so a misconfiguration never takes the whole site down

## Technical Highlights

- **Security-first data model:** every table (`users`, `resources`, `requests`, `bookings`, `demand_posts`) is protected by Postgres Row Level Security policies, meaning access control is enforced at the database layer — impossible to bypass from the client, even via direct API calls
- **Defense-in-depth ownership checks:** resource editing is protected on three independent layers — UI visibility, server-side redirect, and RLS at the database
- **Resilient middleware design:** auth middleware fails safe (never crashes the app) if environment/network issues occur, with protected pages independently re-verifying authentication as a backup layer
- **Clean data adapter pattern:** a dedicated adapter layer maps raw Supabase rows into UI-ready types, keeping component code fully decoupled from database schema change

## What I'd Build Next(future enhancements)

- Real-time interactive maps (Leaflet/OpenStreetMap) with geocoding for true proximity search
- A booking/response system connecting Community Demand posts to confirmed transactions
- A rating and review system to build trust between users

---

*Built solo for Smart India Hackathon — from schema design and Row Level Security policies to full-stack implementation and production deployment.*

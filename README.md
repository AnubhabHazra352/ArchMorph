# ArchMorph

> AI-powered architectural floor plan visualizer — upload a plan, get an intelligent rendered design in seconds.

**[Live Demo](https://arch-morph.vercel.app)** · **[GitHub](https://github.com/AnubhabHazra352/ArchMorph)**

---

## What it does

ArchMorph lets architects, interior designers, and homeowners upload a floor plan image and receive an AI-generated architectural rendering powered by Claude AI. The app analyses the spatial layout, identifies rooms and structural elements, and produces a visualized output — bridging the gap between raw blueprints and finished design concepts.

**Key features:**

- Upload floor plans in JPG, PNG, or WEBP format (up to 50 MB)
- AI analysis and rendering via Claude AI through the Puter platform
- Before/after comparison slider to visualize the transformation
- Project gallery to browse and manage all uploaded plans
- Authentication via Puter — no separate account needed
- Fully responsive UI built with Tailwind CSS 4
- Docker support for containerized deployment

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | React Router 7 (SSR) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Build tool | Vite 7 |
| AI integration | Claude AI via Puter.js |
| Image comparison | react-compare-slider |
| Icons | Lucide React |
| Deployment | Vercel + Docker |

---

## Getting started

### Prerequisites

- Node.js 18+
- A [Puter](https://puter.com) account (free) for AI features

### Installation

```bash
# Clone the repository
git clone https://github.com/AnubhabHazra352/ArchMorph.git
cd ArchMorph

# Install dependencies
npm install
```

### Environment setup

Create a `.env.local` file in the root directory:

```env
VITE_PUTER_WORKER_URL=your_puter_worker_url
```

To get your Puter worker URL:
1. Sign up at [puter.com](https://puter.com)
2. Create a new app in the Puter dashboard
3. Copy the worker URL from your app settings

### Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
npm run start
```

---

## Docker deployment

```bash
# Build the image
docker build -t archmorph .

# Run the container
docker run -p 3000:3000 --env-file .env.local archmorph
```

---

## How it works

1. **Upload** — the user uploads a floor plan image through the drag-and-drop interface
2. **Auth** — Puter handles authentication; users sign in with their Puter account to access AI features
3. **AI processing** — the image is sent to a Puter worker which calls Claude AI to analyse the floor plan and generate an architectural rendering
4. **Compare** — the before/after slider lets users compare the original plan with the AI output
5. **Projects** — all processed plans are saved to the user's project gallery for future reference

---

## Project structure

```
ArchMorph/
├── app/              # React Router routes and pages
├── components/       # Reusable UI components
├── lib/              # Utilities and API helpers
├── public/           # Static assets
├── Dockerfile        # Container configuration
└── vite.config.ts    # Build configuration
```

---

## Deployment on Vercel

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add `VITE_PUTER_WORKER_URL` to your Vercel environment variables
4. Deploy — Vercel auto-detects the React Router config

---

## Author

**Anubhab Hazra**
- GitHub: [@AnubhabHazra352](https://github.com/AnubhabHazra352)
- Email: anubhabhazra327@gmail.com

---

## License

This project is open source and available under the [MIT License](LICENSE).

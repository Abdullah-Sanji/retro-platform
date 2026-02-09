# 🔮 Retrospective Platform

A modern, real-time collaborative retrospective platform built with Vue 3, Convex, and Tailwind CSS.

## Features

- ⚡ **Real-time Collaboration** - See updates instantly across all participants
- 🎭 **Anonymous Mode** - Safe space for honest feedback
- 🗳️ **Voting System** - Prioritize what matters most
- 📊 **Multiple Templates** - Start/Stop/Continue, Mad/Sad/Glad, and more
- 🎯 **Action Items** - Convert ideas into trackable action items
- 🎨 **Clean UI** - Modern, responsive interface
- 🔒 **Permission System** - Facilitator controls for smooth sessions

## Tech Stack

- **Frontend**: Vue 3 (Composition API), TypeScript
- **Styling**: Tailwind CSS
- **Backend/Database**: Convex (serverless, real-time)
- **State Management**: Pinia
- **Build Tool**: Vite

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ and npm
- A Convex account (free at convex.dev)

### 2. Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd retrospective-platform

# Install dependencies
npm install

# Install Convex CLI globally (if not already installed)
npm install -g convex
```

### 3. Initialize Convex

```bash
# Login to Convex
npx convex login

# Initialize Convex project
npx convex dev
```

This will:
- Create a new Convex project
- Generate the `.env.local` file with your `VITE_CONVEX_URL`
- Start the Convex development server
- Generate TypeScript types in `convex/_generated/`

### 4. Start Development Server

In a separate terminal:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
retrospective-platform/
├── convex/                    # Backend (Convex)
│   ├── schema.ts             # Database schema
│   ├── sessions.ts           # Session operations
│   ├── cards.ts              # Card CRUD
│   ├── votes.ts              # Voting logic
│   ├── groups.ts             # Grouping operations
│   ├── actionItems.ts        # Action items
│   ├── users.ts              # User management
│   └── _generated/           # Auto-generated types
├── src/                      # Frontend (Vue)
│   ├── components/
│   │   ├── RetroBoard.vue    # Main board
│   │   ├── RetroColumn.vue   # Column container
│   │   ├── RetroCard.vue     # Individual card
│   │   ├── GroupContainer.vue # Card group
│   │   ├── VotingPanel.vue   # Voting UI
│   │   ├── FacilitatorToolbar.vue
│   │   ├── ActionItemsList.vue
│   │   └── SessionSetup.vue  # Session creation
│   ├── App.vue               # Root component
│   ├── main.ts               # App entry point
│   └── style.css             # Global styles
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## Usage

### Creating a Session

1. Click "Create New Retro"
2. Fill in session details:
   - Session title
   - Team name
   - Your name (as facilitator)
   - Select template
   - Set votes per user
3. Click "Create Retrospective"
4. Share the generated link with your team

### Joining a Session

1. Click "Join Session" on home page
2. Enter the session link (e.g., `retro-abc123`)
3. Enter your name (or stay anonymous)
4. Start collaborating!

### Facilitator Controls

As a facilitator, you can:
- Move between phases (Collecting → Grouping → Voting → Discussion)
- Create action items from voted cards/groups
- End the session

### Phases

1. **Collecting** - Team adds cards to columns
2. **Grouping** - Organize similar cards into groups
3. **Voting** - Each participant votes on important items
4. **Discussion** - Review results and create action items
5. **Completed** - Session archived

## Development

### Running Tests

```bash
npm run test
```

### Building for Production

```bash
# Build frontend
npm run build

# Deploy Convex backend
npx convex deploy
```

### Environment Variables

Create a `.env` file with the following variables:

```bash
# Convex
VITE_CONVEX_URL=https://your-project.convex.cloud

# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Stripe Payments
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# AI Action Items API
VITE_AI_API_URL=https://your-ai-api-url.com/api/retro-action-items

# Full Permission Mode (Optional - set to "true" to unlock all features for free)
FULL_PERMISSION=false
VITE_FULL_PERMISSION=false
```

### Full Permission Mode

The platform includes a **Full Permission Mode** that, when enabled, makes all premium features available for free:

**When `FULL_PERMISSION=true` and `VITE_FULL_PERMISSION=true`:**
- ✅ Unlimited sessions per month (instead of 1 for free tier)
- ✅ All templates available (Start/Stop/Continue, Mad/Sad/Glad, Went Well/To Improve/Actions, Custom)
- ✅ Unlimited participants per session (instead of 5 for free tier)
- ✅ Unlimited votes per user (instead of 3 for free tier)
- ✅ AI-generated action items enabled for all users
- ✅ Pricing page hidden from navigation
- ✅ "Get Started" buttons redirect to session creation instead of pricing

**Use Cases:**
- Development and testing environments
- Internal company deployments
- Educational institutions
- Open-source/free offerings
- Demo environments

**Note:** This feature bypasses all subscription checks. Use responsibly and ensure proper authentication is in place.

## Key Features Explained

### Real-time Sync

Convex provides reactive queries that automatically update when data changes:

```typescript
const sessionData = useQuery(api.sessions.getSessionDetails, { sessionId });
// ✅ Auto-updates when cards, votes, or phase changes
```

### Permission System

Server-side validation ensures security:

```typescript
// Only facilitators can change phases
if (session.facilitatorId !== args.userId) {
  throw new Error("Only facilitator can change phase");
}
```

### Optimistic Updates

UI updates immediately, then syncs with server:

```typescript
await createCard({ text: "Great idea!" });
// ✅ Card appears instantly, server confirms in background
```

## Deployment

### Frontend (Vercel/Netlify)

1. Connect your Git repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_CONVEX_URL`

### Backend (Convex)

```bash
npx convex deploy --prod
```

## Performance

- Handles 30+ concurrent users smoothly
- Sub-100ms query response times
- Optimized with Convex indexes
- Lazy loading for large card lists

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT

## Support

For issues or questions:
- Open a GitHub issue
- Check Convex docs: https://docs.convex.dev
- Join Convex Discord: https://convex.dev/community

---

Built with ❤️ using Vue 3 and Convex
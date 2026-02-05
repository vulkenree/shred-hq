# Shred HQ — Product Spec & Claude Code Prompt

## Overview

**Shred HQ** is a mobile-first web app for a group of friends on a snowboarding trip. It's the crew's single dashboard for live mountain conditions, a run leaderboard with fun awards, and a bet tracker to keep things interesting. Built to be used on phones at the lodge, on the lift, or at après.

**Auth**: Google (Gmail) sign-in only — no passwords, no sign-up forms. One tap and you're in.

**Tech Stack**:
- **Framework**: Next.js 14 (App Router)
- **UI**: shadcn/ui + Tailwind CSS + Lucide icons
- **Backend/DB**: Firebase (Auth + Firestore)
  - Firebase Auth with Google provider (handles Gmail login)
  - Firestore for real-time data (leaderboard updates, bets, etc.)
- **Deployment**: Vercel (one-command deploy, free tier is plenty)
- **Weather API**: Open-Meteo (free, no API key needed)
- **No native app install** — just a URL everyone opens on their phone

### Why This Stack
- **Next.js App Router**: File-based routing, no manual route config. API routes available if needed later. Great mobile performance.
- **shadcn/ui**: Not a component library you install — it's copy-paste components you own. Beautiful, accessible, dark-mode-ready out of the box. Dialogs, sheets, tabs, cards, toasts, avatars all look polished instantly.
- **Firebase client-side only**: All Firestore listeners and Auth run in the browser via `"use client"` components. No SSR complexity with Firebase. Next.js just gives us routing + structure.
- **Vercel**: `git push` = deployed. Free custom domain. Zero config.

---

## Architecture

```
shred-hq/
├── app/
│   ├── layout.tsx                     # Root layout, fonts, providers
│   ├── page.tsx                       # Login / landing page
│   ├── globals.css                    # Tailwind + shadcn theme tokens
│   ├── (auth)/                        # Route group for authenticated pages
│   │   ├── layout.tsx                 # Auth guard + AppShell wrapper
│   │   ├── trip/
│   │   │   ├── page.tsx               # Trip create / join flow
│   │   │   └── [tripId]/
│   │   │       ├── layout.tsx         # Trip context provider + bottom nav
│   │   │       ├── mountain/
│   │   │       │   └── page.tsx       # Mountain conditions tab
│   │   │       ├── leaderboard/
│   │   │       │   └── page.tsx       # Leaderboard tab
│   │   │       └── bets/
│   │   │           └── page.tsx       # Bets tab
├── components/
│   ├── ui/                            # shadcn/ui components (auto-generated)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── sheet.tsx                  # Mobile-friendly bottom sheets
│   │   ├── tabs.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── toast.tsx
│   │   ├── progress.tsx
│   │   ├── separator.tsx
│   │   ├── select.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── skeleton.tsx
│   ├── auth/
│   │   └── login-button.tsx           # Google sign-in button
│   ├── layout/
│   │   ├── app-shell.tsx              # Header + content area
│   │   ├── bottom-nav.tsx             # Mobile bottom tab bar
│   │   └── user-menu.tsx              # Avatar dropdown (settings, logout)
│   ├── mountain/
│   │   ├── weather-hero.tsx           # Current conditions hero card
│   │   ├── send-it-meter.tsx          # The "Send It" gauge
│   │   ├── hourly-forecast.tsx        # Scrollable hourly row
│   │   └── snow-report.tsx            # Snow depth + forecast card
│   ├── leaderboard/
│   │   ├── stats-overview.tsx         # Summary stat cards
│   │   ├── rider-rankings.tsx         # Ranked rider list
│   │   ├── rider-card.tsx             # Individual rider row (expandable)
│   │   ├── log-run-sheet.tsx          # Bottom sheet to log a run
│   │   └── daily-awards.tsx           # Award voting section
│   └── bets/
│       ├── bet-feed.tsx               # Main bet list
│       ├── bet-card.tsx               # Individual bet (expandable)
│       ├── propose-bet-sheet.tsx      # Bottom sheet to create bet
│       ├── resolve-vote.tsx           # Voting UI for resolution
│       └── settle-up-view.tsx         # Debt simplification summary
├── lib/
│   ├── firebase.ts                    # Firebase app init + exports
│   ├── auth-context.tsx               # React context for auth state
│   ├── trip-context.tsx               # React context for current trip
│   ├── firestore-helpers.ts           # Typed Firestore read/write utils
│   ├── weather.ts                     # Open-Meteo API fetch + types
│   ├── send-it-calculator.ts          # "Send It" rating algorithm
│   └── settle-up.ts                   # Debt simplification algorithm
├── hooks/
│   ├── use-auth.ts                    # Firebase auth hook
│   ├── use-collection.ts             # Generic real-time Firestore listener
│   ├── use-document.ts               # Single doc real-time listener
│   └── use-weather.ts                # SWR/polling hook for weather data
├── types/
│   └── index.ts                       # TypeScript types (Trip, Run, Bet, etc.)
├── .env.local                         # Firebase config (not committed)
├── components.json                    # shadcn/ui config
├── tailwind.config.ts
├── next.config.js
├── package.json
└── README.md
```

---

## shadcn/ui Setup Notes (for Claude Code)

### Initial Setup
```bash
# Create Next.js project
npx create-next-app@latest shred-hq --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"

# Initialize shadcn/ui
npx shadcn@latest init

# When prompted:
# - Style: Default
# - Base color: Slate
# - CSS variables: Yes

# Install the components we need
npx shadcn@latest add button card dialog sheet tabs avatar badge toast progress separator select input label skeleton alert toggle-group
```

### Custom Theme (globals.css)
Override shadcn's default theme tokens with our alpine dark palette:
```css
@layer base {
  :root {
    /* Light mode (fallback, but we default to dark) */
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
  }

  .dark {
    --background: 222 47% 7%;          /* Deep navy #0f1729 */
    --foreground: 210 40% 96%;         /* Snow white #f1f5f9 */
    --card: 217 33% 10%;              /* Slightly lighter navy #1a2332 */
    --card-foreground: 210 40% 96%;
    --primary: 199 89% 60%;           /* Electric ice blue #38bdf8 */
    --primary-foreground: 222 47% 7%;
    --secondary: 38 92% 50%;          /* Warm amber #f59e0b */
    --secondary-foreground: 222 47% 7%;
    --muted: 217 19% 27%;
    --muted-foreground: 215 20% 65%;  /* Slate #94a3b8 */
    --accent: 217 33% 14%;
    --accent-foreground: 210 40% 96%;
    --destructive: 349 89% 60%;       /* Rose red #f43f5e */
    --destructive-foreground: 210 40% 96%;
    --border: 217 19% 18%;
    --ring: 199 89% 60%;
  }
}
```

### Key shadcn Components → Use Cases
| Component      | Used For                                                       |
|----------------|----------------------------------------------------------------|
| `Sheet`        | Log Run form, Propose Bet form (slides up from bottom on mobile) |
| `Dialog`       | Confirm actions, resolve bet voting                            |
| `Card`         | Weather cards, stat cards, bet cards, rider cards              |
| `Tabs`         | Today/Trip toggle on leaderboard                               |
| `Avatar`       | User photos everywhere (leaderboard, bets, awards)             |
| `Badge`        | Bet status (Open/Active/Resolved), run difficulty              |
| `Toast`        | Success/error notifications                                    |
| `Progress`     | Send It meter visual bar                                       |
| `Skeleton`     | Loading states for weather, leaderboard                        |
| `Select`       | Resort picker, difficulty selector                             |
| `ToggleGroup`  | For/Against side picker on bets                                |

---

## Firebase Setup Notes (for Claude Code)

### Firebase Config
```typescript
// lib/firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Prevent re-initialization in Next.js hot reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
```

### Important Next.js + Firebase Notes
- ALL Firebase client SDK usage must be in `"use client"` components
- Use `getApps().length === 0` check to prevent re-init on hot reload
- Env vars must be prefixed with `NEXT_PUBLIC_` for client access
- No SSR with Firebase — pages using Firestore/Auth are client components
- The App Router pages will be thin wrappers that render client components

### Auth Context Pattern
```typescript
// lib/auth-context.tsx
"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';

const AuthContext = createContext<{ user: User | null; loading: boolean }>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### Firestore Data Model
```
trips/{tripId}
  ├── name: "Tahoe 2026"
  ├── resort: "Palisades Tahoe"
  ├── location: { lat: 39.1968, lng: -120.2354 }
  ├── startDate: timestamp
  ├── endDate: timestamp
  ├── inviteCode: "ABC123"
  ├── createdBy: uid
  └── members: [uid1, uid2, ...]

trips/{tripId}/runs/{runId}
  ├── userId: uid
  ├── userName: "Anand"
  ├── userPhoto: "https://..."
  ├── trailName: "KT-22"
  ├── difficulty: "black"          // green | blue | black | double-black
  ├── verticalFeet: 2000
  ├── timestamp: timestamp
  └── notes: "Powder was insane"

trips/{tripId}/bets/{betId}
  ├── proposedBy: uid
  ├── proposerName: "Anand"
  ├── proposerPhoto: "https://..."
  ├── description: "Jake won't hit the terrain park today"
  ├── stakes: "Loser buys a round"
  ├── status: "open"               // open | active | resolved | cancelled
  ├── sides: {
  │     for: [{ uid, name, photo }],
  │     against: [{ uid, name, photo }]
  │   }
  ├── resolvedOutcome: null        // "for" | "against"
  ├── resolveVotes: { uid1: "for", uid2: "against" }
  ├── createdAt: timestamp
  └── resolvedAt: null

trips/{tripId}/awards/{date-string}
  ├── mvp: { odId: uid, votes: { uid1: uid2, uid2: uid3 } }
  ├── yardSale: { odId: uid, votes: { ... } }
  └── sendIt: { odId: uid, votes: { ... } }

users/{uid}
  ├── displayName: "Anand"
  ├── email: "anand@gmail.com"
  ├── photoURL: "https://..."
  └── currentTrip: tripId
```

### TypeScript Types
```typescript
// types/index.ts
import { Timestamp } from 'firebase/firestore';

export interface Trip {
  id: string;
  name: string;
  resort: string;
  location: { lat: number; lng: number };
  startDate: Timestamp;
  endDate: Timestamp;
  inviteCode: string;
  createdBy: string;
  members: string[];
}

export interface Run {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string;
  trailName: string;
  difficulty: 'green' | 'blue' | 'black' | 'double-black';
  verticalFeet: number;
  timestamp: Timestamp;
  notes?: string;
}

export interface BetSide {
  uid: string;
  name: string;
  photo: string;
}

export interface Bet {
  id: string;
  proposedBy: string;
  proposerName: string;
  proposerPhoto: string;
  description: string;
  stakes: string;
  status: 'open' | 'active' | 'resolved' | 'cancelled';
  sides: {
    for: BetSide[];
    against: BetSide[];
  };
  resolvedOutcome: 'for' | 'against' | null;
  resolveVotes: Record<string, 'for' | 'against'>;
  createdAt: Timestamp;
  resolvedAt: Timestamp | null;
}
```

---

## Feature Specs

### 1. Auth & Trip Setup

**Login Screen** (`app/page.tsx`):
- Clean landing page with app name "SHRED HQ" in bold display font
- Tagline: "Your crew's mountain dashboard"
- Single "Sign in with Google" button using shadcn `Button` with Google icon
- Uses Firebase `signInWithPopup` (desktop) or `signInWithRedirect` (mobile)
- After sign-in, redirect to `/trip` to create or join

**Trip Creation/Join** (`app/(auth)/trip/page.tsx`):
- Two shadcn `Card` options side by side (stacked on mobile):
  - **Create Trip**: Name, resort picker (searchable `Select` of popular resorts with lat/lng), date range. Generates a 6-char invite code. Uses `Button` to submit.
  - **Join Trip**: Single `Input` for invite code + `Button`. That's it.
- Popular resort presets with coordinates:
  ```typescript
  const RESORTS = [
    { name: "Palisades Tahoe", lat: 39.1968, lng: -120.2354 },
    { name: "Heavenly", lat: 38.9353, lng: -119.9400 },
    { name: "Northstar", lat: 39.2746, lng: -120.1210 },
    { name: "Kirkwood", lat: 38.6849, lng: -120.0653 },
    { name: "Mt. Rose", lat: 39.3149, lng: -119.8813 },
    { name: "Mammoth Mountain", lat: 37.6308, lng: -119.0326 },
    { name: "Park City", lat: 40.6514, lng: -111.5080 },
    { name: "Vail", lat: 39.6403, lng: -106.3742 },
    { name: "Breckenridge", lat: 39.4817, lng: -106.0384 },
    { name: "Jackson Hole", lat: 43.5877, lng: -110.8279 },
  ];
  ```
- Once in a trip, redirect to `/trip/[tripId]/mountain`

### 2. The Mountain 🏔️ (`app/(auth)/trip/[tripId]/mountain/page.tsx`)

**Purpose**: Morning check — what are conditions like today?

**Data Source**: Open-Meteo API (free, no key required)
- Endpoint: `https://api.open-meteo.com/v1/forecast`
- Params: `latitude`, `longitude`, `hourly=temperature_2m,apparent_temperature,precipitation,rain,snowfall,snow_depth,visibility,windspeed_10m,winddirection_10m,weathercode`
- Also: `current_weather=true`, `temperature_unit=fahrenheit`, `windspeed_unit=mph`

**Components**:

`weather-hero.tsx`:
- shadcn `Card` with current temp (feels-like big, actual small)
- Weather icon mapped from WMO weather codes
- Wind speed + direction
- Resort name + last updated time

`send-it-meter.tsx`:
- Fun gauge from 1-10 using shadcn `Progress` bar with custom gradient
- Rating text: 1-3 "Stay in bed", 4-5 "Meh", 6-7 "Let's ride", 8-9 "Send it!", 10 "EPIC DAY"
- Algorithm (in `lib/send-it-calculator.ts`):
  ```typescript
  export function calculateSendIt(weather: WeatherData): { score: number; label: string } {
    let score = 5; // baseline

    // Fresh snow (biggest factor)
    if (weather.snowfallLast24h > 12) score += 3;
    else if (weather.snowfallLast24h > 6) score += 2;
    else if (weather.snowfallLast24h > 2) score += 1;

    // Wind
    if (weather.windSpeed < 10) score += 1;
    else if (weather.windSpeed > 30) score -= 2;
    else if (weather.windSpeed > 20) score -= 1;

    // Visibility
    if (weather.visibility > 10000) score += 1;
    else if (weather.visibility < 1000) score -= 2;

    // Temperature sweet spot (20-32°F)
    if (weather.feelsLike >= 20 && weather.feelsLike <= 32) score += 1;
    else if (weather.feelsLike < 5 || weather.feelsLike > 40) score -= 1;

    // Active conditions
    if (weather.isSnowing) score += 0.5;
    if (weather.isRaining) score -= 3;

    return {
      score: Math.max(1, Math.min(10, Math.round(score))),
      label: getLabel(score),
    };
  }
  ```

`hourly-forecast.tsx`:
- Horizontally scrollable row of next 12 hours
- Each: time, weather icon, temp, wind
- Use `overflow-x-auto` with snap scrolling

`snow-report.tsx`:
- shadcn `Card` with fresh snow last 24h, total snow depth, snowfall forecast next 48h

### 3. The Leaderboard 🏆 (`app/(auth)/trip/[tripId]/leaderboard/page.tsx`)

**Purpose**: Friendly competition — who's shredding the hardest?

`log-run-sheet.tsx`:
- shadcn `Sheet` (slides up from bottom — perfect for mobile)
- Trail name: `Input` with autocomplete from previous entries
- Difficulty: `ToggleGroup` with colored badges (🟢🔵⬛💀)
- Vertical feet: `Input` type number
- Notes: optional `Input`
- "Log Run" `Button`
- Trigger: FAB (floating button) at bottom-right of leaderboard

`stats-overview.tsx`:
- Row of 3 mini shadcn `Card` components:
  - Total group runs today
  - Total vertical feet today (formatted with commas)
  - Today's leader (avatar + name)

`rider-rankings.tsx` / `rider-card.tsx`:
- Ranked list using shadcn `Card` for each rider
- Each card: rank #, `Avatar`, name, total vert ft, run count, hardest difficulty `Badge`
- Expandable (click to reveal individual run log)
- `Tabs` component for "Today" / "This Trip" toggle

`daily-awards.tsx`:
- Three award categories:
  - 🏆 **MVP** — Best rider of the day
  - 💀 **Yard Sale** — Gnarliest wipeout
  - 🚀 **Send It** — Boldest move
- Each: list of trip members as `Avatar` buttons to vote
- Results shown after everyone votes
- Use `Dialog` for voting confirmation

### 4. The Book 📖 (`app/(auth)/trip/[tripId]/bets/page.tsx`)

**Purpose**: Track friendly bets and settle up at the end.

`propose-bet-sheet.tsx`:
- shadcn `Sheet` from bottom
- Description: `Input` ("Jake won't hit the park today")
- Stakes: `Input` ("Loser buys a round")
- "Propose Bet" `Button`

`bet-card.tsx`:
- shadcn `Card` with:
  - Description + stakes
  - Status `Badge` (Open → amber, Active → blue, Resolved → green/red)
  - FOR / AGAINST sides with `Avatar` stacks
  - "I'm In" `Button` → `ToggleGroup` to pick side

`resolve-vote.tsx`:
- `Dialog` triggered by "Call It" button
- "Did it happen?" — Yes / No
- Auto-resolves when majority reached

`settle-up-view.tsx`:
- Debt simplification showing minimum transactions
- List of cards: "You owe Jake: dinner" / "Mike owes you: a beer"
- Since bets are fun/informal, stakes are text-based

---

## Design Direction

**Aesthetic**: Alpine-industrial meets modern dashboard. Cold, crisp, high-altitude feel. Dark mode only.

**Fonts** (load via `next/font/google` in `layout.tsx`):
- Display/headers: `Chakra Petch` weight 700 — sporty, techy, modern
- Body: `DM Sans` weight 400/500/700 — clean and readable

**Key UI Patterns**:
- Fixed bottom nav with 3 tabs (Mountain ⛰️, Leaderboard 🏆, Book 📖) using Lucide icons
- All forms use shadcn `Sheet` (bottom slide-up) — feels native on mobile
- `Skeleton` for every loading state
- `Toast` for success/error feedback
- Glassmorphism on hero cards: `bg-card/80 backdrop-blur-xl`
- Google auth avatars everywhere — personal and social
- Dark mode only: `className="dark"` on `<html>` tag
- Mobile-first (375px+), works on desktop as bonus

---

## Implementation Plan (Day-by-Day)

### Day 1: Foundation + Mountain Tab
**Claude Code prompt**:
```
Read the spec file shred-hq-spec.md. Set up a Next.js 14 App Router project with 
TypeScript, Tailwind CSS, and shadcn/ui (dark theme only). Add Firebase for auth 
(Google sign-in) and Firestore. Create the auth flow: login page with Google sign-in, 
then a trip create/join page with invite codes. Build the app shell with a fixed 
bottom tab navigation using Lucide icons. Implement the Mountain tab that fetches 
weather from Open-Meteo API and displays current conditions with a Send It meter. 
Use the component architecture and design tokens from the spec. All Firebase/Firestore 
usage must be in "use client" components.
```

Checklist:
- [ ] `npx create-next-app@latest` + `npx shadcn@latest init`
- [ ] Install shadcn components (button, card, input, select, avatar, badge, toast, skeleton, sheet, tabs, progress, separator, toggle-group, dialog)
- [ ] Custom dark theme tokens in `globals.css`
- [ ] Fonts: Chakra Petch + DM Sans via `next/font/google`
- [ ] Firebase config (`lib/firebase.ts`) with `NEXT_PUBLIC_` env vars
- [ ] Auth context provider (`lib/auth-context.tsx`)
- [ ] Login page with Google sign-in
- [ ] Trip create/join with resort picker + invite codes
- [ ] App shell with bottom nav
- [ ] Mountain tab: weather hero, Send It meter, hourly forecast, snow report
- [ ] Deploy to Vercel

### Day 2: Leaderboard Tab
**Claude Code prompt**:
```
Continue building Shred HQ per the spec. Add the Leaderboard tab at 
/trip/[tripId]/leaderboard. Build a Sheet component for logging runs (trail name, 
difficulty toggle group, vertical feet, notes). Show ranked riders sorted by total 
vertical feet with expandable cards showing individual runs. Add summary stat cards 
at top. Include a Today/Trip filter using shadcn Tabs. Add daily awards voting 
(MVP, Yard Sale, Send It) where users tap avatars to vote. All data in Firestore 
with real-time onSnapshot listeners. Use Skeleton components for loading states.
```

Checklist:
- [ ] Log Run sheet (bottom slide-up form)
- [ ] Firestore writes + real-time listeners
- [ ] Stats overview cards
- [ ] Rider rankings with expandable run history
- [ ] Today / Trip tab filter
- [ ] Daily awards voting
- [ ] Loading skeletons

### Day 3: Bets Tab + Polish
**Claude Code prompt**:
```
Finish Shred HQ per the spec. Add the Bets tab at /trip/[tripId]/bets. Build a 
Sheet for proposing bets (description + stakes). Bet cards show description, stakes, 
status badge, and avatar stacks for each side (For/Against). Users can join and pick 
sides via ToggleGroup. Add resolve flow with Dialog voting (majority rules). Build 
Settle Up view showing simplified debts. Polish everything: Skeleton loading states, 
Toast error handling, empty states with friendly messages, smooth transitions. 
Test on mobile viewport.
```

Checklist:
- [ ] Propose Bet sheet
- [ ] Bet cards with side selection
- [ ] Resolution voting dialog
- [ ] Settle Up view
- [ ] Polish: skeletons, toasts, empty states
- [ ] Mobile testing
- [ ] Final Vercel deploy

---

## Environment Variables (.env.local)

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

No weather API key needed — Open-Meteo is free with no auth.

---

## Setup Checklist (Manual Steps)

### Firebase (5 min)
1. Go to https://console.firebase.google.com → Create project "shred-hq"
2. Enable **Authentication** → Sign-in method → Enable **Google**
3. Enable **Firestore Database** → Start in test mode
4. Project Settings → Add **Web app** → Copy config values to `.env.local`
5. Auth Settings → Authorized domains → Add your Vercel URL

### Vercel (2 min)
1. Push repo to GitHub
2. Go to https://vercel.com → Import project
3. Add environment variables from `.env.local`
4. Deploy — share the URL with your crew

---

## Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }

    match /trips/{tripId} {
      allow read: if request.auth != null
        && request.auth.uid in resource.data.members;
      allow create: if request.auth != null;
      allow update: if request.auth != null
        && request.auth.uid in resource.data.members;

      match /{subcollection}/{docId} {
        allow read, write: if request.auth != null;
      }
    }
  }
}
```

---

## Quick Start for Claude Code

Drop this spec as `shred-hq-spec.md` in your project root, then paste:

```
Read the spec file shred-hq-spec.md in the project root. This is "Shred HQ" — a 
mobile-first Next.js 14 web app for a snowboarding trip crew. 

Tech stack: Next.js App Router + TypeScript + Tailwind + shadcn/ui + Firebase 
(Auth + Firestore) + Open-Meteo weather API. Deploy target is Vercel.

Start with Day 1:
1. Scaffold Next.js project with shadcn/ui (dark theme only)
2. Set up Firebase config with NEXT_PUBLIC_ env vars  
3. Build Google sign-in auth flow with AuthProvider context
4. Create trip create/join page with resort picker + invite codes
5. Build app shell with fixed bottom tab navigation (Lucide icons)
6. Implement Mountain tab: weather hero, Send It meter, hourly forecast, snow report

Follow the spec's component architecture, design tokens (alpine dark theme with 
ice blue accents), and shadcn component mapping. All Firebase usage in "use client" 
components. Mobile-first (375px+).
```

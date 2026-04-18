# MindTrack

> An AI-powered mental wellness companion for journaling emotions, tracking mood patterns, and receiving personalized insights to improve well-being.

---

## Features

**Daily Mood Tracking** — Log your mood with an intuitive slider and visualize trends over time.

**Smart Journaling** — Write daily entries enhanced with AI-powered sentiment analysis and emotion detection.

**AI Wellness Coach** — Receive personalized advice, motivational quotes, and weekly reflections tailored to your patterns.

**Analytics Dashboard** — Explore mood trends, emotion distribution, and stress patterns through thoughtful data visualizations.

**Goal & Habit Tracking** — Set wellness goals with streak counters and progress tracking.

**Calmness Activities** — Guided breathing exercises, reflection quizzes, and gratitude listing.

**AI Chatbot** — A conversational wellness assistant available for real-time support and advice.

**Dark / Light Mode** — Seamless theme switching with a polished, accessible interface.

**AI- generated motivational Quotes** — Generates personalized motivational quotes based on the user’s current mood 

**Journal & Insights Export**: Allows users to export their journals and AI-generated insights as a downloadable PDF for easy access and sharing.
---

## Tech Stack

| Layer       | Technology                                    |
|-------------|-----------------------------------------------|
| Frontend    | React 18, TypeScript, Vite                    |
| Styling     | Tailwind CSS, shadcn/ui                       |
| Animation   | Framer Motion                                 |
| Database    | Supabase (auth, storage, edge functions)      |
| AI          | Claude API (mood analysis, coaching, chat)    |
| Charts      | Recharts                                      |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd mindtrack

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Run

```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## Project Structure

```
src/
├── components/
│   ├── calmness/       # Breathing bubble, reflection quiz, gratitude listing
│   ├── chat/           # AI wellness chatbot
│   ├── coach/          # AI insight cards
│   ├── goals/          # Goal tracking cards
│   ├── insights/       # Charts and analytics components
│   ├── journal/        # Journal entry components
│   ├── layout/         # Navigation
│   ├── mood/           # Mood & stress sliders
│   └── ui/             # shadcn/ui base components
├── pages/
│   ├── LandingPage     # Public landing page
│   ├── AuthPage        # Sign in / Sign up
│   ├── HomePage        # Dashboard home with mood check-in
│   ├── JournalPage     # Daily journaling
│   ├── DashboardPage   # Analytics & insights
│   ├── GoalsPage       # Goal & habit tracking
│   ├── WellnessPage    # Calmness activities
│   ├── FeaturesPage    # Feature showcase
│   └── ProfilePage     # User profile
└── integrations/       # Supabase client & generated types
```





---

## License

[MIT](LICENSE) — built with care for mental wellness.

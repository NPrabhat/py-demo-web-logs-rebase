# RepurposeAI 🚀

**One Content → 6 Formats Instantly**

RepurposeAI is a production-ready SaaS application that transforms your content into multiple formats optimized for different platforms using AI. Paste your content once, get a Twitter thread, LinkedIn post, Instagram caption, Email newsletter, Reddit post, and key takeaways instantly.

![RepurposeAI Dashboard](./public/og-image.png)

## ✨ Features

- **6 AI-Powered Formats**: Generate Twitter threads, LinkedIn posts, Instagram captions, Email newsletters, Reddit posts, and key takeaways from a single input
- **Groq-Powered Speed**: Built on Groq Cloud API with Llama 3.3 70B for blazing-fast generation (with automatic fallback to 8B model)
- **Smart Rate Limiting**: Sequential batch processing with exponential backoff retry logic
- **Authentication**: Secure magic link and Google OAuth authentication via Supabase
- **Usage Tracking**: Free tier (5 repurposes/month) with automatic monthly reset
- **Pro Subscription**: Unlimited repurposes with Stripe payments (monthly/yearly plans)
- **History Management**: Save, view, and manage all your generated content
- **Dark Theme**: Beautiful, responsive UI with violet/indigo accents
- **Mobile Responsive**: Works perfectly on all devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database & Auth**: Supabase (PostgreSQL, Magic Link, Google OAuth)
- **AI**: Groq Cloud API (`groq-sdk`) with Llama 3.3 models
- **Payments**: Stripe (Checkout, Webhooks, Customer Portal)
- **Deployment**: Vercel-ready

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed ([download](https://nodejs.org))
- **Supabase account** ([sign up](https://supabase.com))
- **Groq account** ([create API key](https://console.groq.com))
- **Stripe account** ([sign up](https://stripe.com))

## 🚀 Setup Instructions

### Step 1: Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd repurposeai
npm install
```

### Step 2: Set Up Supabase

1. **Create a new project** at [supabase.com](https://supabase.com)
2. **Run the database schema**:
   - Go to SQL Editor in your Supabase dashboard
   - Copy the contents of `supabase/schema.sql`
   - Paste and run the SQL to create tables, indexes, triggers, and RLS policies
3. **Enable Google OAuth**:
   - Go to Authentication → Providers → Google
   - Enable Google provider
   - Add your Google OAuth credentials (from Google Cloud Console)
4. **Configure redirect URLs**:
   - Go to Authentication → URL Configuration
   - Add `http://localhost:3000/auth/callback` to Site URL
   - Add `http://localhost:3000/auth/callback` to Redirect URLs
5. **Copy your credentials**:
   - Go to Settings → API
   - Copy:
     - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
     - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - service_role key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

### Step 3: Set Up Groq

1. **Create an account** at [console.groq.com](https://console.groq.com)
2. **Create an API key**:
   - Go to API Keys
   - Click "Create API Key"
   - Copy the key → `GROQ_API_KEY`

### Step 4: Set Up Stripe

1. **Create a product**:
   - Go to Products → Add product
   - Name: "RepurposeAI Pro"
   - Description: "Unlimited AI content repurposing"
2. **Create pricing plans**:
   - Add price → Recurring → Monthly → $19.00 USD
   - Add price → Recurring → Yearly → $149.00 USD
   - Copy both Price IDs:
     - Monthly → `STRIPE_PRICE_ID_PRO_MONTHLY`
     - Yearly → `STRIPE_PRICE_ID_PRO_YEARLY`
3. **Get API keys**:
   - Go to Developers → API keys
   - Copy Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Copy Secret key → `STRIPE_SECRET_KEY`
4. **Configure webhooks**:
   - Go to Developers → Webhooks → Add endpoint
   - Endpoint URL: `http://localhost:3000/api/stripe/webhook`
   - Select events:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`
   - Click "Add endpoint"
   - Copy the Signing secret → `STRIPE_WEBHOOK_SECRET`

### Step 5: Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Fill in your values:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Groq
GROQ_API_KEY=your_groq_api_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_PRICE_ID_PRO_MONTHLY=your_monthly_price_id
STRIPE_PRICE_ID_PRO_YEARLY=your_yearly_price_id

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 6: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deploy to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. **Configure environment variables**:
   - Add all variables from `.env.local` to Vercel's environment settings
   - Update `NEXT_PUBLIC_APP_URL` to your production domain (e.g., `https://repurposeai.vercel.app`)
5. Click "Deploy"

### 3. Update External Services

**Update Supabase redirect URLs**:
- Go to Supabase Dashboard → Authentication → URL Configuration
- Add your production URL: `https://your-domain.com/auth/callback`

**Update Stripe webhook**:
- Go to Stripe Dashboard → Developers → Webhooks
- Edit your webhook endpoint
- Change URL to: `https://your-domain.com/api/stripe/webhook`
- Save changes

### 4. Test Production

- Test authentication flow
- Test content repurposing
- Test Stripe checkout (use test cards: 4242 4242 4242 4242)
- Verify webhook events are received

## 📁 Project Structure

```
repurposeai/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── repurpose/        # Main repurpose endpoint
│   │   ├── history/          # History management
│   │   ├── usage/            # Usage tracking
│   │   ├── stripe/           # Stripe integration
│   │   └── profile/          # User profile
│   ├── auth/                 # Authentication pages
│   ├── dashboard/            # Main app dashboard
│   ├── history/              # History pages
│   ├── pricing/              # Pricing page
│   ├── account/              # Account settings
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Landing page
│   └── globals.css           # Global styles
├── components/               # React components
│   ├── Header.tsx
│   ├── InputSection.tsx
│   ├── OutputSection.tsx
│   ├── FormatCard.tsx
│   ├── PricingCard.tsx
│   ├── UsageBadge.tsx
│   ├── HistoryList.tsx
│   ├── AuthModal.tsx
│   ├── UpgradeModal.tsx
│   ├── Toast.tsx
│   ├── LoadingSpinner.tsx
│   └── Footer.tsx
├── context/                  # React contexts
│   └── AuthContext.tsx
├── lib/                      # Utilities and configurations
│   ├── types.ts              # TypeScript interfaces
│   ├── constants.ts          # App constants
│   ├── groq.ts               # Groq AI integration
│   ├── prompts.ts            # AI prompts
│   ├── utils.ts              # Helper functions
│   ├── stripe.ts             # Stripe configuration
│   └── supabase/             # Supabase clients
│       ├── client.ts         # Browser client
│       ├── server.ts         # Server client
│       └── admin.ts          # Admin client
├── supabase/                 # Supabase files
│   └── schema.sql            # Database schema
├── middleware.ts             # Next.js middleware
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
└── README.md
```

## 🔑 Key Implementation Details

### AI Generation Flow
- Uses Groq SDK with `llama-3.3-70b-versatile` as primary model
- Automatic fallback to `llama-3.1-8b-instant` on errors
- Generates 6 formats in 3 sequential batches of 2
- 2.5-second delay between batches for rate limit protection
- Exponential backoff retry (1s, 2s, 4s) with max 3 retries

### Usage Tracking
- Free users: 5 repurposes per month
- Pro users: unlimited
- Automatic reset on the first of each month
- Tracked in `profiles.monthly_usage` column

### Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Service role key only used server-side for webhooks
- Stripe webhook signature verification

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

---

Built with ❤️ by RepurposeAI Team • Powered by Groq ⚡

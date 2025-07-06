# Pankaj Thakur | Personal Portfolio Website

🚀 **[Visit the Site](https://thakur.dev/)**

An AI-powered personal portfolio website with intelligent chat functionality. Built with **Next.js**, **Tailwind CSS**, and **Supabase**, featuring semantic search through portfolio content using vector embeddings.

---

## 📸 **Screenshots**

![Screenshot](/preview.png)

---

## **Tech Stack**

- **Frontend:** Next.js 15, React 19, Tailwind CSS, TypeScript
- **Database:** Supabase (PostgreSQL with pgvector)
- **AI:** Google Gemini API for embeddings and chat
- **ORM:** Drizzle ORM
- **Email:** MailerSend
- **Deployment:** Vercel

---

## � **Quick Setup for Your Own Portfolio**

### Prerequisites

- Node.js 18+ and pnpm
- Supabase account (free tier works)
- Google AI Studio account (for Gemini API) - (you can create free api)
- MailerSend account (optional, for contact form)

### 1. **Clone & Install**

```bash
git clone https://github.com/pankajthakur/portfolio.git
cd portfolio
pnpm install
```

### 2. **Environment Setup**

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```bash
# Required: Database
DATABASE_URL="postgresql://[user]:[password]@[host]:[port]/[database]?sslmode=require"

# Required: AI Features
GEMINI_API_KEY="your_gemini_api_key_here"

# Optional: Contact Form
MAILER_SEND_API_KEY="your_mailersend_api_key"
SENDER_EMAIL="your@email.com"
RECIPIENT_EMAIL="where@you-receive-messages.com"

# Environment (auto-detected, but you can override)
NODE_ENV=development
```

### 3. **Supabase Database Setup**

#### Create Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the project to be ready (2-3 minutes)
3. Go to **Settings** → **Database** → **Connection String** → **Node.js**
4. Copy the connection string and add it to your `.env.local` as `DATABASE_URL`

#### Enable Vector Extension

In your Supabase SQL Editor, run:

```sql
-- Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;
```

#### Create Database Tables

The application uses Drizzle ORM with pre-configured setup files. Simply run:

```bash
# Generate migration files
pnpm db:generate

# Apply migrations to your database
pnpm db:migrate
```

This creates two tables:

- `portfolio_data` - Stores your content with vector embeddings
- `conversations` - Stores chat history

**Optional:** View your database with Drizzle Studio:

```bash
pnpm db:studio
```

### 4. **Get API Keys**

#### Google Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Add it to `.env.local` as `GEMINI_API_KEY`

#### MailerSend API Key (Optional)

1. Sign up at [MailerSend](https://www.mailersend.com/)
2. Go to **API Tokens** and create a new token
3. Add it to `.env.local` as `MAILER_SEND_API_KEY`

### 5. **Start Development**

```bash
pnpm dev
```

Visit `http://localhost:3000` - The upload feature is automatically enabled in development!

---

## � **Adding Your Content**

### Method 1: Upload Interface (Development Only)

1. Visit `http://localhost:3000/admin/upload`
2. Use the smart paste feature or manual form
3. Categories: experience, projects, skills, education, achievements, certifications, personal, contact

### Method 2: Direct Database Insert

Use the Supabase dashboard or write a script to bulk insert your data.

### Content Structure

Each piece of content should have:

- **Content:** The main text describing your experience/project/skill
- **Category:** One of the predefined categories
- **Metadata:** JSON object with additional info (technologies, dates, links)

Example:

```json
{
  "content": "Software Engineer at TechCorp (2023-Present). Led development of microservices architecture, mentored junior developers.",
  "category": "experience",
  "metadata": {
    "company": "TechCorp",
    "role": "Software Engineer",
    "duration": "2023-Present",
    "technologies": ["React", "Node.js", "AWS"]
  }
}
```

---

## 🔧 **Customization**

### Update Portfolio Content

1. Modify `src/constants/index.tsx` for basic info
2. Update components in `src/components/` for layout changes
3. Add content via `/admin/upload` in development

### Styling

- Uses Tailwind CSS with shadcn/ui components
- Dark/light mode support with next-themes
- Modify `tailwind.config.ts` for custom themes

### AI Chat Features

- Semantic search through your portfolio content
- Powered by Google Gemini with vector embeddings
- Customize prompts in `src/lib/gemini.ts`

---

## 🚀 **Deployment**

### Security First!

The upload interface is **automatically disabled in production** to prevent unauthorized users from adding content to your portfolio.

### Deploy Steps

1. **Add Content:** Use development mode to upload your portfolio content
2. **Deploy:** Push to your hosting platform (Vercel, Netlify, Cloudflare Pages)
3. **Environment Variables:** Add your `.env.local` variables to the hosting platform
4. **Automatic Security:** Upload feature is auto-disabled in production

### Recommended Platforms

- **Cloudflare Pages** (current deployment)
- **Vercel** (excellent Next.js support)
- **Netlify** (easy setup)

---

## 🛠️ **Advanced Features**

### Rate Limiting

- Built-in rate limiting for chat API
- Configurable in `src/lib/rate-limit.ts`

### Vector Search

- Automatic embedding generation for uploaded content
- Semantic search capabilities
- Uses Google's text-embedding-004 model

### Chat Memory

- Conversation history stored in database
- Session-based memory for better context

---

## 🔍 **API Routes**

- `/api/chat` - AI chat endpoint
- `/api/ingest` - Content upload (dev only)
- `/api/send` - Contact form submission

---

## 🤝 **Contributing**

This is an open-source project! Feel free to:

1. Fork the repository
2. Create your own portfolio
3. Submit improvements via PR
4. Share your customizations

---

## 📞 **Support**

- **Issues:** Open a GitHub issue
- **Questions:** Start a discussion
- **Contact:** [thakur.dev](https://thakur.dev/)

---

**Made with ❤️ by Pankaj Thakur**

# AI Researcher Pro

A powerful, RAG-grounded deep-research application built for intense, comprehensive exploration of any topic. 

**AI Researcher Pro** is not just a chatbot—it is an autonomous agent that runs a full deep-research pipeline for your queries. It plans research, retrieves local knowledge base facts, executes web searches, reads webpages, generates/mirrors imagery, and iteratively writes a comprehensive, cited, long-form essay.

Built with **Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · shadcn/ui · Prisma · PostgreSQL (Supabase)**.

---

## 🌟 Key Features

- **🧠 Dual Intent Engine**
  The server intelligently routes your prompt: quick questions get instant, KB-grounded conversational replies, while complex requests trigger the full deep-research pipeline.

- **📚 Deep Research Pipeline**
  - **Plan**: Strategizes an outline, sets word limits, and prepares multi-query web searches.
  - **Knowledge**: Connects to a curated RAG engine (450+ hand-written passages across 48 domains) via BM25 retrieval.
  - **Search & Read**: Executes searches, visits pages, and distills web content.
  - **Write**: Systematically writes section-by-section with strict length enforcement (using context windows efficiently).
  - **Cite**: Generates inline citations for both web sources `[S#]` and verified knowledge `[K#]`.

- **📏 Flexible Research Modes**
  - **Fast**: Up to 20,000 words, 10 photos.
  - **Medium**: Up to 50,000 words, 20 photos.
  - **Max**: Up to 100,000 words, 30 photos.
  - *Note: You can override these limits by explicitly specifying a word/line count in your prompt (e.g., "write 500 lines").*

- **📸 Photo-Essay & Imagery**
  Requests a photo-essay? The AI generates a structured narrative arc interweaved with photorealistic AI-generated documentary photos. Requests a standard essay? It finds and mirrors real photographs from the web (Wikimedia Commons, DuckDuckGo) to illustrate the piece.

- **📄 PDF Context Upload**
  Upload a PDF (up to 5MB) directly in the chat! The system parses the document and attaches the extracted text to your prompt, allowing you to run deep research against your own private documents.

- **📦 Export & Portability**
  Download your finalized research as a bundled `.zip` archive (containing index.html, markdown, and all images), or export directly to Markdown.

- **⚡ Background Execution (Detached Runs)**
  Don't want to wait? Start a research query and close the tab. The server-side pipeline continues autonomously. Come back later and find the finished essay in your History.

---

## 🛠️ Stack & Architecture

- **Frontend**: React 19, Next.js App Router, TailwindCSS v4, shadcn/ui, Framer Motion.
- **Backend**: Next.js Serverless Functions, Prisma ORM, PostgreSQL (via Supabase).
- **LLM Engine**: Ollama (Local) for secure, free, uncensored intelligence, exposed via Ngrok for serverless communication.
- **Parsing**: Native PDF-parse integration.

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Ollama](https://ollama.ai/) running locally with a model (e.g., `qwen3:8b` or `llama3`).
- A PostgreSQL database (e.g., Supabase).

### 2. Installation

```bash
# Install dependencies
npm install

# Push the database schema
npx prisma db push
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
# Your PostgreSQL connection string
DATABASE_URL="postgresql://user:password@aws-0-region.pooler.supabase.com:6543/postgres"

# Your Ngrok URL pointing to local Ollama (e.g. http://localhost:11434)
OLLAMA_URL="https://your-ngrok-url.ngrok-free.dev"
```

### 4. Seed the Knowledge Base (Optional)
AI Researcher Pro comes with 450+ curated passages.
```bash
npx tsx scripts/seed-knowledge.ts
```

### 5. Start the Development Server
```bash
npm run dev
```
Visit `http://localhost:3000` to start researching.

---

## 📁 Project Structure

```text
prisma/schema.prisma        Database models (Session, Image, Message, Knowledge)
src/app/page.tsx            Client UI orchestrator and chat interface
src/app/api/chat            SSE endpoint: Intent routing & pipeline entry
src/app/api/parse-pdf       Handles document uploads (up to 5MB limit)
src/app/api/export          Markdown / HTML bundle export logic
src/lib/research/pipeline   The 7-stage research orchestration engine
src/lib/research/rag-engine BM25 text retrieval and auto-learning mechanisms
src/lib/research/llm        Ollama fetch wrapper with error resilience & JSON parsing
src/lib/research/search     Web scraping and multi-query search algorithms
src/lib/research/images     AI image generation & web image mirroring
```

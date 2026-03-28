# Reminiq

A personal memory journal app powered by Groq AI.

## Setup

1. Get a free API key at https://console.groq.com/keys
2. Create a `.env` file and add:
   ```
   VITE_GROQ_API_KEY=your-key-here
   ```
3. Run locally:
   ```
   npm install
   npm run dev
   ```

## Deploying to Vercel

1. Push this project to a GitHub repo
2. Import it on vercel.com
3. In **Settings → Environment Variables**, add:
   - `VITE_GROQ_API_KEY` = your Groq key
4. Deploy

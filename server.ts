import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Google OAuth Config
  const GOOGLE_CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  
  // Spotify OAuth Config
  const SPOTIFY_CLIENT_ID = process.env.VITE_SPOTIFY_CLIENT_ID;
  const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
  
  const APP_URL = process.env.APP_URL;

  app.use(express.json());

  // Google OAuth URL endpoint
  app.get('/api/auth/google/url', (req, res) => {
    const redirectUri = `${APP_URL}/auth/google/callback`;
    const scope = 'https://www.googleapis.com/auth/photoslibrary.readonly';
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`;
    res.json({ url });
  });

  // Spotify OAuth URL endpoint
  app.get('/api/auth/spotify/url', (req, res) => {
    const redirectUri = `${APP_URL}/auth/spotify/callback`;
    const scope = 'user-read-private user-read-email';
    const url = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&show_dialog=true`;
    res.json({ url });
  });

  // Spotify OAuth Callback endpoint
  app.get(['/auth/spotify/callback', '/auth/spotify/callback/'], async (req, res) => {
    const { code } = req.query;
    const redirectUri = `${APP_URL}/auth/spotify/callback`;

    try {
      const response = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({
        code: code as string,
        client_id: SPOTIFY_CLIENT_ID!,
        client_secret: SPOTIFY_CLIENT_SECRET!,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }).toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const { access_token } = response.data;

      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'SPOTIFY_AUTH_SUCCESS', token: '${access_token}' }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>Authentication successful. This window should close automatically.</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('Spotify OAuth Error:', error);
      res.status(500).send('Authentication failed');
    }
  });

  // Spotify Search Proxy
  app.get('/api/spotify/search', async (req, res) => {
    const token = req.headers.authorization;
    const { q } = req.query;
    if (!token) return res.status(401).json({ error: 'No token' });

    try {
      const response = await axios.get('https://api.spotify.com/v1/search', {
        headers: { Authorization: token },
        params: { q, type: 'track', limit: 10 }
      });
      res.json(response.data);
    } catch (error) {
      console.error('Spotify Search Error:', error);
      res.status(500).json({ error: 'Failed to search tracks' });
    }
  });

  // OAuth Callback endpoint
  app.get(['/auth/google/callback', '/auth/google/callback/'], async (req, res) => {
    const { code } = req.query;
    const redirectUri = `${APP_URL}/auth/google/callback`;

    try {
      const response = await axios.post('https://oauth2.googleapis.com/token', {
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      });

      const { access_token } = response.data;

      // Send success message and close popup
      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS', token: '${access_token}' }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>Authentication successful. This window should close automatically.</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('OAuth Error:', error);
      res.status(500).send('Authentication failed');
    }
  });

  // Proxy to fetch Google Photos
  app.get('/api/photos', async (req, res) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: 'No token' });

    try {
      const response = await axios.get('https://photoslibrary.googleapis.com/v1/mediaItems', {
        headers: { Authorization: token },
        params: { pageSize: 20 }
      });
      res.json(response.data);
    } catch (error) {
      console.error('Fetch Photos Error:', error);
      res.status(500).json({ error: 'Failed to fetch photos' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

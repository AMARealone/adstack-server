const express = require('express');
const { GoogleAuth } = require('google-auth-library');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

const PROJECT_ID = 'adstack-497020';
const LOCATION   = 'us-central1';

// Clé de compte de service intégrée
const SERVICE_ACCOUNT = {
  "type": "service_account",
  "project_id": "adstack-497020",
  "private_key_id": "eecc59ccbeadf37bab36065c96d130875a2b8696",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDom36DNTWSQXzb\ndn+/58AwKsrj5X/Z+4HnzfYSRuJ4kyS+IZq0+p+O/P9EkW62sYv7robAYEB8Lsv8\nsq4bvGO86V7eCEgQV91SY1OyOnQsv/gpAFOQWOVvz8c3wrVYe7yKLU7zD7OEZwxv\n0myPjax93hbZEnuQftzjtIKpMiGqzabDA3qG0+DYgjCcgpmEJjfrEmKSwRgjbWLD\n/0abX8wMPjgvgDNw9jKEwPi10hccmjK3M4BplPoFuZjZCMmqykYaAe5sWuLXFVfA\nY695ttS38z7naA3Ic/+FvuzFhEjhMetviYZu8LO0Jks20bMDTnT0qExfi4j0Fuum\nnNJdYBupAgMBAAECggEAFQ+IemfLGcV31m/EbFiW6aWOPj6C1Mv1Z0rE223Im+3d\nYfZX9B1MbMgScspk3Fd3WwqNJTDx1cHvnUnZAtDhX52VBdnOcJBhYnrKKAqBMftl\nruIFLujQSU87n0cFYBAVXOtySQakaeS3Vw6V3r+PR8w1Lw1XMRjoy23bdhIAbgme\n5rD0Q8JgF4hazOQOFQRGY7n/V2hFVaGiiUHZEpEaiVWhZMaJVqkj7I8rnEBjzzWZ\nH1+VjAEGKMLnBG7bTwN+pp0eKwuEDriVuo3zv8ypTkrLPdkDJzC//7LW0Y1qmehn\nK0DnH1xKWJ7EMpm5xZNrtlTH8f0Ya7BfWMO9WWF/SwKBgQD4YQS8nZdncXNniN7a\nOF0K9D9ZWgxZiy0zWtYSec8aJCUCJgXqPHQenJrMDPaJcoQc3Z2C6lRPY9VQ5jU7\nOlpVb3heWMweYYsvG28KxBojXW80Bo0fQfRISIMZ7b0kk2BG7eSKpm0w3Hfz/gYE\njLWCSetkbSaiD3Z+bVM94C38zwKBgQDvvpeY7cZHDy+lR4vVR/0APWGpdruZ1ZuW\n74pNkw7jqOM65QSlYKpRnQxnZsGX6AzLn+cZ95/GMCa3LxvnLKW9IpHP+koz1eKN\ndlNDYjUNjQuwIvIVtidlIlk7S56cLPVlrVZj+4Ev1x9cNA96Z/a/qz3VHFkxUrTR\nLcseEn8uBwKBgFRopDN1Wv7Mj2ugGBwRC42tc9npwEiuA65wMFAXFUrM/ca9JUV1\nRgEhN3og7afIQx2MMvtKp1xTkSrtESoPqqNePonRo4yvmZ1otVPzUO6z0hbcIxl8\nUIhAHE2zfZPwgceZERINfQ4d3qYMrf7d0tF0TYrTjU2F878DaEae6QIBAoGABCqo\n0dSYFJYT+uhiasOEhyOJ9fsFSagnuxjQq4Z5xMUjpdtjGEi0zRRQqd9kT/KNfmB6\nEL53/WbK1XYxIvRosP/PzvCHp5z5AgJjchFb4K9p25bP5Ea1KpHNQTWQPSCe5zR7\nAuPVG/K+LckN18/EvxIH0hNbDXtlfxkvpYcmxLMCgYEAw+mZiczX7DOen3xuCfz7\n5uhBnv+rAYJiVOl1epPT6Eya9xkZ9lxRCx0oPN00FUS6oC7WRe1O8QNkNamTSL7t\nEGM1U3dFFyATKX/lc7mqsgJBD3redu4OgS2tEhEw5ULret7FbF/SV+EH5ZWc1nqP\nlX8YxwRBImRMV9se7rZnZfM=\n-----END PRIVATE KEY-----\n",
  "client_email": "adstack-vertex@adstack-497020.iam.gserviceaccount.com",
  "client_id": "104511906159069635709",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/adstack-vertex%40adstack-497020.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

// Modèles Nano Banana sur Vertex AI
const MODELS = [
  'gemini-2.5-flash-image',
  'gemini-3.1-flash-image-preview',
  'gemini-3-pro-image-preview',
];

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/generate', async (req, res) => {
  console.log('→ Requête reçue, authentification...');

  let token;
  try {
    const auth = new GoogleAuth({
      credentials: SERVICE_ACCOUNT,
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });
    const client = await auth.getClient();
    const t = await client.getAccessToken();
    token = t.token;
    console.log('✓ Token obtenu');
  } catch (err) {
    console.error('✗ Auth error:', err.message);
    return res.status(401).json({ error: 'Authentification échouée : ' + err.message });
  }

  const errors = [];

  for (const model of MODELS) {
    const url = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${model}:generateContent`;
    console.log(`→ Essai modèle : ${model}`);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });

      const data = await response.json();

      if (data.error) {
        console.warn(`✗ ${model}:`, data.error.message);
        errors.push(`${model} → ${data.error.message}`);
        continue;
      }

      const parts = data.candidates?.[0]?.content?.parts || [];
      const imagePart = parts.find(p =>
        p.inlineData?.mimeType?.startsWith('image/') ||
        p.inline_data?.mime_type?.startsWith('image/')
      );

      if (imagePart) {
        const imgData = imagePart.inlineData || imagePart.inline_data;
        console.log(`✓ Image générée avec ${model}`);
        return res.json({
          model,
          imageData: imgData.data,
          imageMime: imgData.mimeType || imgData.mime_type,
        });
      }

      errors.push(`${model} → Pas d'image dans la réponse`);
    } catch (err) {
      errors.push(`${model} → ${err.message}`);
    }
  }

  return res.status(500).json({ error: 'Erreurs :\n' + errors.join('\n') });
});

app.listen(PORT, () => {
  console.log(`\n✅ AdStack Proxy démarré → http://localhost:${PORT}\n`);
});

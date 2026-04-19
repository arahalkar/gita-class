import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { google } from 'googleapis';
import multer from 'multer';
import dotenv from 'dotenv';
import { Readable } from 'stream';

dotenv.config();

const upload = multer({ storage: multer.memoryStorage() });

// Helper to get Google Auth
function getGoogleAuth(scopes: string[]) {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  
  if (!email || !key) {
    return null;
  }

  return new google.auth.JWT({
    email,
    key,
    scopes
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/students', async (req, res) => {
    try {
      const auth = getGoogleAuth(['https://www.googleapis.com/auth/spreadsheets']);
      if (!auth || !process.env.GOOGLE_SHEET_ID) {
        // Mock data for demo/no-config
        return res.json([
          { id: '2024-042', name: 'Arjun Sharma', grade: 'Grade 5', points: 1250, streak: 14 },
          { id: '2024-001', name: 'Meera Patel', grade: 'Grade 6', points: 2450, streak: 21 },
          { id: '2024-015', name: 'Rohan Iyer', grade: 'Grade 4', points: 2310, streak: 18 },
        ]);
      }
      
      const sheets = google.sheets({ version: 'v4', auth });
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Students!A2:E',
      });
      
      const rows = response.data.values || [];
      const students = rows.map(row => ({
        id: row[0],
        name: row[1],
        grade: row[2],
        points: parseInt(row[3]) || 0,
        streak: parseInt(row[4]) || 0
      }));
      
      res.json(students);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch students' });
    }
  });

  app.post('/api/attendance', async (req, res) => {
    const { studentId, date } = req.body;
    try {
      const auth = getGoogleAuth(['https://www.googleapis.com/auth/spreadsheets']);
      if (!auth || !process.env.GOOGLE_SHEET_ID) {
        return res.json({ success: true, message: 'Mock attendance recorded' });
      }
      const sheets = google.sheets({ version: 'v4', auth });
      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Attendance!A:C',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[studentId, date, 'Present']]
        }
      });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to record attendance' });
    }
  });

  app.post('/api/homework', upload.single('audio'), async (req: any, res: any) => {
    const { studentId, shloka } = req.body;
    const file = req.file;

    try {
      const auth = getGoogleAuth([
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file'
      ]);

      if (!auth || !process.env.GOOGLE_SHEET_ID || !file) {
        return res.json({ 
          success: true, 
          audioUrl: 'https://example.com/audio.mp3', 
          message: 'Mock upload success - No credentials or file found' 
        });
      }

      const drive = google.drive({ version: 'v3', auth });
      const driveResponse = await drive.files.create({
        requestBody: {
          name: `Homework_${studentId}_${Date.now()}.mp3`,
          parents: [process.env.GOOGLE_DRIVE_FOLDER_ID || ''],
        },
        media: {
          mimeType: file.mimetype,
          body: Readable.from(file.buffer),
        },
        fields: 'id, webViewLink'
      });

      const audioUrl = driveResponse.data.webViewLink;

      // Log link to sheet
      const sheets = google.sheets({ version: 'v4', auth });
      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Homework!A:D',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[studentId, new Date().toISOString(), shloka, audioUrl]]
        }
      });

      res.json({ success: true, audioUrl });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to upload homework' });
    }
  });

  // Vite setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
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

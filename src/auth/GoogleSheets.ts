import { google } from 'googleapis';

async function googleSheetsAPI() {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets'
  });

  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: 'v4', auth: client } as any);

  return googleSheets;
}

export default googleSheetsAPI;
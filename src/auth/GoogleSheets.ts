import { google } from 'googleapis';

// Define an asynchronous function to initialize the Google Sheets API
async function googleSheetsAPI() {
  // Create a new GoogleAuth instance
  const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets'
  });

  // Get an authenticated OAuth2 client
  const client = await auth.getClient();

  // Create a new instance of the Google Sheets API v4
  const googleSheets = google.sheets({ version: 'v4', auth: client } as any);

  // Return the Google Sheets API instance
  return googleSheets;
}

export default googleSheetsAPI;
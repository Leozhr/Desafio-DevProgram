import googleSheetsAPI from "../auth/GoogleSheets";
import getStudentStatus from "../utils/GetStudentStatus";

// Define an interface for the Student object
interface Student {
  spreadsheetId: string | undefined;
  spreadsheetPage: string | undefined;
  getStudentResults: number[][] | undefined;
}

// Asynchronous function to set the situation for each student
async function setStudentSituation({ spreadsheetId, spreadsheetPage, getStudentResults }: Student) {
  try {
    // Initialize the Google Sheets API
    const googleSheets = await googleSheetsAPI();

    // Clear the values in column G from row 4 onwards
    await googleSheets.spreadsheets.values.clear({
      spreadsheetId,
      range: `${spreadsheetPage}!G4:G`,
    });

    // Clear the values in column H from row 4 onwards
    await googleSheets.spreadsheets.values.clear({
      spreadsheetId,
      range: `${spreadsheetPage}!H4:H`,
    });

    // If there are no student results, return false
    if (!getStudentResults) return false;
    
    const formattedResults = getStudentResults.map((student) => {
      // Destructure the average and absences from the student array
      const [average, absences] = student;

      // Get the student status based on their average and absences
      const { situation, naf } = getStudentStatus({ average, absences });

      // Return the situation and naf in an array
      return [situation, naf];
    })

    // If there are no formatted results, return false
    if (!formattedResults) return false;

    // Append the formatted results to the Google Sheet
    await googleSheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${spreadsheetPage}!G4:H4`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [...formattedResults]
      }
    });

    return true;
  } catch (error) {
    // Log any errors that occur during the execution
    console.error(error);
  }
}

export default setStudentSituation;
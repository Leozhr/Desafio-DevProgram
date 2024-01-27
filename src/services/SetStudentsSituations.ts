import googleSheetsAPI from "../auth/GoogleSheets";
import getStudentStatus from "../utils/GetStudentStatus";

// Define an interface for the Student object
interface Student {
  spreadsheetId: string | undefined;
  spreadsheetPage: string | undefined;
  getStudentResults: number[][] | null | undefined;
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

    // Initialize the row index to 4
    let rowIndex = 4;

    // Loop over each student's results
    for (const student of getStudentResults!) {
      // Destructure the average and absences from the student's results
      const [average, absences] = student;

      // Get the situation and naf for the student
      const { situation, naf } = getStudentStatus({ average, absences });

      // Append the situation and naf to the Google Sheet
      await googleSheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${spreadsheetPage}!G${rowIndex}:H${rowIndex}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [
            [situation, naf]
          ]
        }
      });

      // Increment the row index for the next student
      rowIndex++;
    }

    return true;
  } catch (error) {
    console.error('Error setting student situations:');
  }
}

export default setStudentSituation;
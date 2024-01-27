import googleSheetsAPI from "../auth/GoogleSheets";

// Define an interface for the Student object
interface Student {
  spreadsheetId: string | undefined;
  spreadsheetPage: string | undefined;
}

// rounding up if the decimal part is 0.5 or greater
function customRound(number: number) {
  const decimal = number - Math.floor(number);
  return decimal >= 0.5 ? Math.ceil(number) : Math.floor(number);
}

// Asynchronous function to get the results for each student
async function getStudentResult({ spreadsheetId, spreadsheetPage }: Student) {
  try {
    // Initialize the Google Sheets API
    const googleSheets = await googleSheetsAPI(); 

    // Get the average scores for each student
    const average = await googleSheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${spreadsheetPage}!D4:F`
    })

    // Get the number of absences for each student
    const absence = await googleSheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${spreadsheetPage}!C4:C`
    })

    // Extract the values from the API responses
    const averageResult = average.data.values;
    const absenceResult = absence.data.values;

    // If either result is null, return null
    if (!averageResult || !absenceResult) return null;

    // Calculate the average score for each student
    const averageData = averageResult.map(row =>
      row.reduce((acc, value) => acc + parseFloat(value), 0) / row.length
    );

    // Scale the average scores and round to the nearest integer
    const averageScale = averageData.map((sum) => customRound((sum / 100) * 10));

    // Calculate the total number of absences for each student
    const absenceValue: number[] = absenceResult.map(row => 
      row.reduce((acc, value) => acc + parseInt(value), 0)
    );

    // Combine the average scores and absences into a single array
    const studentsResults = averageScale.map((value, index) => [value, absenceValue[index]]);

    // Return the results
    return studentsResults;
  } catch (error) {
    // Log any errors that occur during the execution
    console.log(error);
  }
}

export default getStudentResult;
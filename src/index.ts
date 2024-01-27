import dotenv from "dotenv";
import ora from 'ora';
import getStudentResult from './services/GetStudentsResults';
import setStudentSituation from "./services/SetStudentsSituations";
import messages from '../messages.json';

// Import dotenv to load environment variables
dotenv.config();

// Get the Google Sheets API key and page from environment variables
const spreadsheetId = process.env.GOOGLESHEET_API_KEY;
const spreadsheetPage = process.env.GOOGLESHEET_PAGE;

async function main() { 
  try {
    // Initialize the spinner for loading student results
    const spinnerResult = ora(messages.loadingStudentResults).start();

    // Get the student results from the Google Sheet
    const getStudentResults = await getStudentResult({
      spreadsheetId,
      spreadsheetPage
    });

    // If there was an error getting the student results, stop the spinner and log the error
    if (!getStudentResults) {
      spinnerResult.stop().fail(messages.errorLoadingStudents);
      return;
    }

    // If the student results were loaded successfully, stop the spinner
    spinnerResult.stop().succeed(messages.studentsLoadedSuccessfully);

    // Initialize the spinner for setting student situations
    const spinnerSituations = ora(messages.settingStudentSituations).start();

    // Set the student situations based on the results
    const setStudentSituations = await setStudentSituation({
      spreadsheetId,
      spreadsheetPage,
      getStudentResults
    })

    // If there was an error setting the student situations, stop the spinner and log the error
    if (!setStudentSituations) {
      spinnerSituations.stop().fail(messages.errorSettingStudentSituations);
      return;
    }

    // If the student situations were set successfully, stop the spinner
    spinnerSituations.stop().succeed(messages.studentsSettingSuccessfully);
  } catch (error) {
    // Log any errors that occur during the execution
    console.error(error);
  }
}

main();
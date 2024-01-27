// Define an interface for the Student object
interface Student {
  average: number;
  absences: number;
}

// Function to determine the status of a student based on their average grade and number of absences
function getStudentStatus({ average, absences }: Student) {
  // Calculate the limit for absences (25% of total classes)
  const absenceLimit: number = 60 * 0.25;

  // Check if the student has more absences than the limit
  if (absences > absenceLimit) {
    return { situation: "Reprovado por Falta", naf: 0 }; // If so, the student fails due to absences
  }

  // Check if the student's average is less than 5
  if (average < 5) {
    return { situation: "Reprovado por Nota", naf: 0 }; // If so, the student fails due to low grade
  }

  // Check if the student's average is less than 7
  if (average < 7) {
    const naf = Math.max(0, (10 - average)); // Calculate the minimum grade needed to pass the exam
    return { situation: "Exame Final", naf }; // If so, the student needs to take a final exam
  }

  // If none of the above conditions are met, the student passes
  return { situation: "Aprovado", naf: 0 };
}

export default getStudentStatus;
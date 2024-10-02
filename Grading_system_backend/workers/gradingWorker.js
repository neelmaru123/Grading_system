const gradingQueue = require('../queues/gradingQueue');
const fs = require('fs');
const Student = require('../models/student_model'); // Assuming you have a Student model
const geminiIntegration = require('./Gemini_Integration'); 
const extractTextAndImagesFromPDF = require('./extract_pdf')

gradingQueue.process(async (job) => {
  const { studentId, assignmentId, filePath } = job.data;

  try {
    
    // Step 1: Extract text from the PDF
    const pdfBuffer = fs.readFileSync(filePath);

    // const extractedText = await pdfParser(pdfBuffer);
    const extractedText = await extractTextAndImagesFromPDF(pdfBuffer);

    // // Step 2: Call the Gemini API for grading
    geminiGrade = await geminiIntegration(extractedText.text);

    // // Step 3: Update student's assignment grade in the database
    // await Student.findByIdAndUpdate(
    //   studentId,
    //   { $push: { assignments: { id: assignmentId, grade: geminiGrade } } },
    //   { new: true }
    // );

    

    console.log(`Grading completed for student: ${studentId}`);
  } catch (error) {
    console.error(`Failed to process grading for student ${studentId}:`, error);
  }
});

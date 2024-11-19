const gradingQueue = require('../queues/gradingQueue');
const fs = require('fs');
const Student = require('../models/student_model'); // Assuming you have a Student model
const geminiIntegration = require('./Gemini_Integration'); 
const extractTextAndImagesFromPDF = require('./extract_pdf')

gradingQueue.process(async (job) => {
  console.log(job.data);
  const { studentId, assignmentId, filePath } = job.data;

  try {
    // const extractedText = await pdfParser(pdfBuffer);
    const extractedText = await extractTextAndImagesFromPDF(filePath);

    // Step 2: Call the Gemini API for grading
    geminiGrade = await geminiIntegration(extractedText.text);

    fs.unlink(filePath, (err) => {
      if (err) console.error(`Failed to delete file: ${filePath}`, err);
      else console.log(`File deleted: ${filePath}`);
    });

    console.log(geminiGrade.overallGrade);
    console.log(geminiGrade.overallFeedback);
    
    // Step 3: Update student's assignment grade in the database
    await Student.findByIdAndUpdate(
      studentId,
      {
        $push: {
          assignments: {
            assignmentId: assignmentId,
            grade: geminiGrade.overallGrade,
            remarks: geminiGrade.overallFeedback
          }
        }
      },
      { new: true } // Return the updated document
    )
    .then((updatedStudent) => {
      console.log(`Updated student: ${updatedStudent}`);
    })
    
    console.log(`Grading completed for student: ${studentId}`);
  } catch (error) {
    console.error(`Failed to process grading for student ${studentId}:`, error);
  }
});

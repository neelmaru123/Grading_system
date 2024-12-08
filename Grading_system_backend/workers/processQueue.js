const AssignmentQueue = require('../models/AssignmentQueue_model');
const assignmentModel = require('../models/assignment_model');
const Student = require('../models/student_model');
const extractTextAndImagesFromPDF = require('../workers/extract_pdf');
const callPythonAPI = require('../workers/model');
const fs = require('fs');
const Notification = require('../models/notification_model');

const processQueue = async () => {
    try {
        const queueItems = await AssignmentQueue.find({ status: 'pending' });

        for (const item of queueItems) {
            const { studentId, assignmentId, filePath } = item;

            try {
                const assignment = await assignmentModel.findById(assignmentId);
                if (!assignment) {
                    console.error(`Assignment not found: ${assignmentId}`);
                    continue;
                }

                const extractedText = await extractTextAndImagesFromPDF(filePath);
                const assignmentGrade = await callPythonAPI({
                    sample: assignment.description,
                    assignment: extractedText.text
                });

                fs.unlink(filePath, (err) => {
                    if (err) console.error(`Failed to delete file: ${filePath}`, err);
                    else console.log(`File deleted: ${filePath}`);
                });

                // Step 3: Update student's assignment grade in the database
                await Student.findByIdAndUpdate(
                    studentId,
                    {
                        $push: {
                            assignments: {
                                assignmentId: assignmentId,
                                grade: assignmentGrade.grade,
                                remarks: assignmentGrade.remarks,
                            }
                        }
                    },
                    { new: true } // Return the updated document
                )
                    .then(async (updatedStudent) => {
                        console.log(`Updated student: ${updatedStudent}`);
                        // Create notification for grade submission
                        const createdAt = new Date();
                        createdAt.setDate(createdAt.getDate() + 1);
                        const notification = new Notification({
                            title: "Assignment Graded",
                            message: `Your assignment has been graded of subject. Grade: ${assignmentGrade.grade}`,
                            studentId: studentId,
                            createdAt: createdAt,
                            type: "student"
                        });
                        await notification.save();
                    })

                await assignmentModel.findByIdAndUpdate(
                    assignmentId,
                    $push = {
                        students: {
                            studentId: studentId,
                            grade: assignmentGrade.grade,
                        }
                    }
                )
                    .then((updatedAssignment) => {
                        console.log(`Updated assignment: ${updatedAssignment}`);
                    })

                item.status = 'completed';
                await item.save();
            } catch (err) {
                console.error(`Failed to process assignment for student ${studentId}:`, err);
                item.status = 'failed';
                await item.save();
            }
        }
    } catch (err) {
        console.error('Error processing queue:', err);
    }
};

module.exports = {
    processQueue
};
const { ObjectId } = require('mongodb'); // Import ObjectId from MongoDB

// Sample data with realistic ObjectIDs
const data = {
  faculties: [
    {
      _id: new ObjectId("6735abe99c0e737f8ad306a9"),
      name: "Dr. John Doe",
      email: "johndoe@example.com",
      password: "securepassword1",
      department: "Computer Science",
      assignments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  semesters: [
    {
      _id: new ObjectId("6735abe99c0e737f8ad306b0"),
      semesterName: "Fall 2024",
      totalStudents: 50,
      subjects: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  students: [
    {
      _id: new ObjectId("6735abe99c0e737f8ad306b1"),
      name: "Alice Smith",
      rollNo: 101,
      email: "alice@example.com",
      password: "securepassword2",
      department: "Computer Science",
      semester: null, // Will be updated later
      assignments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  assignments: [
    {
      _id: new ObjectId("6735abe99c0e737f8ad306b2"),
      title: "Binary Trees Assignment",
      description: "Implement and analyze binary trees.",
      deadline: new Date("2024-11-25T23:59:59Z"),
      subjectName: "Data Structures",
      subjectId: null, // Will be updated later
      facultyId: null, // Will be updated later
      students: [],
      pendingStudentsCount: 50,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  subjects: [
    {
      _id: new ObjectId("6735abe99c0e737f8ad306b3"),
      subjectName: "Data Structures",
      facultyId: null, // Will be updated later
      semesterId: null, // Will be updated later
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
};

// Establish connections
data.faculties[0].assignments.push({ assignmentId: data.assignments[0]._id });

data.semesters[0].subjects.push({
  subjectId: data.subjects[0]._id,
  subjectName: data.subjects[0].subjectName,
  facultyId: data.faculties[0]._id,
});

data.students[0].semester = data.semesters[0]._id;
data.students[0].assignments.push({
  assignmentId: data.assignments[0]._id,
  grade: "A",
  remarks: "Excellent work",
  submissionDate: new Date("2024-11-18T10:00:00Z"),
});

data.assignments[0].facultyId = data.faculties[0]._id;
data.assignments[0].subjectId = data.subjects[0]._id;
data.assignments[0].students.push({
  studentId: data.students[0]._id,
  grade: "A",
});

data.subjects[0].facultyId = data.faculties[0]._id;
data.subjects[0].semesterId = data.semesters[0]._id;

console.log(JSON.stringify(data, null, 2));

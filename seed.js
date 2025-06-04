// seed.js

const mongoose = require('mongoose');
const DB = require('./Database/index.js'); // Assuming your db.js is in the same directory
const bcrypt = require('bcrypt'); // For password hashing

// Define User Schema (as provided by you)
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    category: { type: String, enum: ['student', 'teacher'] },
  },
  { timestamps: true }
);

// Define Course Schema (as provided by you)
const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    lessons: {
      title: { type: String, required: true },
      material: { type: String, required: true },
      assignment: {
        title: {
          type: String,
          required: true
        },
        material: {
          type: String,
          required: true
        },
        document: {
          type: String,
          required: true
        }
      }
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  },
  { timestamps: true }
);

// Create Mongoose Models
const User = mongoose.model('User', userSchema);
const Course = mongoose.model('Course', courseSchema);

// Number of records to generate
const NUM_RECORDS = 50;
const SALT_ROUNDS = 12; // From your .env file

const seedDatabase = async () => {
  try {
    console.log('--- Starting database seeding ---');

    // Ensure connection is open
    if (DB.readyState !== 1) {
      console.log('Waiting for database connection...');
      await new Promise(resolve => DB.once('open', resolve));
      console.log('Database connected.');
    }

    // Clear existing data
    console.log('Clearing existing users and courses...');
    await User.deleteMany({});
    await Course.deleteMany({});
    console.log('Existing data cleared.');

    // --- Generate Users ---
    console.log(`Generating ${NUM_RECORDS} users...`);
    const users = [];
    const userIds = [];
    for (let i = 0; i < NUM_RECORDS; i++) {
      const username = `user${i + 1}`;
      const name = `Test User ${i + 1}`;
      const email = `user${i + 1}@example.com`;
      const password = await bcrypt.hash('password123', SALT_ROUNDS); // Hash a default password
      const category = i % 2 === 0 ? 'student' : 'teacher'; // Alternate categories

      users.push({ username, name, email, password, category });
    }

    const insertedUsers = await User.insertMany(users);
    insertedUsers.forEach(user => userIds.push(user._id));
    console.log(`${insertedUsers.length} users inserted.`);

    // --- Generate Courses ---
    console.log(`Generating ${NUM_RECORDS} courses...`);
    const courses = [];
    for (let i = 0; i < NUM_RECORDS; i++) {
      const courseName = `Course Title ${i + 1}: Introduction to Topic ${i + 1}`;
      const lessonTitle = `Lesson ${i + 1} Basics`;
      const lessonMaterial = `This lesson covers the fundamental concepts of Topic ${i + 1}. You will learn about key principles and applications.`;
      const assignmentTitle = `Assignment ${i + 1}: Practical Application`;
      const assignmentMaterial = `Complete the exercises related to Topic ${i + 1} and submit your findings.`;
      const assignmentDocument = `https://example.com/documents/assignment${i + 1}.pdf`;

      // Assign an owner from the inserted users (round-robin)
      const ownerId = userIds[i % userIds.length];

      courses.push({
        name: courseName,
        lessons: {
          title: lessonTitle,
          material: lessonMaterial,
          assignment: {
            title: assignmentTitle,
            material: assignmentMaterial,
            document: assignmentDocument
          }
        },
        owner: ownerId
      });
    }

    const insertedCourses = await Course.insertMany(courses);
    console.log(`${insertedCourses.length} courses inserted.`);

    console.log('--- Database seeding completed successfully! ---');
  } catch (error) {
    console.error('Error during database seeding:', error);
  } finally {
    // Close the database connection
    console.log('Closing database connection...');
    await DB.close();
    console.log('Database connection closed.');
    process.exit(0); // Exit the process cleanly
  }
};

// Execute the seeding function
seedDatabase();

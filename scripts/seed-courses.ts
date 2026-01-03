import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
import type { Course } from "../src/types/course";

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
dotenv.config({ path: envPath });

// Initialize Firebase with production config
const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
});

const db = getFirestore(app);

// Helper function to convert data to Firestore-compatible format
function convertToFirestore(data: any): any {
  // Handle null/undefined
  if (data === null || data === undefined) {
    return null;
  }
  
  // Handle Firestore Timestamp - check if it's already a Timestamp
  if (data && typeof data === 'object' && 'seconds' in data && 'nanoseconds' in data) {
    // Already a Firestore Timestamp, return as-is
    return data;
  }
  
  // Handle Date objects
  if (data instanceof Date) {
    return Timestamp.fromDate(data);
  }
  
  // Handle arrays
  if (Array.isArray(data)) {
    return data.map(convertToFirestore);
  }
  
  // Handle plain objects
  if (typeof data === 'object' && data !== null && data.constructor === Object) {
    const converted: any = {};
    for (const [key, value] of Object.entries(data)) {
      // Skip undefined values (Firestore doesn't support them)
      if (value === undefined) {
        continue;
      }
      // Skip fields that start with __ (Firestore reserved)
      if (key.startsWith('__')) {
        continue;
      }
      converted[key] = convertToFirestore(value);
    }
    return converted;
  }
  
  // Return primitives as-is
  return data;
}

async function seedCourses() {
  const now = Timestamp.now();
  const coursesDir = path.resolve(process.cwd(), "courses");
  
  // Read all JSON files from the courses directory
  const courseFiles = fs.readdirSync(coursesDir).filter(file => file.endsWith('.json'));
  
  console.log(`Found ${courseFiles.length} course files: ${courseFiles.join(', ')}`);
  console.log("Seeding courses to Firestore...");

  for (const file of courseFiles) {
    try {
      const filePath = path.join(coursesDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const courseData = JSON.parse(fileContent) as Course;

      // Override timestamps with current time for consistency
      courseData.createdAt = now as any;
      courseData.updatedAt = now as any;

      const courseRef = doc(collection(db, "courses"), courseData.id);
      // Exclude top-level 'id' from document data since it's the document ID
      const { id, ...dataToSave } = courseData;
      
      // Convert the data to Firestore-compatible format
      const firestoreData = convertToFirestore(dataToSave);
      
      // Log the structure to debug
      console.log(`Attempting to seed: ${courseData.title} (${courseData.id})`);
      console.log(`Modules count:`, firestoreData.modules?.length || 0);
      
      // Write all data at once
      await setDoc(courseRef, firestoreData);
      console.log(`✓ Seeded course: ${courseData.title} (${courseData.id})`);
    } catch (error: any) {
      console.error(`✗ Failed to seed course from file: ${file}`);
      console.error(`Error details:`, error.message);
      if (error.code) {
        console.error(`Error code: ${error.code}`);
      }
      throw error; // Re-throw to stop the process
    }
  }

  console.log(`\n✓ Successfully seeded ${courseFiles.length} courses with modules and lessons!`);
}

// Run the seed function
seedCourses()
  .then(() => {
    console.log("Seed script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error seeding courses:", error);
    process.exit(1);
  });


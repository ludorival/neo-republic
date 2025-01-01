import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin
const serviceAccount = JSON.parse(readFileSync(join(__dirname, '../serviceAccount.json'), 'utf8'));
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

// Read and parse the JSON file
const programs = JSON.parse(readFileSync(join(__dirname, './DemoPrograms.json'), 'utf8'));

// Import each program
async function importPrograms() {
  try {
    const batch = db.batch();
    
    // Add first program
    const prog1Ref = db.doc('programs/demo-program-1');
    batch.set(prog1Ref, programs[0]);
    
    // Add second program
    const prog2Ref = db.doc('programs/demo-program-2');
    batch.set(prog2Ref, programs[1]);
    
    await batch.commit();
    console.log('Programs imported successfully!');
  } catch (error) {
    console.error('Error importing programs:', error);
  } finally {
    process.exit();
  }
}

importPrograms(); 
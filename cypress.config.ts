import { defineConfig } from "cypress";
import { plugin as cypressFirebasePlugin } from 'cypress-firebase';
import admin from 'firebase-admin';
import { config } from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';

// Try loading .env.local first, then fall back to .env
const envPath = existsSync(resolve(process.cwd(), '.env.local'))
  ? resolve(process.cwd(), '.env.local')
  : resolve(process.cwd(), '.env');

// Load env files if they exist, but don't fail if they don't
config({ path: envPath });

// Log which file was loaded (if any)
if (existsSync(envPath)) {
  console.log(`📄 Loaded environment from: ${envPath}`);
} else {
  console.log('⚠️ No .env.local or .env file found. Using existing environment variables.');
}

export default defineConfig({
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
    retries: {
      runMode: 1,
      openMode: 0
    }
  },

  e2e: {
    baseUrl: 'https://neo-republic-sandbox--neo-republic-sandbox.europe-west4.hosted.app',
    retries: {
      runMode: 1,
      openMode: 0
    },
    setupNodeEvents(on, config) {
      // Add env variables to Cypress config
      config.env = config.env || {};
      config.env.FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
      config.env.FIREBASE_AUTH_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
      config.env.FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      config.env.FIREBASE_STORAGE_BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
      config.env.FIREBASE_MESSAGING_SENDER_ID = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
      config.env.FIREBASE_APP_ID = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
      return cypressFirebasePlugin(on, config, admin, {
        projectId: 'neo-republic-sandbox',
      });
    },
  },
});

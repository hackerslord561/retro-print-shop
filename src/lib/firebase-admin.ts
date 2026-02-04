import "server-only";
import admin from "firebase-admin";

interface FirebaseAdminParams {
    projectId: string;
    clientEmail: string;
    privateKey: string;
}

function formatPrivateKey(key: string) {
    // 1. If key is undefined, return empty to fail gracefully later
    if (!key) return "";

    // 2. Replace literal "\n" strings with actual newlines
    // This fixes the common issue where .env variables escape the breaks
    return key.replace(/\\n/g, "\n");
}

export function createFirebaseAdminApp(params: FirebaseAdminParams) {
    const privateKey = formatPrivateKey(params.privateKey);

    // Check if we already have an app initialized to prevent "App already exists" error
    if (admin.apps.length > 0) {
        return admin.app();
    }

    // Check if keys are present before initializing
    if (!privateKey || !params.clientEmail || !params.projectId) {
        throw new Error("Missing Firebase Admin credentials. Check your .env.local file.");
    }

    return admin.initializeApp({
        credential: admin.credential.cert({
            projectId: params.projectId,
            clientEmail: params.clientEmail,
            privateKey: privateKey,
        }),
    });
}

export async function initAdmin() {
    const params = {
        projectId: process.env.FIREBASE_PROJECT_ID as string,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
        privateKey: process.env.FIREBASE_PRIVATE_KEY as string,
    };

    return createFirebaseAdminApp(params);
}
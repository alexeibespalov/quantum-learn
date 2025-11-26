/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions";

// Set global options
setGlobalOptions({ maxInstances: 10 });

// Export Genkit flows
export * from "./genkit-sample";
export * from "./tutor";
export * from "./practice";
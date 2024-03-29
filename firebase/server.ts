import Roles from "@/app/types/roles";
import {
    ServiceAccount,
    cert,
    getApps,
    initializeApp,
} from "firebase-admin/app";
import { Auth, getAuth } from "firebase-admin/auth";
import { Firestore, getFirestore } from "firebase-admin/firestore";
import { Storage, getStorage } from "firebase-admin/storage";
const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
);

let firestore: Firestore | undefined = undefined;
let auth: Auth | undefined = undefined;
let storage: Storage | undefined = undefined;

const currentApps = getApps();
if (currentApps.length <= 0) {
    if (process.env.NEXT_PUBLIC_APP_ENV === "emulator") {
        process.env["FIRESTORE_EMULATOR_HOST"] =
            process.env.NEXT_PUBLIC_EMULATOR_FIRESTORE_PATH;
        process.env["FIREBASE_AUTH_EMULATOR_HOST"] =
            process.env.NEXT_PUBLIC_EMULATOR_AUTH_PATH;
    }

    const app = initializeApp({
        credential: cert(serviceAccount as ServiceAccount),
    });

    firestore = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);

    if (process.env.NEXT_PUBLIC_APP_ENV === "emulator") {
        // add default coordinator to emulator database
        const whitelistCollection = firestore.collection("whitelist");
        whitelistCollection.add({
            email: "coordinator@example.com",
            role: "COORDINATOR",
        })
    }

} else {
    firestore = getFirestore(currentApps[0]);
    auth = getAuth(currentApps[0]);
    storage = getStorage(currentApps[0]);
}


export { auth, firestore, storage };


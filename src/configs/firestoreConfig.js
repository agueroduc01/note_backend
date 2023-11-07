const admin = require("firebase-admin");
const serviceAccount = require("../../note-pro-91c72-firebase-adminsdk-iazk3-2346ed8221.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();
const adminAuth = admin.auth();
const storage = admin.storage();
const FirebaseFirestore = admin.firestore;
module.exports = { firestore, adminAuth, storage, FirebaseFirestore };

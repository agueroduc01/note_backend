const admin = require('firebase-admin');
const serviceAccount = require('../../note-api-7cee0-firebase-adminsdk-kwlap-f2e6bb1a46.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();
const adminAuth = admin.auth();
const storage = admin.storage();
const FirebaseFirestore = admin.firestore;
module.exports = { firestore, adminAuth, storage, FirebaseFirestore };

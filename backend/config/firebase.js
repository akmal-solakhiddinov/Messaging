var admin = require("firebase-admin");
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);



admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://chatbox-2fa07.appspot.com'
});


const storage = admin.storage().bucket();

module.exports = { storage };
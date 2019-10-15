import admin from 'firebase-admin';

const serviceAccount = require('../firebase.json');

export function initializeFirebaseApp() {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://frontend-topics-blog.firebaseio.com',
  });
}


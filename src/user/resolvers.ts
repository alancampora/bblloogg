import admin from 'firebase-admin';
import { DocumentSnapshot, DocumentData } from '@google-cloud/firestore';

export default {
  Query: {
    async users() {
      try {
        const users = await admin
          .firestore()
          .collection('user')
          .get();
        return users.docs.map(user => user.data());
      } catch (error) {
        console.log(error);
      }
    },
    async user(_: any, args: { id: string }) {
      try {
        const userDoc: DocumentSnapshot = await admin
          .firestore()
          .doc(`user/${args.id}`)
          .get();

        const userDocData: DocumentData | undefined = userDoc.data();

        return userDocData;
      } catch (error) {
        console.log(error);
      }
    },
  },
};

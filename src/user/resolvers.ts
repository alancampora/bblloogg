import admin from 'firebase-admin';
import { sign } from 'jsonwebtoken';
import { DocumentSnapshot, DocumentData } from '@google-cloud/firestore';
import { ACCESS_TOKEN_SECRET } from '../constants';

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
  Mutation: {
    async createUser(_: any, args: { email: string; password: string }) {
      try {
        const createdUser = await admin.auth().createUser({
          email: args.email,
          password: args.password,
        });

        return createdUser;
      } catch (error) {
        console.log(error);
      }
    },
    async login(_: any, args: { email: string }, { res }: any) {
      try {
        const user = await admin.auth().getUserByEmail(args.email);
        const token = sign({ userId: user.uid }, ACCESS_TOKEN_SECRET, {
          expiresIn: '1day',
        });
        // await admin.auth().createCustomToken(user.uid);
        res.cookie('access-token', token);

        return user;
      } catch (error) {
        console.log('error', error);
      }
    },
  },
};

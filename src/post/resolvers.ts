import admin from 'firebase-admin';
import { DocumentData, DocumentSnapshot } from '@google-cloud/firestore';

const expandUser = async function(post: DocumentSnapshot) {
  const postData: DocumentData | undefined = post.data();
  const userData: DocumentSnapshot = postData && (await postData.user.get());

  return { ...postData, user: userData.data() };
};

export default {
  Query: {
    async posts(_: any, __: any, { req }: any) {
      try {
        console.log('user id', req.userId);

        const posts = await admin
          .firestore()
          .collection('post')
          .get();

        const postsData = await posts.docs.map(expandUser);

        return postsData;
      } catch (error) {
        console.log(error);
      }
    },
    async post(_: any, args: { id: string }) {
      try {
        const postDoc: DocumentSnapshot = await admin
          .firestore()
          .doc(`post/${args.id}`)
          .get();

        const postsData = await expandUser(postDoc);
        return postsData;
      } catch (error) {
        console.log(error);
      }
    },
  },
};

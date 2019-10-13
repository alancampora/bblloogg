import { ApolloServer } from 'apollo-server';
import { gql } from 'apollo-server';
import admin from 'firebase-admin';

const serviceAccount = require('../firebase.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://frontend-topics-blog.firebaseio.com',
});

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    surname: String!
    nickname: String!
  }

  type Query {
    user(id: String): User
    users: [User]
  }
`;

const resolvers = {
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
    async user(object: any, args: { id: string }) {
      try {
        const userDoc = await admin
          .firestore()
          .doc(`user/${args.id}`)
          .get();

        return userDoc.data();
      } catch (error) {
        console.log(error);
      }
    },
  },
};

const server = new ApolloServer({ resolvers, typeDefs });

server.listen().then(({ url }) => console.log(`Server ready at ${url}. `));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => console.log('Module disposed. '));
}

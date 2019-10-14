import { ApolloServer } from 'apollo-server';
import { gql } from 'apollo-server';
import admin from 'firebase-admin';
import merge from 'lodash/merge';
import postResolver from './post/resolvers';
import userResolver from './user/resolvers';

const serviceAccount = require('../firebase.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://frontend-topics-blog.firebaseio.com',
});

const typeDefs = gql`
  type User {
    name: String!
    surname: String!
    nickname: String!
  }

  type Post {
    user: User!
    content: String!
    title: String!
  }

  type Query {
    user(id: String): User
    users: [User]
    posts: [Post]
    post(id: String): Post
  }
`;

const resolvers = merge(userResolver, postResolver);

const server = new ApolloServer({ resolvers, typeDefs });

server.listen().then(({ url }) => console.log(`Server ready at ${url}. `));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => console.log('Module disposed. '));
}

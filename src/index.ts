import merge from 'lodash/merge';
import { initializeFirebaseApp } from './firebase';
import postResolver from './post/resolvers';
import userResolver from './user/resolvers';
import { typeDefs } from './type-defs';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cookieParser from 'cookie-parser';
import { verify } from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from './constants';
import { initializeApp } from 'firebase-admin';

const app = express();
const path = '/graphql';

initializeFirebaseApp();

const resolvers = merge(userResolver, postResolver);

const server = new ApolloServer({
  resolvers,
  typeDefs,
  context: ({ req, res }: any) => ({ req, res }),
});

app.use(cookieParser());

app.use((req: any, _: any, next: any) => {
  const accessToken = req.cookies['access-token'];
  try {
    const data = verify(accessToken, ACCESS_TOKEN_SECRET) as any;
    (req as any).userId = data.userId;
  } catch (error) {
    console.log('error', error);
  }
  next();
});

server.applyMiddleware({ app, path });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`),
);

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => console.log('Module disposed. '));
}

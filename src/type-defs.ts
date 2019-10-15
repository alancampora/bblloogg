import { gql } from 'apollo-server';

export const typeDefs = gql`
  type User {
    uid: String!
    email: String!
    passwordHash: String!
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

  type Mutation {
    createUser(email: String!, password: String!): User!
    login(email: String!): User
  }
`;

import express from 'express';
import graphqlHTTP from 'express-graphql';
import pgp from 'pg-promise';
import { GraphQLObjectType, GraphQLString, GraphQLInt, buildSchema } from 'graphql';

const client = {
  user: 'wckkrecpthxsyj',
  password: 'c8b387d0a6952302a18cbcaf967f773de4a618f2ebddc4e4fae4940cd7f0b6ed',
  host: 'ec2-54-195-247-108.eu-west-1.compute.amazonaws.com',
  port: 5432,
  database: 'd99dch9cum4c6e',
  ssl: true,
  keepAlive: true,
};

//@ts-ignore
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    userName: { type: GraphQLString },
    email: { type: GraphQLString },
    uid: { type: GraphQLString },
    id: { type: GraphQLInt },
  }),
});

var schema = buildSchema(`
  type User {
      userName: String,
      email: String,
      uid: String,
      id: Int
    }
  type Query {
    user: [User]
  }
`);

const db = pgp()(client);

const query = `SELECT * FROM public.users`;
const testData = async () => {
  try {
    const data = await db.any(query);
    console.log(data);
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

const app = express();

const root = {
  user: async () => {
    const ll = await testData();
    return ll;
  },
};

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  }),
);
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));

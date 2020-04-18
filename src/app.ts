import express from 'express';
import graphqlHTTP from 'express-graphql';
import pgp from 'pg-promise';
import { buildSchema } from 'graphql';
import createUser from './user/createUser';
import getUser from './user/getUser';
import createNote from './notes/createNote';

const client = {
  user: 'wckkrecpthxsyj',
  password: 'c8b387d0a6952302a18cbcaf967f773de4a618f2ebddc4e4fae4940cd7f0b6ed',
  host: 'ec2-54-195-247-108.eu-west-1.compute.amazonaws.com',
  port: 5432,
  database: 'd99dch9cum4c6e',
  ssl: true,
  keepAlive: true,
};

// @ts-ignore
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

interface CreateNoteType {
  picture: string;
  uid: string;
  notes: [
    {
      value: string;
      location: {
        x: number;
        y: number;
      };
      uid: string;
    },
  ];
}

const LocationType = `
  input Location {
    x: Int,
    y: Int
  }
`;

const NoteType = `
  input Note {
    value: String,
    uid: String,
    location: Location
  }
`;

const CreateNoteType = `
  input CreateNote {
    picture: String,
    uid: String,
    notes: [Note]
  }
`;

const schema = buildSchema(`
  ${LocationType}
  ${NoteType}
  ${CreateNoteType}
  type User {
    userName: String,
    email: String,
    uid: String,
  }
  type Query {
    createUser(email: String, userName: String, uid: String): Boolean,
    getUser(id: String): User,
    createNote(note: CreateNote): Boolean
  }
`);

const db = pgp({ capSQL: true })(client);

const app = express();

const dumyNotes = {
  value: 'test',
  x: 3,
  y: 100,
  noteUid: 'test11',
};

const dumyNote = {
  picture: 'test',
  uid: 'test11',
  notes: [dumyNotes, dumyNotes, dumyNotes],
};

const root = {
  createUser: async (args) => {
    const result = await createUser(db, args);
    return result;
  },
  getUser: async (args) => {
    const result = await getUser(db, args.id);
    return result;
  },
  createNote: async (args) => {
    const result = await createNote(db, dumyNote);
    return result;
  },
};

app.use(
  '/api',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  }),
);
app.listen(4000, () => console.log('Now browse to localhost:4000/api'));

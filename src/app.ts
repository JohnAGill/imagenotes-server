import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import graphqlHTTP from 'express-graphql';
import pgp from 'pg-promise';
import { buildSchema } from 'graphql';
import createUser from './user/createUser';
import getUser from './user/getUser';
import createNote from './notes/createNote';
import getNotes from './notes/getNotes';
import updateNote from './notes/updateNote';

const client = {
  user: 'wckkrecpthxsyj',
  password: 'c8b387d0a6952302a18cbcaf967f773de4a618f2ebddc4e4fae4940cd7f0b6ed',
  host: 'ec2-54-195-247-108.eu-west-1.compute.amazonaws.com',
  port: 5432,
  database: 'd99dch9cum4c6e',
  ssl: true,
};

// @ts-ignore
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const NoteInput = `
  input NoteInput {
    value: String,
    note_uid: String,
    x: Float,
    y: Float,
    order: Int,
    uid: String,
    text_color: String
  }
`;

const CreateNoteInput = `
  input CreateNoteInput {
    picture: String,
    uid: String,
    notes: [NoteInput],
    user_id: String
  }
`;

const UpdateNoteInput = `
  input UpdateNoteInput {
   notes: [NoteInput]
  }
`;

const NotesType = `
  type Notes {
    picture: String,
    user_id: String,
    uid: String,
    notes: [Note]
  }
`;

const NoteType = `
  type Note {
    value: String,
    note_uid: String,
    x: Float,
    y: Float,
    order: Int,
    uid: String
    text_color: String
  }
`;

const schema = buildSchema(`
  ${NoteInput}
  ${CreateNoteInput}
  ${NoteType}
  ${NotesType}
  ${UpdateNoteInput}
  type User {
    userName: String,
    email: String,
    uid: String,
  }
  type Query {
    createUser(email: String, userName: String, uid: String): Boolean,
    getUser(id: String): User,
    createNote(note: CreateNoteInput): Boolean,
    getNotes(userId: String, path: String): [Notes],
    updateNote(notes: [NoteInput]): Boolean
  }
`);

const db = pgp({ capSQL: true })(client);

const app = express();

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
    console.log(args.note.notes);
    const result = await createNote(db, args.note);
    return result;
  },
  getNotes: async (args) => {
    const result = await getNotes(db, args.userId);
    return result;
  },
  updateNote: async (args) => {
    const results = updateNote(db, args.notes);
    return results;
  },
};

const port = process.env.PORT || 4000;

app.use(
  '/api',
  bodyParser.json(),
  cors(),
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  }),
);
app.listen(port, () => console.log('Now browse to localhost:4000/api'));

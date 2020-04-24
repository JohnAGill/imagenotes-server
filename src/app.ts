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
  keepAlive: true,
};

// @ts-ignore
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const NoteInput = `
  input NoteInput {
    value: String,
    note_uid: String,
    x: Int,
    y: Int,
    order: Int,
    uid: String
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
   uid: String,
   text: String
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
    x: Int,
    y: Int,
    order: Int,
    uid: String
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
    updateNote(uid: String, text: String): Boolean
  }
`);

const db = pgp({ capSQL: true })(client);

const app = express();

/*const root =  (request) => {
  console.log(request.body.args)
  console.log('here')
  if (request.body.args.path === 'createUser') {
    return () => {
    const result = createUser(db, request.body.args);
    return result;
    }
  } else if (request.body.args.path === 'getUser') {
    return () => {
    const result = getUser(db, request.body.args.id);
    return result;
    }
  } else if (request.body.args.path === 'createNote') {
    return () => {
    const result = createNote(db, request.body.args.note);
    return result;
    }
  }
  if (request.body.args.path === 'getNotes') {
    console.log('getNotes')
    return async () => {
    const result = await getNotes(db, request.body.args.userId);
    return result;
    }
  }
  if (request.body.args.path === 'updateNote') {
    return () => {
    const results =  updateNote(db, request.body.args);
    return results
    }
  }
};*/

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
    const result = await createNote(db, args.note);
    return result;
  },
  getNotes: async (args) => {
    const result = await getNotes(db, args.userId);
    return result;
  },
  updateNote: async (args) => {
    const results = updateNote(db, args.update);
    return results;
  },
};

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
app.listen(4000, () => console.log('Now browse to localhost:4000/api'));

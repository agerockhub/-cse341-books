
import { MongoClient } from 'mongodb';

let database;

const connectToDb = async () => {
  const connectionString = process.env.MONGODB_URI;

  if (!connectionString) {
    throw new Error('MONGODB_URI is required.');
  }

  const client = new MongoClient(connectionString);
  await client.connect();

  database = client.db(
    process.env.MONGODB_DB_NAME || 'cse341-books-db'
  );

  // Create indexes to enforce unique custom IDs
await database.collection('books').createIndex(
  { id: 1 },
  { unique: true }
);

await database.collection('authors').createIndex(
  { id: 1 },
  { unique: true }
);

// Improve searches for books belonging to an author
await database.collection('books').createIndex(
  { authorId: 1 }
);

  console.log('Connected to MongoDB');

  return database;
};

const getDb = () => {
  if (!database) {
    throw new Error(
      'Database not initialized. Call connectToDb first.'
    );
  }

  return database;
};

export { connectToDb, getDb };

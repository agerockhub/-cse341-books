
import { getDb } from '../db/connect.js';

// Retrieve all authors from the database
const getAllAuthors = async () => {
  const db = getDb();

  return await db
    .collection('authors')
    .find({}, { projection: { _id: 0 } })
    .toArray();
};

// Retrieve a single author by custom ID
const getAuthorById = async (id) => {
  const db = getDb();

  return await db
    .collection('authors')
    .findOne(
      { id },
      { projection: { _id: 0 } }
    );
};

// Create a new author
const createAuthor = async (author) => {
  const db = getDb();
  return await db.collection('authors').insertOne(author);
};

// Update an existing author
const updateAuthor = async (id, author) => {
  const db = getDb();

  return await db
    .collection('authors')
    .updateOne(
      { id: id },
      { $set: author }
    );
};

// Delete an author
const deleteAuthor = async (id) => {
  const db = getDb();

  return await db
    .collection('authors')
   .deleteOne({ id })
};

export {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor
};

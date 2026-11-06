
import {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor
} from '../models/authors.js';

import { getDb } from '../db/connect.js';

// GET /authors - Retrieve all authors
const getAllAuthorsController = async (req, res) => {
  try {
    const authors = await getAllAuthors();

    return res.status(200).json(authors);
  } catch (error) {
    console.error('Error retrieving authors:', error.message);

    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

// GET /authors/:id - Retrieve an author by ID
const getAuthorByIdController = async (req, res) => {
  try {
    const author = await getAuthorById(req.params.id);

    if (!author) {
      return res.status(404).json({
        message: 'Author not found'
      });
    }

    return res.status(200).json(author);
  } catch (error) {
    console.error('Error retrieving author:', error.message);

    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

// POST /authors - Create a new author
const createAuthorController = async (req, res) => {
  try {
    const { id, name, birthYear } = req.body;

    if (
      typeof id !== 'string' ||
      !id.trim() ||
      typeof name !== 'string' ||
      !name.trim() ||
      !Number.isInteger(birthYear) ||
      birthYear > new Date().getFullYear()
    ) {
      return res.status(400).json({
        message: 'Valid id, name, and birthYear are required.'
      });
    }

    const existingAuthor = await getAuthorById(id.trim());

    if (existingAuthor) {
      return res.status(409).json({
        message: 'An author with this ID already exists.'
      });
    }

    const author = {
      id: id.trim(),
      name: name.trim(),
      birthYear
    };

    await createAuthor(author);

    return res.status(201).json({
      message: 'Author created successfully.',
      author
    });
  } catch (error) {
    console.error('Error creating author:', error.message);

    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

// PUT /authors/:id - Update an existing author
const updateAuthorController = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, birthYear } = req.body;

    if (
      typeof name !== 'string' ||
      !name.trim() ||
      !Number.isInteger(birthYear) ||
      birthYear > new Date().getFullYear()
    ) {
      return res.status(400).json({
        message: 'Valid name and birthYear are required.'
      });
    }

    const existingAuthor = await getAuthorById(id);

    if (!existingAuthor) {
      return res.status(404).json({
        message: 'Author not found'
      });
    }

    const author = {
      name: name.trim(),
      birthYear
    };

    await updateAuthor(id, author);

    return res.status(200).json({
      message: 'Author updated successfully.',
      author: {
        id,
        ...author
      }
    });
  } catch (error) {
    console.error('Error updating author:', error.message);

    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

// DELETE /authors/:id - Delete an author
const deleteAuthorController = async (req, res) => {
  try {
    const id = req.params.id;

    const existingAuthor = await getAuthorById(id);

    if (!existingAuthor) {
      return res.status(404).json({
        message: 'Author not found'
      });
    }

    const db = getDb();

    const associatedBooks = await db
      .collection('books')
      .findOne({ authorId: id });

    if (associatedBooks) {
      return res.status(409).json({
        message: 'Cannot delete an author who has associated books.'
      });
    }

    await deleteAuthor(id);

    return res.status(200).json({
      message: 'Author deleted successfully.'
    });
  } catch (error) {
    console.error('Error deleting author:', error.message);

    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

export {
  getAllAuthorsController,
  getAuthorByIdController,
  createAuthorController,
  updateAuthorController,
  deleteAuthorController
};

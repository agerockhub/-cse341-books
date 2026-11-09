
import {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor
} from '../models/authors.js';

import { getDb } from '../db/connect.js';

// Check that the request contains only permitted fields
const hasOnlyAllowedFields = (body, allowedFields) => {
  return (
    body &&
    typeof body === 'object' &&
    !Array.isArray(body) &&
    Object.keys(body).every((key) => allowedFields.includes(key))
  );
};

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
    if (!hasOnlyAllowedFields(req.body, ['id', 'name', 'birthYear'])) {
      return res.status(400).json({
        message: 'Unexpected properties are not allowed.'
      });
    }

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

    const authorId = id.trim();
    const existingAuthor = await getAuthorById(authorId);

    if (existingAuthor) {
      return res.status(400).json({
        message: 'An author with this ID already exists.'
      });
    }

    const author = {
      id: authorId,
      name: name.trim(),
      birthYear
    };

    await createAuthor(author);

    return res.status(201).json({
      id: author.id,
      name: author.name,
      birthYear: author.birthYear
    });
  } catch (error) {
    console.error('Error creating author:', error.message);

    if (error.code === 11000) {
      return res.status(400).json({
        message: 'An author with this ID already exists.'
      });
    }

    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

// PUT /authors/:id - Update an existing author
const updateAuthorController = async (req, res) => {
  try {
    const id = req.params.id;

    if (!hasOnlyAllowedFields(req.body, ['name', 'birthYear'])) {
      return res.status(400).json({
        message: 'Unexpected properties are not allowed.'
      });
    }

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
      id,
      ...author
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

    return res.status(204).send();
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

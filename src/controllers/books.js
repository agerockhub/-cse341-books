
import { getAllBooks } from '../models/books.js';

// GET /books - Retrieve all books
const getAllBooksController = async (req, res) => {
  try {
    const books = await getAllBooks();

    return res.status(200).json(books);
  } catch (error) {
    console.error('Error retrieving books:', error.message);

    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

export { getAllBooksController };

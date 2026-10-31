import { getAllBooks, getBookById } from '../models/books.js';

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

// GET /books/:id - Retrieve a single book by ID
const getBookByIdController = async (req, res) => {
  try {
    const id = req.params.id;

    const book = await getBookById(id);

    if (!book) {
      return res.status(404).json({
        message: 'Book not found'
      });
    }

    return res.status(200).json(book);

  } catch (error) {
    console.error('Error retrieving book:', error.message);

    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

export { getAllBooksController, getBookByIdController };

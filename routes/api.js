/*
*
*
*       Complete the API routing below
*       
*       
*/

const router = require('express').Router();
const Book = require('../models/Book');

// Get all the books from DB
router.get('/api/books', (req, res) => {
  //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
  Book.find({}, function (err, books) {
    if (err) {
      console.log(err)
    } else {
      const responseObj = books.map((book, i) => {
        return {
          _id: book._id,
          title: book.name,
          commentcount: book.comments.length
        }
      })
      res.send(responseObj);
    }
  });
})

// Add a new book to the the DB
router.post('/api/books', (req, res) => {
  let book = new Book({ name: req.body.title })
  book.save((err, book) => {
    if (err) {
      console.error('Error saving book', err)
    } else {
      res.send(
        `{
          name: ${book.name},
          id:${book._id}
        }`
      )
    }
  })
})

router.delete('/api/books', (req, res) => {
  Book.deleteMany({}, (err, book) => {
    res.send('All books deleted')
  })
})

// Get info of a single book
// test id 5f78ca67021e402e1fe9da66
router.get('/api/books/:id', (req, res) => {
  let id = req.params.id;

  Book.findById({ _id: id }, (err, book) => {
    if (err) {
      console.error("Unable to fine book: ", err)
    } else {
      res.send(book.comments)
    }
  })
})

// Add comment to a book
// test id 5f78ca67021e402e1fe9da66
router.post('/api/books/:id', (req, res) => {
  let id = req.params.id

  Book.findByIdAndUpdate({ _id: id }, { $push: { comments: req.body.comment } }, { new: true }, (err, book) => {
    if (err) {
      console.error(err)
    } else {
      res.send(
        book.comments
      )
    }
  })
})

router.delete('/api/books/:id', (req, res) => {
  let id = req.params.id

  Book.findByIdAndDelete({ _id: id }, (err, book) => {
    res.send(`Book with id: ${id} deleted.`)
  })

})

module.exports = router
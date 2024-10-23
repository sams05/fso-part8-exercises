require('dotenv').config()
const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')

const MONGODB_URI = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

console.log('connecting to', MONGODB_URI)

const authors = [
  {
    name: 'Robert Martin',
    _id: new mongoose.Types.ObjectId(),
    born: 1952
  },
  {
    name: 'Martin Fowler',
    _id: new mongoose.Types.ObjectId(),
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    _id: new mongoose.Types.ObjectId(),
    born: 1821
  },
  {
    name: 'Joshua Kerievsky', // birthyear not known
    _id: new mongoose.Types.ObjectId()
  },
  {
    name: 'Sandi Metz', // birthyear not known
    _id: new mongoose.Types.ObjectId()
  }
]

/*
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 */
const books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: authors.find(({ name }) => name === 'Robert Martin')._id,
    _id: new mongoose.Types.ObjectId(),
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: authors.find(({ name }) => name === 'Robert Martin')._id,
    _id: new mongoose.Types.ObjectId(),
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: authors.find(({ name }) => name === 'Martin Fowler')._id,
    _id: new mongoose.Types.ObjectId(),
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: authors.find(({ name }) => name === 'Joshua Kerievsky')._id,
    _id: new mongoose.Types.ObjectId(),
    genres: ['refactoring', 'patterns']
  },
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: authors.find(({ name }) => name === 'Sandi Metz')._id,
    _id: new mongoose.Types.ObjectId(),
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: authors.find(({ name }) => name === 'Fyodor Dostoevsky')._id,
    _id: new mongoose.Types.ObjectId(),
    genres: ['classic', 'crime']
  },
  {
    title: 'Demons',
    published: 1872,
    author: authors.find(({ name }) => name === 'Fyodor Dostoevsky')._id,
    _id: new mongoose.Types.ObjectId(),
    genres: ['classic', 'revolution']
  }
]

// Populate books field of each author
authors.map((author) => {
  author.books = books.filter((book) => book.author === author._id)
  return author
})

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('connected to MongoDB'))
  .catch((error) => console.error('error connecting to MongoDB', error.message))

Author.deleteMany({})
  .then(() => Book.deleteMany({}))
  .then(() => Author.insertMany(authors))
  .then(() => Book.insertMany(books))
  .finally(() => mongoose.connection.close())

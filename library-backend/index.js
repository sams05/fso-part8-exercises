const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')

require('dotenv').config()
const MONGODB_URI = process.env.MONGODB_URI
const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')

mongoose.set('strictQuery', false)

console.log('connecting to', MONGODB_URI)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.error('error connecting to MongoDB:', error.message)
  })

const typeDefs = `
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Book {
    title: String!
    id: ID!
    author: Author!
    published: Int!
    genres: [String!]!
  }

  type Query {
    bookCount: Int
    authorCount: Int
    allBooks(
      author: String
      genre: String
    ): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.countDocuments(),
    authorCount: async () => Author.countDocuments(),
    allBooks: async (root, args) => {
      const bookFilter = {}
      const authorFilter = {}
      if (args.genre) {
        bookFilter.genres = args.genre
      }
      if (args.author) {
        authorFilter.name = args.author
      }
      return Book.find(bookFilter)
        .populate({
          path: 'author',
          match: authorFilter
        }) // remove books where the author hasn't been populated i.e. doesn't match authorFilter
        .then((books) => books.filter(({ author }) => author))
    },
    allAuthors: async () => Author.find({})
  },
  Author: {
    bookCount: async (root) => (await Book.find({ author: root._id })).length
  },
  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author })
        await author.save()
      }
      const newBook = new Book({ title: args.title, published: args.published, author, genres: args.genres })

      return newBook.save()
    },
    editAuthor: async (roots, args) => {
      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }
      author.born = args.setBornTo
      return author.save()
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

startStandaloneServer(server, {
  listen: { port: 4000 }
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})

const express = require("express");
const { graphqlHTTP } = require('express-graphql');
const app = express();
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require("graphql");

const authors = [
    { id: 1, name: 'J. K. Rowling' },
    { id: 2, name: 'J. R. R. Tolkien' },
    { id: 3, name: 'Brent Weeks' },
];

const books = [
    { id: 1, name: "Harry Potter and the chamber of secrents", authorId: 1 },
    { id: 2, name: "Harry Potter and the Prosoner of Azkaban", authorId: 1 },
    { id: 3, name: "Harry Potter and the Goblet", authorId: 1 },
    { id: 4, name: "Harry Potter and the Ring", authorId: 2 },
    { id: 5, name: "The Two Two towers", authorId: 2 },
    { id: 6, name: "Jibon ta Bedona", authorId: 2 },
    { id: 7, name: "Bakita Itihash", authorId: 3 },
    { id: 8, name: "Amio dimu na", authorId: 3 }
];

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'This represents an author of book',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: {
            type: BookType,
            resolve: (parent) => {
                return books.find((authId) => authId.id === parent.id)
            }
        },
        books: {
            type: GraphQLList(BookType),
            resolve: (author) => {
                return books.filter(book => book.authorId === author.id);
            }
        }
    })
});



const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'This represents a book written buy an author',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
        author: {
            type: AuthorType,
            resolve: (book) => {
                return authors.find(author => author.id === book.authorId)
            }
        },
    })
});

const RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: "Root Query",
    fields: () => ({
        book: {
            type: BookType,
            description: 'A single book',
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: (parent, args) => books.find(book => book.id === args.id)
        },
        books: {
            type: new GraphQLList(BookType),
            description: 'List of Books',
            resolve: () => books
        },
        author: {
            type: AuthorType,
            description: "A single author",
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => authors.find(author => author.id === args.id)
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: "List of Author",
            resolve: () => authors
        }
    })
});
// mutation
const RootMutationType = new GraphQLObjectType({
    name: "Mutation",
    description: "Root Mutation",
    fields: () => ({
        addBook: {
            type: BookType,
            description: "Add a Book",
            args: {
                name: { type: GraphQLNonNull(GraphQLString)},
                authorId: { type: GraphQLNonNull(GraphQLInt)},
            },
            resolve: (parent, args) => {
                const book = { id: books.length + 1, name: args.name, authorId: args.authorId };
                books.push(book);
                return book;
            }
        },
        addAuthor: {
            type: AuthorType,
            description: "Add an Author",
            args: {
                name: { type: GraphQLNonNull(GraphQLString)},
            },
            resolve: (parent, args) => {
                const author = { id: authors.length + 1, name: args.name };
                authors.push(author);
                return author;
            }
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType,
})

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));



app.listen(5000, () => {
    console.log("The graphql server is running successfully!");
});


// app.get("/", (req, res) => {
//     res.send("Welcome to the graphql server!");
// });
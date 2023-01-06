const express = require("express");
const {graphqlHTTP} = require('express-graphql');
const app = express();
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString
} = require("graphql");

const authors = [
    {id:1, name:'J. K. Rowling'},
    {id:2, name:'J. R. R. Tolkien'},
    {id:3, name:'Brent Weeks'},
];

const books = [
    {id: 1, name: "Harry Potter and the chamber of secrents", authorId:1},
    {id: 2, name: "Harry Potter and the Prosoner of Azkaban", authorId:1},
    {id: 3, name: "Harry Potter and the Goblet", authorId:1},
    {id: 4, name: "Harry Potter and the Ring", authorId:2},
    {id: 5, name: "The Two Two towers", authorId:2},
    {id: 6, name: "Jibon ta Bedona", authorId:2},
    {id: 7, name: "Bakita Itihash", authorId:3},
    {id: 8, name: "Amio dimu na", authorId:3}
]

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "Anamul_Islam_Shamim",
        fields: () => ({
            message: {
                type: GraphQLString,
                resolve: () => "Hello, Shamim!"
            }
        })
    })
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
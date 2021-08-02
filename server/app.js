const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./../schema/schema');
const mongoose = require('mongoose');

const app = express();
const PORT = 3005;

mongoose.connect("mongodb+srv://admin:test@cluster0.vv6hx.mongodb.net/GraphQLTest?retryWrites=true&w=majority", {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

// Первый параметр - Роут по которому будет работать GraphQL песочница

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

const dbConnection = mongoose.connection;
dbConnection.on('error', err => console.log(`Connection error: ${err}`));
dbConnection.once('open', () => console.log(`Connected DB`));


app.listen(PORT, err => {
    err
        ? console.log(err)
        : console.log('Server started!')
})
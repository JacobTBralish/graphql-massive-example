const express = require('express');
const app = express();
require('dotenv');
const graphqlHTTP = require('express-graphql')
const bodyParser = require('body-parser');
const schema = require('./schema.js')

app.use(bodyParser.json());

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));

const PORT = 4000;
app.listen(PORT, ()=> console.log(`Server listening on port ${PORT}`));
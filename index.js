const { ApolloServer, gql } = require("apollo-server");
const Datastore = require("nedb");

const db = {};
db.users = new Datastore("users.db");
db.products = new Datastore("products.db");

db.users.loadDatabase();
db.products.loadDatabase();

// Type definitions define the "shaape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  type User {
    name: String
    age: Int
  }

  type Product {
    name: String
    price: Float
    description: String
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    Users: [User]
    Products: [Product]
  }
`;

const getUsers = () =>
  new Promise(resolve => {
    db.users.find({}, (err, docs) => {
      resolve(docs);
    });
  });

const getProducts = () =>
  new Promise(resolve => {
    db.products.find({}, (err, docs) => {
      resolve(docs);
    });
  });

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    Users: () => getUsers(),
    Products: () => getProducts()
  }
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

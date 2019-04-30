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
    _id: String
    name: String
    age: Int
  }

  type Product {
    _id: String
    name: String
    price: Float
    description: String
  }

  # The "Query" type is the root of all GraphQL queries. Property names into the array.
  # (A "Mutation" type will be covered later on.)
  type Query {
    Users: [User]
    Products: [Product]
  }

  type Mutation {
    AddUser(name: String!, age: Int!): [User]
    AddProduct(name: String!, price: Float!, description: String!): [Product]
    RemoveUser(_id: String!): [User]
    RemoveProduct(_id: String!): [Product]
    EditUser(_id: String!, name: String!, age: Int!): [User]
    EditProduct(
      _id: String!
      name: String!
      price: Float!
      description: String!
    ): [Product]
  }
`;

// Link database with query
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

// Add & then update the list
const addUser = user =>
  new Promise(resolve => {
    db.users.insert(user, () => {
      db.users.find({}, (err, docs) => {
        resolve(docs);
      });
    });
  });

const addProduct = product =>
  new Promise(resolve => {
    db.products.insert(product, () => {
      db.products.find({}, (err, docs) => {
        resolve(docs);
      });
    });
  });

// Remove & then update list
const removeUser = user =>
  new Promise(resolve => {
    db.users.remove({ _id: user._id }, {}, () => {
      db.users.find({}, (err, docs) => {
        resolve(docs);
      });
    });
  });

const removeProduct = product =>
  new Promise(resolve => {
    db.products.remove({ _id: product._id }, {}, () => {
      db.products.find({}, (err, docs) => {
        resolve(docs);
      });
    });
  });

// Edit & update list '

const editUser = user =>
  new Promise(resolve => {
    db.users.update({ _id: user._id }, user, {}, () => {
      db.users.find({}, (err, docs) => {
        resolve(docs);
      });
    });
  });

const editProduct = product =>
  new Promise(resolve => {
    db.products.update(
      { _id: product._id },
      {
        name: product.name,
        price: product.price,
        description: product.description
      },
      {},
      () => {
        db.products.find({}, (err, docs) => {
          resolve(docs);
        });
      }
    );
  });

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    Users: () => getUsers(),
    Products: () => getProducts()
  },
  Mutation: {
    AddUser: (_, user) => addUser(user),
    AddProduct: (_, product) => addProduct(product),
    RemoveUser: (_, user) => removeUser(user),
    RemoveProduct: (_, product) => removeProduct(product),
    EditUser: (_, user) => editUser(user),
    EditProduct: (_, product) => editProduct(product)
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

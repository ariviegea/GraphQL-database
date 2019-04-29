const Datastore = require("nedb");
// Of course you can create multiple datastores if you need several
// collections. In this case it's usually a good idea to use autoload for all collections.
const db = {};
db.users = new Datastore("users.db");
db.products = new Datastore("products.db");

// You need to load each database (here we do it asynchronously)
db.users.loadDatabase();
db.products.loadDatabase();

console.log(

/*
const user = {
  name: "Conny",
  age: 57
};

db.users.insert(user);
*/
/*
const products = {
  name: "Chair",
  price: 100,
  description: "Blue wonderful color chair"
};

db.products.insert(products);
*/
/*
db.users.find({ name: "Conny" }, (err, docs) => {
  console.log(docs);
});
*/

const Datastore = require("nedb");
// Of course you can create multiple datastores if you need several
// collections. In this case it's usually a good idea to use autoload for all collections.
const db = {};
db.users = new Datastore("users.db");
db.robots = new Datastore("robots.db");

// You need to load each database (here we do it asynchronously)
db.users.loadDatabase();
db.robots.loadDatabase();

/*
const user = {
  name: "Conny",
  age: 57
};

db.users.insert(user);
*/

db.users.find({ name: "Conny" }, (err, docs) => {
  console.log(docs);
});

const mongoose = require('mongoose');
let db;

mongoose.connect('mongodb://localhost/blood-sand', {useNewUrlParser: true});
db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	console.log("Mongoose connected.");
});


// Begin test code:
/*
// Create a schema:
var kittySchema = new mongoose.Schema({
	name: String
});

// Assign method to a schema
kittySchema.methods.speak = function () {
	var greeting = this.name ?
		`Meow name is ${this.name}` :
		`I don't have a name`;
	console.log(greeting);
}

// Compile schema into a model:
var Kitten = mongoose.model('Kitten', kittySchema);

// Create a document:
var fluffy = new Kitten({
	name: "Fluffy"
});

// Save a document
fluffy.save(function (err, fluffy) {
	if (err) {
		return console.error(err);
	}
	fluffy.speak();
});

// find documents
Kitten.find({
	name: /^fluff/i
}, function (err, kittens) {
	if (err) {
		return console.error(err);
	}
	console.log(kittens);
});
*/
// End test code.


module.exports = function (m) {
	m.mongoose = mongoose;
	m.db = db;
};

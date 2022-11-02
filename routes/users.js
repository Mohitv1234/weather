
const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://root:<password>@cluster0.94nf2vh.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

const userSchema = mongoose.Schema({
  email: String,
  username: String,
  password: String,
  name: String,
  mobile: String,
  profession: String,
  about: String,
})
userSchema.plugin(plm);

module.exports = mongoose.model('user', userSchema);


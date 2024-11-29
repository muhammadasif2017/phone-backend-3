const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = process.env.MONGODB_URI;
mongoose.set("strictQuery", false);

mongoose.connect(url).then(() => console.log('connected to mongodb')).catch((error) => console.log(`error connecting database`, error));

const phoneSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const PhoneBook = mongoose.model("Phonebook", phoneSchema);
if (name && number) {
  const phoneBook = new PhoneBook({
    name,
    number,
  });

  phoneBook.save().then((result) => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  PhoneBook.find({}).then((phoneBooks) => {
    console.log("phonebook:");
    for (const phoneBook of phoneBooks) {
      console.log(`${phoneBook.name} ${phoneBook.number}`);
    }
  });
}

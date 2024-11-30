const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then(() => console.log('connected to mongodb'))
  .catch((error) => console.log('error connecting database', error));

const phoneBookSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d{5,}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: [true, 'User phone number required'],
  },
});

// const PhoneBook = mongoose.model("Phonebook", phoneBookSchema);
// if (name && number) {
//   const phoneBook = new PhoneBook({
//     name,
//     number,
//   });

//   phoneBook.save().then((result) => {
//     console.log(`added ${name} number ${number} to phonebook`);
//     mongoose.connection.close();
//   });
// } else {
//   PhoneBook.find({}).then((phoneBooks) => {
//     console.log("phonebook:");
//     for (const phoneBook of phoneBooks) {
//       console.log(`${phoneBook.name} ${phoneBook.number}`);
//     }
//   });
// }

phoneBookSchema.set('toJSON', {
  transform: (document, returedObject) => {
    returedObject.id = returedObject._id.toString();
    delete returedObject._id;
    delete returedObject.__v;
  },
});

module.exports = mongoose.model('PhoneBook', phoneBookSchema);

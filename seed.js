require('dotenv').config();

const seeders = require('./seeders/seeders');

seeders.userSeeder.insertUser()
  .then(r => {
    if (r) {
      console.log("Users are seeded successfully.")
    } else {
      console.log("users are already seeded.")
    }
  })
  .catch(e => {
    console.log("There was error seeding all users in database.")
    console.log(e);
  });
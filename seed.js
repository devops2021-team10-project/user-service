require('dotenv').config();

const userSeeder = require('./seeders/user.seeder');

userSeeder.insertUser()
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
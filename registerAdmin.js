const genPassword = require("./lib/passwordUtils").genPassword;
const User = require("./config/database").models.User;

const registerAdmin = async () => {
  const saltHash = genPassword("admin123");
  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const newUser = new User({
    username: "admin@gmail.com",
    hash: hash,
    salt: salt,
    admin: true,
  });

  await newUser
    .save()
    .then((user) => {
      console.log("New Admin\n" + user);
    })
    .catch((err) => {
      console.log(err);
    });
}

registerAdmin();
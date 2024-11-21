const router = require("express").Router();
const passport = require("passport");
const genPassword = require("../lib/passwordUtils").genPassword;
const connection = require("../config/database");
const User = connection.models.User;
const Portfolio = connection.models.Portfolio;
const isAuth = require("./authMiddleware").isAuth;
const isAdmin = require("./authMiddleware").isAdmin;

/**
 * -------------- POST ROUTES ----------------
 */

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login-failure",
    successRedirect: "/login-success",
  })
);

router.post("/adminlogin", passport.authenticate("local", {
  failureRedirect: "/admin-login-failure",
  successRedirect: "/admin-login-success",
}));

router.post("/register", isAdmin, (req, res, next) => {
  console.log(req.body);
  const saltHash = genPassword(req.body.pass);

  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const newUser = new User({
    username: req.body.email,
    hash: hash,
    salt: salt,
    admin: false,
  });

  User.findOne({ username: req.body.email })
    .then((user) => {
      if (user) {
        res.status(400).json({ msg: "User already exists" });
      } else {
        newUser
          .save()
          .then((user) => {
            res.status(200).json({ msg: "User registered" });
          })
          .catch((user) => {
            res.status(400).json({ msg: "Error registering user" });
          });
      }
    })
    .catch(() => {
      res.status(400).json({ msg: "Error fetching user" });
    });
});



router.post("/submitportfolio", isAuth, (req, res, next) => {
  req.body.username = req.user.username;
  const newPortfolio = new Portfolio(req.body);
  console.log(newPortfolio);
  Portfolio.findOne({ username: req.user.username })
    .then((portfolio) => {
      if (portfolio) {
        Portfolio.findOneAndReplace({ username: req.user.username }, req.body)
        .then(() => {
          res.status(200).json({ msg: "Portfolio updated" });
        })
        .catch(() => {
          res.status(400).json({ msg: "Error updating Portfolio" });
        });
      } else {
        newPortfolio
        .save()
        .then((portfolio) => {
          console.log("running");
          res.status(200).json({ msg: "Portfolio registered" });
        })
        .catch((portfolio) => {
          console.log(portfolio);
            res.status(400).json({ msg: "Error registering Portfolio" });
          });
      }
    })
    .catch(() => {
      res.status(400).json({ msg: "Error fetching Portfolio" });
    });
});

router.get("/fetchStudents", async (req, res, next) => {
  await Portfolio.find()
    .then((portfolio) => {
      res.json(portfolio)
      console.log(portfolio);
    })
    .catch(() => {
      res.status(400).json({ msg: "Error fetching portfolios" });
    });
});

router.get("/fetchPortfolio",isAuth, async (req, res, next) => {
  await Portfolio.findOne({ username: req.user.username })
    .then((portfolio) => {
      res.send(portfolio);
    })
    .catch(() => {
      res.status(400).json({ msg: "Error fetching Portfolio" });
    });
});

router.get("/portfolio/:id", async (req, res, next) => {
  await Portfolio.findOne({ _id: req.params.id })
    .then((portfolio) => {
      res.send(portfolio);
    })
    .catch(() => {
      res.status(400).json({ msg: "Error fetching Portfolio" });
    });
});

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      console.error(err);
      res.send(err);
    } else {
      res.status(200).clearCookie("connect.sid", {
        path: "/",
      });
      req.session.destroy(function (err) {
        res.send("You have been logged out.");
      });
    }
  });
});

router.get("/login-success", (req, res, next) => {
  res.status(200).json({ mesage: "You successfully logged in." });
});

router.get("/login-failure", (req, res, next) => {
  res.status(401).json({ message: "You entered the wrong password." });
});
router.get("/admin-login-success", isAdmin, (req, res, next) => {
  console.log(req.user);
  res.status(200).json({ mesage: "You successfully logged in." });
});

router.get("/admin-login-failure", (req, res, next) => {
  res.status(401).json({ message: "You entered the wrong password." });
});

module.exports = router;

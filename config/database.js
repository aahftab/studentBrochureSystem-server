const mongoose = require("mongoose");

require("dotenv").config();

/**
 * -------------- DATABASE ----------------
 */

/**
 * Connect to MongoDB Server using the connection string in the `.env` file.  To implement this, place the following
 * string into the `.env` file
 *
 * DB_STRING=mongodb://<user>:<password>@localhost:27017/database_name
 */

const conn = process.env.DB_STRING;

const connection = mongoose.createConnection(conn);

// Creates simple schema for a User.  The hash and salt are derived from the user's given password when they register
const UserSchema = new mongoose.Schema({
  username: String,
  hash: String,
  salt: String,
  admin: Boolean,
});

const FluencyEnum = ["Beginner", "Intermediate", "Advanced", "Expert"];

const ProgrammingLanguagesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fluency: { type: String, enum: FluencyEnum, required: true },
});

const FrameworksSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fluency: { type: String, enum: FluencyEnum, required: true },
});

const LibrariesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fluency: { type: String, enum: FluencyEnum, required: true },
});

const TechnologiesUsedSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2 },
});

const ProjectSchema = new mongoose.Schema({
  projectName: { type: String, required: true, minlength: 2 },
  projectDescription: { type: String, required: true, minlength: 10 },
  technologiesUsed: { type: String, required: false },
  projectLink: { type: String, validate: { validator: v => /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(v), message: "Invalid URL." }, required: false },
  projectDuration: { type: String, required: true, minlength: 2 },
});

const PortfolioSchema = new mongoose.Schema({
  username: String,
  email: { type: String, required: true, match: [/.+\@.+\..+/, "Invalid email address."] },
  githubProfile: { type: String, required: true, minlength: 2 },
  name: { type: String, required: true, minlength: 2 },
  programmingLanguages: { type: [ProgrammingLanguagesSchema], required: true },
  libraries: { type: [LibrariesSchema], required: true },
  frameworks: { type: [FrameworksSchema], required: true },
  projects: { type: [ProjectSchema], required: true },
});

const User = connection.model("User", UserSchema);

const Portfolio = connection.model("Portfolio", PortfolioSchema);

// Expose the connection
module.exports = connection;


# Student Brochure System Server
This is the server for the Student Brochure System. It is a RESTful API that provides endpoints for the client to interact with the database.

## Installation
1. Clone the repository
2. Run `npm install` to install the dependencies
3. Run `nodemon` to start the developement server
4. The server will be running on `http://localhost:3000`
5. The server requires a `.env` file with the following variables:
   - `DB_STRING`: The connection string for the MongoDB database
   - `SECRET`: The secret key for the passport strategy
   - `PORT`: The port number for the server

## Technologies
- Node.js
- Express.js
- MongoDB
- Mongoose
- Passport.js
- crypto-js
- dotenv
- nodemon
- cors

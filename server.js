// Dependencies ------------------------------------------------
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("./config/passport");
const db = require("./models");

// PORT and Express --------------------------------------------
const PORT = process.env.PORT || 8080;
const app = express();

// Chat Dependencies ------------------------------------------
const mongo = require("mongodb").MongoClient;
const io = require("socket.io").listen(4000).sockets;

// Mongo DB connection -----------------------------------------
const MONGODB_URI = process.env.MONGOLAB_BLUE_URI || "mongodb://127.0.0.1/mongochat";

// Connect to Mongo + Socket.io --------------------------
mongo.connect(MONGODB_URI, (err, client) => {
  if (err) throw err;
  console.log("MongoDB connected successfully.");

  // Connect to Socket.io
  io.on('connection', (socket) => {
    let chat = client.db('mongochat').collection('chats');

    // Send status to client from server
    sendStatus = function(s) {
      socket.emit('status', s);
    }

    // Get chats from mongo collection
    chat.find().limit(100).sort({_id: 1}).toArray((err, res) => {
      if (err) throw err;

      // Emit the messages
      socket.emit('output', res);
    });

    // Handle input events
    socket.on('input', (data) => {
      let name = data.name;
      let message = data.message;

      // Check for name and messages
      if (!name || !message) {
        // Send error status
        sendStatus('Please enter a name and message!');
      } else {
        // Insert message
        chat.insert({name: name, message: message}, () => {
          io.emit('output', [data]);

          // Send status object
          sendStatus({
            message: 'Message Sent',
            clear: true
          });
        });
      }
    });

    // Handle clear
    socket.on('clear', (data) => {
      // Remove all chats from the collection
      chat.remove({}, () => {
        // Emit event letting client know everything is clear
        socket.emit('cleared');
      });
    });


  });
});


// Middleware --------------------------------------------------

// bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

// Express-Session
app.use(session({
   secret: "star wars",
   resave: true,
   saveUninitialized: true
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Router -----------------------------------------------------
const htmlRoutes = require("./routes/htmlRoutes.js");
const apiRoutes = require("./routes/apiRoutes.js");

app.use(htmlRoutes);
app.use(apiRoutes);

// Listener ---------------------------------------------------
db.sequelize.sync().then(() => {
  app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Connected on localhost:${PORT}`);
  });
});

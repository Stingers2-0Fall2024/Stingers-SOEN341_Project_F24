const express = require("express");
const app = express();
const path = require("path");
const jwt = require('jsonwebtoken');
const session = require("express-session")
const sequelize = require('./config/database');  //Ali - Database connection
const authRoutes = require('./routes/autroutes'); //Ali - Authentication routes
const authService = require("./services/autservices") //Samuel - Services used to log in
require('dotenv').config(); // Ali - Loads environment variables

app.set("view engine", "ejs");

app.use(
  session({
    secret: process.env.SECRET_KEY, // This should be stored securely in an environment variable
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.static(path.join(__dirname, "/")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  let username = req.session.token;
  if (username) {
    // Home page content
    res.render("home", {username: (jwt.verify(req.session.token, process.env.JWT_SECRET)).name}) // Modify as needed
  } else {
    // LogIn page
    res.sendFile(path.join(__dirname, "/views/login.html"));
  }
});

//For testing purposes
app.get("/register", (req, res) =>{
  res.sendFile(path.join(__dirname,"/views/register.html"));
})

app.post("/register", async (req,res)=>{
  let email = req.body.email;
  let password = req.body.password;
  let role = req.body.role;
  let Id = req.body.Id;
  let name = req.body.name;
  console.log(req.body.email)
  try {
    const result = await authService.registerUser(email, password, role, Id, name);

    req.session.token = result;

    let user = jwt.verify(req.session.token, process.env.JWT_SECRET)

    res.render("loggedIn", {user: user.name});
  } catch (error) {

    res.status(401).send(error.message);
  }
})



app.post("/login", async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  try {
    const result = await authService.loginUser(email, password);

    req.session.token = result;

    let user = jwt.verify(req.session.token, process.env.JWT_SECRET)

    res.render("loggedIn", {user: user.name});
  } catch (error) {

    res.status(401).send(error.message);
  }
});

app.get("/logout", (req,res)=>{

  req.session.destroy();
  res.send("Logout sucess")
})



//Following was added by Ali

// Loads authentication routes (login and registration)
app.use('/api/auth', authRoutes);

// Syncs the database
sequelize.sync()
  .then(() => {
    console.log('Connected to the Database');
  })
  .catch((err) => {
    console.error('Failed to connect to the database:', err);
  });

// Modified by Ali ( so that it is more flexible for environment variables) 
//Starts the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

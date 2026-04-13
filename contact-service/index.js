const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

/* ✅ Connect to MongoDB */
mongoose.connect("mongodb://mongodb:27017/contactDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

/* ✅ Schema */
const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Contact = mongoose.model("Contact", ContactSchema);

/* ✅ API */
app.post("/contact", async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();

    res.json({ message: "Message saved to DB successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving message" });
  }
});

app.listen(5000, () => {
  console.log("Contact service running on port 5000");
});

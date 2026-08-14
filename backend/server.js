const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// Models
const Blog = require("../models/blog");

// Routes
const authRoutes = require("./routes/authRoutes");

// Middleware
const auth = require("./middleware/auth");

const app = express();

// ================== MIDDLEWARE ==================
app.use(express.json());


// ================== MONGODB ==================
mongoose.connect("mongodb://127.0.0.1:27017/myblog")
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.log(err));

app.use(cors({
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));



// ================== TEST ROUTE ==================
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// ================== AUTH ROUTES ==================
app.use("/api/auth", authRoutes);

// ================== BLOG ROUTES ==================

// CREATE BLOG (Protected)
// CREATE BLOG (Protected)
app.post("/blogs", auth, async (req, res) => {
  try {
    console.log("========== NEW REQUEST ==========");
    console.log("Body:", req.body);
    console.log("User:", req.user);

    const { title, content, category } = req.body;

    const blog = new Blog({
      title,
      content,
      category,
      author: req.user.userId
    });

    console.log("Blog before save:", blog);

    await blog.save();

    console.log("Saved successfully!");

    res.json({
      message: "Blog created successfully",
      blog
    });

  } catch (err) {
    console.error("ERROR:");
    console.error(err);

    res.status(500).json({
      error: err.message,
      stack: err.stack
    });
  }
});
// GET BLOGS
app.get("/blogs", async (req, res) => {

    try {

        const search = req.query.search || "";
        const category = req.query.category || "";

        let filter = {

            title: {
                $regex: search,
                $options: "i"
            }

        };

        if (category !== "") {

            filter.category = category;

        }

        const blogs = await Blog.find(filter)
            .populate("author", "email");

        res.json(blogs);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});
// DELETE BLOG
app.delete("/blogs/:id", auth, async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ message: "Blog deleted 🗑️" });
});

// UPDATE BLOG
app.put("/blogs/:id", auth, async (req, res) => {
  const { title, content, category } = req.body;

  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    { title, content, category },
    { new: true }
  );

  res.json({
    message: "Blog updated ✏️",
    updatedBlog
  });
});

// ================== SERVER ==================
app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://ADMIN16:Admin%40123@cluster0.nic8vhe.mongodb.net/blogDB?retryWrites=true&w=majority")
.then(() => {
    console.log("✅ Connected to MongoDB");
    process.exit(0);
})
.catch(err => {
    console.log("❌ Error:", err);
    process.exit(1);
});
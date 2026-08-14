const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://ADMIN16:Admin%40123@cluster0.nic8vhe.mongodb.net/blogDB?retryWrites=true&w=majority")
.then(() => {
    console.log("Connected");
})
.catch(err => {
    console.log(err);
});
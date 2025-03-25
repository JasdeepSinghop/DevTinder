const express = require("express");

const app = express();

app.listen(3000,() => {
    console.log("Server Success");
})

// app.use((req,res) => {
//     res.send("Hello");
// })

app.use("/",(req,res) => {
    res.send("This is how kk");
})
app.use("/home",(req,res) => {
    res.send("Hello");
})

app.use("/test",(req,res) => {
    res.send("test");
})

app.use("/jj",(req,res) => {
    res.send("jj");
})
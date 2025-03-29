const express = require('express');
const app = express();


// app.get('/user/:userId/:userName/:password', (req,res) => {
//     console.log(req.params);
//     console.log(req.query);
//     res.send({firstname:"Jasdeep",lastname:"Singh"});
// });

// app.post('/user', (req,res) => {
//     res.send("Saved data ");
// });

// app.use('/user', (req,res,next) => {
//     next();
// }
// )

// app.use("/user" ,(req,res,next) => {
//     res.send("This is response");
// })

// app.use("/user" ,(req,res,next) => {
//     res.send("This is response");
// })

// app.use("/user/hi",(req,res) => {
//     res.send("This is gaae");
// })

const {adminAuth,userAuth} = require("./middlewares/auth");

app.use("/admin",adminAuth);

    
app.get("/user",userAuth, (req,res) => {
    res.send("All data");
})

app.get("/admin/userdata", (req,res) => {
    res.send("All data");
})

app.get("/admin/deletedata", (req,res) => {
    res.send("Data deleted");
})


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

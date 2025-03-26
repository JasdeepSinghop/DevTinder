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

app.use('/user', (req,res,next) => {
    next();
},
(req,res) => {
    res.send("Hi");
}
)


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

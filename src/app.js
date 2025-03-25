const express = require('express');
const app = express();


app.get('/user', (req,res) => {
    res.send({firstname:"Jasdeep",lastname:"Singh"});
});

app.post('/user', (req,res) => {
    res.send("Saved data ");
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

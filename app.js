const express = require('express');
const cors = require('cors');
const db = require('./models/db');
const userRoute  = require('./routes/userRoute');

const app = express();

app.use(express.urlencoded({ extended : false}));
app.use(express.json());
app.use(cors());

const port = 5000;

app.set('port', port);



app.get('/', (req, res) =>{
    res.send("welcome to this url");
})

app.use('/api/user', userRoute);

app.listen(port, () =>{
    console.log(`server started on port ${port}`);
})
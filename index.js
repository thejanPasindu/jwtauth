const express = require('express');
const app = express()
const mongoose = require('mongoose');

const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

mongoose.connect('mongodb://localhost:27017/authDB', { useUnifiedTopology: true, useNewUrlParser: true },
()=>{
    console.log('DB connected');
}
);

app.use(express.json());

app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(3000, ()=>console.log('server up and runing'));
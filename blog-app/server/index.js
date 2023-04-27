const express = require('express');
const morgan = require('morgan');
const cors= require('cors');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const connectDatabase = require('./src/config/db');
const dev = require('./src/config/index.js');
const blogRouter = require('./src/routes/blogRout');
const app = express();


const port = dev.app.serverPort

app.listen(port, async() => {
    console.log(`server is running at http://localhost:${port}`)
    await connectDatabase();
});

app.get("/test-api" , (req,res) => {
    res.send("api is working");
});

app.use(cors({
  origin: ["http://127.0.0.1:3000", "http://localhost:3000"],
  credentials: true,
}));

app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/public', express.static('public'));
/*app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));*/
app.use('/api/blogs', blogRouter);

//client error
app.use((req, res, next) => {
    next(createError(404,'not found'));
});
 
 //500 
  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
       error: {
          status: err.status || 500,
          message: err.message,
       },
    });
  });
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import http from 'http';
import routes from './routes/index.js';
import cors from 'cors'

var app = express();

// view engine setup
// view engine setup
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/',routes.userRoute)

const server = http.createServer(app)
server.listen(3001,()=>{
  console.log('server running on port 3001')
})


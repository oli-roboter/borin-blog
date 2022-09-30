const express = require('express');
const mongoose = require('mongoose');
const session = require("express-session");
const cors = require("cors")''
const { createClient } = require("redis");
let RedisStore = require("connect-redis")(session);

const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  REDIS_URL,
  REDIS_PORT,
  SESSION_SECRET,
} = require('./config');

const postRouter = require('./routes/postRoutes');
const userRouter = require('./routes/userRoutes');

let redisClient = createClient({
  legacyMode: true,
  socket: {
    port: REDIS_PORT,
    host: REDIS_URL
  }
});
redisClient.connect().catch(console.error);


const app = express();
/*
connection string is mongodb://user:password@ip-address:port/options
I can use "mongoloide" for the ip address because i added it to the volumes section in the 
docker-compose file, This creates a DNS whcih I can refer to in the code 
*/
const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
  mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log('Connected to mongoloid DB!')
    })
    .catch((e) => {
      console.error(`Error connecting to DB:${e.message}`);
      setTimeout(connectWithRetry, 5000);
    });
}

/*
initialises function and retries every 5 seconds until it connects. 
This is to make sure that even if the container orchestration command 'depends_on' fails,
the code logic will try to connect
*/
connectWithRetry();

//MIDDLEWARE SECTION
app.enable("trust proxy");
app.use(cors());
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 300000
  }
}))

app.use(express.json());
app.get('/api', (req, res) => {
  res.send("<h2>Hello from zis App wiss Node und Expresh</h2>");
});

//localhost:3000/
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
const express = require('express');
require('dotenv').config({ path: '../.env' });
const knex = require("./config/db");
const app = express();
const cors = require('cors');
const router = require('./routes/routes.js');
const userRouter = require('./routes/User');
const updateRouter = require('./routes/Update');
const loginRouter = require('./routes/Login');
const aboutRouter = require('./routes/About');
const gameRouter = require('./routes/Game')

app.use(cors()); // Aktiviere CORS

// Andere benötigte Konfigurationen und Middleware...
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


app.use('/', router);
app.use('/FAQs', router);
app.use('/home', router);
app.use('/login', loginRouter);
app.use('/rating', router);
app.use('/user', userRouter);
app.use('/update', updateRouter);
app.use('/about', aboutRouter);
app.use('/game', gameRouter);

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

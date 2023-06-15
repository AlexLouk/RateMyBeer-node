const express = require('express');
require('dotenv').config({ path: '../.env' });
const knex = require("./config/db");
const app = express();
const cors = require('cors');
const router = require('./routes/routes.js');
const newsRouter = require('./routes/News');
const userRouter = require('./routes/User');
const ratingRouter = require('./routes/Rating');
const updateRouter = require('./routes/Update');
const beersRouter = require('./routes/Beers');
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
app.use('/news', newsRouter);
app.use('/login', loginRouter);
app.use('/rating', ratingRouter);
app.use('/user', userRouter);
app.use('/update', updateRouter);
app.use('/beers', beersRouter);
app.use('/about', aboutRouter);
app.use('/game', gameRouter);

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

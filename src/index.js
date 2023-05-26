
const express = require('express');
const router = require('./routes/routes')
const app = express();


app.use('/', router);
app.use('/about', router)
app.use('/FAQs', router)
app.use('/home', router)
app.use('/login', router)
app.use('/rating', router)
app.use('/user', router)

const port = 8000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

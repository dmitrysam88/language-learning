const express = require('express');
const cors = require('cors');

const app = express();

const usersController = require('./controllers/users');
const localeController = require('./controllers/locale');
const articleController = require('./controllers/articles');
const testController = require('./controllers/tests');
const { initDB } = require('./db/index');
initDB();

app.use(cors());
app.use(express.urlencoded());
app.use(express.json());

app.listen(3000, function(){
  console.log('Example app listening on port 3000!');
});

app.use(usersController);
app.use(localeController);
app.use(articleController);
app.use(testController);

app.get('/*', function(req, res){
  res.send(`<!DOCTYPE html>
  <html lang="en">
  <head>
    <title>Document</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="http://localhost:8080/dist/main.js"></script>  
  </body>
  </html>`);
});
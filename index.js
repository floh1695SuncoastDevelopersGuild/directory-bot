'use strict';

const APP_ID = '159041564812667';
const PAGE_ACCESS_TOKEN = 'EAACQpbZC5pXsBAHsvd8mzcvRJh7KCJ7rmPxdQCQvWGfdPUG3ZA31BcaWvRkuz9ZAmsKmcsmoXSHYcJv24eNMWoUKZArjLMgEj0V1kJ15zuBHPTCqWp3JpNd6ZBG0s0fFYo23af66LZAL7trRNQwpHj9J5zcd5ZAeGP7RE827hDbFwZDZD';

const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const app = express().use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('pages/index'));

app.get('/hello', (req, res) => {
  // res.json({ hello: 'world' })
  res.send('<button>clickme</button>');
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

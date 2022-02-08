const express = require('express');
const bodyParser= require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const port = 5000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

const connectionString = process.env.API_KEY;

MongoClient.connect(connectionString)
    .then(client => {
        console.log('Connected to Database');

        const db = client.db('quotes');
        const quotesCollection = db.collection('quotes')

        app.post('/post', (req, res) => {
            quotesCollection.insertOne(req.body)
            .then(result => {
                res.redirect('/')
            })
            .catch(error => console.error(error))
        });
        
        app.get('/', (req, res) => {
            db.collection('quotes').find().toArray()
            .then(results => {
                res.render('index.ejs', { quotes: results })
                console.log(results)
            })
            .catch(error => console.error(error))
        });

      })
      .catch(error => console.error(error))



app.listen(port, () => {
    console.log('Server started');
    console.log(`listening on ${port}`);
});




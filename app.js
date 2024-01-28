// app.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/watchlist', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});



// Schema
const watchlistSchema = new mongoose.Schema({
  name: String,
  platform: String,
  genre: String,
  link: String,
});

// Model creation
const WatchlistItem = mongoose.model('WatchlistItem', watchlistSchema);



// POST request
app.post('/watchlist', (req, res) => {
  const newItem = new WatchlistItem(req.body);
  newItem.save()
  .then(savedItem => {
    res.status(201).json(savedItem);
  })
  .catch(err => {
    res.status(500).send(err.message);
  });
});

// GET request
app.get('/watchlist', (req, res) => {
    WatchlistItem.find({})
    .then(items => {
      res.json(items);
    })
    .catch(err => {
      res.status(500).send(err.message);
    });
});

// PUT request
app.put('/watchlist/:name', async (req, res) => {
    const itemName = req.params.name;
    const updatedItemData = req.body; 
  
    try {
      const updatedItem = await WatchlistItem.findOneAndUpdate(
        { name: itemName },
        updatedItemData,
        { new: true } 
      );
  
      if (!updatedItem) {
        return res.status(404).json({ message: 'Item not found' });
      }
  
      res.json(updatedItem);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

// DELETE request
app.delete('/watchlist/:name', async (req, res) => {
    const itemName = req.params.name;
  
    try {
      const deletedItem = await WatchlistItem.findOneAndDelete({ name: itemName });
  
      if (!deletedItem) {
        return res.status(404).json({ message: 'Item not found' });
      }
  
      res.json(deletedItem);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

// run server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

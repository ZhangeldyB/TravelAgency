const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const travelRoutes = require('./routes/travelRoutes') 
const app = express();
const port = 3000;

mongoose.connect('mongodb+srv://zhantikbeisenov:TgEkB8JSo4Nft5OA@travelagency.5spu1fz.mongodb.net/travelAgency?retryWrites=true&w=majority&appName=travelAgency', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', travelRoutes);

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
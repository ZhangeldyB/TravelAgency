const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    depCountry: String,
    depCity: String,
    arrCountry: String,
    arrCity: String,
    hotel: String,
    dateDeparture: Date,
    dateReturn: Date,
    adults: Number,
    children: Number,
    tourCost: Number,
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
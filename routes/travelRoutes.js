const express = require('express');
const router = express.Router();
const fs = require('fs');
const data = require('../public/data/data.json');
const path = require('path');
const { error } = require('console');
const Tour = require('../models/tourModel');

router.use(express.json());

router.route('/travelagency')
    .get((req, res) => {
        res.sendFile(path.join(__dirname, '..' ,'views', 'index.html'));
    })
    .post(async (req, res) => {
        try{
            const { depCountry, depCity, arrCountry, arrCity, hotel, dateDeparture, dateReturn, adults, children } = req.body;
            const tourCost = calculateTourCost(adults, children, hotel, dateDeparture, dateReturn);

            const tourItem = new Tour({
                depCountry,
                depCity,
                arrCountry,
                arrCity,
                hotel,
                dateReturn,
                dateDeparture,
                adults,
                children,
                tourCost,
            });
            await tourItem.save();
            res.json({status: 200, result: tourItem});
        }catch (error){
            res.json({status: 400, result: ""});
        }
    });

router.get('/history', (req, res) => {
    res.json({ history: data.tours });
});

function calculateTourCost(adults, children, hotel, dateDeparture, dateReturn) {
    const flightPrice = getHotelPrice(hotel);

    const baseCost = adults * 150;

    const departureDate = new Date(dateDeparture);
    const arrivalDate = new Date(dateReturn);
    const numberOfDays = Math.ceil((arrivalDate - departureDate) / (1000 * 60 * 60 * 24));

    const totalCost = numberOfDays * baseCost + (adults * children) * flightPrice;

    return totalCost;
}

function readToursData() {
    const filePath = path.join(__dirname, '../public/data/data.json');
    try {
        const fileData = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(fileData);
    } catch (error) {
        console.error('Error reading data.json:', error);
        return { tours: [] };
    }
}

function getHotelPrice(hotelName) {
    for (const country of data.map) {
        for (const city of country.cities) {
            const hotel = city.hotels.find(h => h === hotelName);
            if (hotel) {
                return city.price;
            }
        }
    }
    return 0;
}

module.exports = router;

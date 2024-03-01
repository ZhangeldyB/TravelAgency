const express = require('express');
const router = express.Router();
const fs = require('fs');
const data = require('../public/data/data.json');
const path = require('path');
const { error } = require('console');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');

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

router.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, '..' ,'views', 'registration.html'));
});

router.post('/main', async (req, res) => {
    console.log(req.body)
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.json({status:200});
    } catch (error) {
        res.json({status:400});
    }
});

router.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '..' ,'views', 'admin.html'));
});

router.get('/admin/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        res.status(500).send('Error fetching users.');
    }
});

router.post('/admin/delete/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        await User.findByIdAndDelete(userId);
        res.redirect('/admin');
    } catch (error) {
        res.status(500).send('Error deleting user.');
    }
});

router.get('/admin/edit/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        res.json(user);
    } catch (error) {
        res.status(500).send('Error fetching user data for editing.');
    }
});

router.post('/admin/edit/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const { username, email } = req.body;
        await User.findByIdAndUpdate(userId, { username, email });
        res.status(200).send('User updated successfully.');
    } catch (error) {
        res.status(500).send('Error editing user.');
    }
});

router.route('/login')
.get((req, res) => {
    res.sendFile(path.join(__dirname, '..' ,'views', 'login.html'));
})
.post(async (req, res) => {
    const { username, password } = req.body;
        if ((username == 'Admin') && (password == 'Admin123')) {
            res.status(200).json({ message: 'admin' });
            return;
        }
        try {
            const user = await User.findOne({ username, password });

            if (user) {
                res.status(200).json({ message: 'Login successful' });
            } else {
                res.status(401).json({ message: 'Invalid username or password' });
            }
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
  });


module.exports = router;

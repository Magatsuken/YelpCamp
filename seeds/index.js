const mongoose = require('mongoose');
const campground = require('../models/campground');
const Campground = require('../models/campground');
const cities = require('./cities');
// Destruct to use :)
const { descriptors, places } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Database connected");
});

// Delete everything then make new campgrounds
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const random18 = Math.floor(Math.random() * 18);
        const random21 = Math.floor(Math.random() * 21);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '633c6abdd5a76138d660904c',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${descriptors[random18]} ${places[random21]}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/di3d0em2k/image/upload/v1665073162/YelpCamp/eptvgwjy788jue4cbqxy.jpg',
                    filename: 'YelpCamp/eptvgwjy788jue4cbqxy',
                }
            ],
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum minus assumenda porro, esse totam officia harum sint veniam tenetur voluptate, eius, animi explicabo! Corporis, commodi ut eveniet facere consequuntur rerum.",
            price: `${price}`
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
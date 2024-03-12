import { database } from '../db.js';
import generateToken from '../generateToken.js';
import { hash, unHash } from '../hash.js';

const Users = database.collection('users');
const Dealerships = database.collection('dealerships');
const Cars = database.collection('cars');

export const allCars = async (req, res) => {
    const cars = await Cars.find({}).toArray();
    if (cars)
        res.status(202).send(cars);
    else
        res.status(400).send('Could not fetch');
}

export const carsByDealership = async (req, res) => {
    const { _id } = req.body;
    const dealer = await Dealerships.findOne({ _id });
    if (dealers) {
        const cars = await dealer.cars.map(async (car) => await Cars.findOne({ _id: car }));
        if(cars)
            res.status(202).send(cars);
        else
            res.status(400).send('No cars available at this dealership');
    }
    else
        res.status(400).send('Could not fetch');
}
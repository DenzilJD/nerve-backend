import { database } from '../db.js';
import generateToken from '../generateToken.js';
import { hash, unHash } from '../hash.js';

const Users = database.collection('users');
const Dealerships = database.collection('dealerships');
const Cars = database.collection('cars');
const SoldCars = database.collection('soldCars');

export const createDealer = async (req, res) => {
    const { name, email, location, info, password, cars, deals, soldCars } = req.body;
    if (!name || !email || !password) {
        res.status(400).send('Required fields missing');
        return;
    }
    const dealer = await Dealerships.findOne({ email });
    if (dealer) {
        res.status(400).send('Dealer already exists');
        return;
    }
    const hashedPassword = await hash(password);
    const newDealer = await Dealerships.insertOne(
        { name, email, location, info, password: hashedPassword, cars, deals, soldCars }
    );
    if (newDealer) {
        generateToken(res, `${newDealer.insertedId}`);
        res.status(201).send('Created');
        return;
    }
    res.status(500).send('Could not create new dealer');
};

export const loginDealer = async (req, res) => {
    const { email, password } = req.body;
    const getDealer = await Dealerships.findOne({ email });
    console.log(getDealer);
    if (await getDealer) {
        if (await unHash(password, getDealer.password)) {
            generateToken(res, `${getDealer._id}`);
            res.status(200).send('Logged in');
        }
        else
            res.status(401).send('Incorrect password');
    }
    else
        res.status(400).send('User not found');
};

export const logoutDealer = async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    }).send('Logged out');
};

export const addCar = async (req, res) => {
    const { _id, type, name, model, info } = req.body;
    const car = await Cars.insertOne({ type, name, model, info, dealer: _id });
    const dealer = await Dealerships.updateOne({ _id }, { $addToSet: { cars: `${car._id}` } });
    if (dealer)
        res.status(202).send('Successfully added car to dealership');
    else
        res.status(400).send('No such dealership found');
}

export const getDeals = async (req, res) => {
    const { _id } = req.body;
    if (!_id)
        res.status(400).send('Missing required parameters');
    const deals = await SoldCars.find({});
    if (deals)
        res.status(200).send(deals);
    else
        res.status(400).send('Could not fetch deals');
}
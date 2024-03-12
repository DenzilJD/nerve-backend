import { database } from '../db.js';
import generateToken from '../generateToken.js';
import { hash, unHash } from '../hash.js';

const Users = database.collection('users');
const Dealerships = database.collection('dealerships');
const Cars = database.collection('cars');
const OwnedCars = database.collection('soldCars');

export const createUser = async (req, res) => {
    const { name, email, location, info, password, ownedCars } = req.body;
    if (!name || !email || !password) {
        res.status(400).send('Required fields missing');
        return;
    }
    const user = await Users.findOne({ email });
    if (user) {
        res.status(400).send('User already exists');
        return;
    }
    const hashedPassword = await hash(password);
    const newUser = await Users.insertOne(
        { name, email, location, info, password: hashedPassword, ownedCars }
    );
    if (newUser) {
        generateToken(res, `${newUser.insertedId}`);
        res.status(201).send('Created');
        return;
    }
    res.status(500).send('Could not create new user');
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const getUser = await Users.findOne({ email });
    console.log(getUser);
    if (await getUser) {
        if (await unHash(password, getUser.password)) {
            generateToken(res, `${getUser._id}`);
            res.status(200).send('Logged in');
        }
        else
            res.status(401).send('Incorrect password');
    }
    else
        res.status(400).send('User not found');
};

export const logoutUser = async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    }).send('Logged out');
};

export const carsByDealership = async (req, res) => {
    // const { name } = req.body;
    const cars = await Users.find({});
    if (cars) {
        console.log(cars);
        // const dealers = await cars.dealers.map(async (_id) => await Dealerships.find({ _id }));
        // if (dealers) {
        //     const updatedDealers = dealers.map(dealer => {
        //         return { ...dealer, password: '', soldCars: [] }
        //     });
        //     res.status(200).send(updatedDealers);
        // }
        // else
        //     res.status(400).send('No dealer has this car available');
    }
    else
        res.status(400).send('No such car exsits');
}

export const ownedCarsInfo = async (req, res) => {
    const { _id } = req.body;
    const user = await users.findOne({ _id });
    if (user) {
        const cars = await user.ownedCars.map(async (ownedCar) => {
            const tempCar = await OwnedCars.findOne({ _id: ownedCar._id });
            if (tempCar) {
                const car = await Cars.findOne({ _id: tempCar.car });
                if (car) {
                    const dealer = await Dealerships.findOne({ _id: tempCar.dealer });
                    if (dealer) {
                        dealer.password = '';
                        dealer.deals = [];
                        return [car, dealer];
                    }
                    else
                        return [null, null];
                }
                return [null, null];
            }
            else
                return [null, null];
        });
    }
}
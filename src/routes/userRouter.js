import {Router} from 'express';
import userModel from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const router = Router();

// Login

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).send({ status: 'error', message: 'User not found'});
        }

        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(400).send({ status: 'error', message: 'Invalid credentials'});
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role }, 
            process.env.JWT_SECRET, 
            {expiresIn: '1h'});

        res.send({
            status: 'success',
            token
        });
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: error.message
        });
    }
});

// Crear un usuario
router.post('/', async (req, res) => {
    const { first_name, last_name, age, email, password } = req.body;

    try {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const result = await userModel.create({
            first_name,
            last_name,
            age,
            email,
            password: hashedPassword
        });

        res.send({
            status: 'success',
            payload: result
        });        
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

//----------------------------------------


// Consultar todos los usuarios
router.get('/', async (req, res) => {

    try {
        const result = await userModel.find();
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: error.message
        });
    }
});

// Actualizar un usuario
router.put('/:uid', async (req, res) => {
    const uid = req.params.uid;
    const {name, age, email} = req.body;
    try {
        const user = await userModel.findOne({_id: uid});
        if (!user) throw new Error('User not found');

        const newUser = {
            name: name ?? user.name,
            age: age ?? user.age,
            email: email ?? user.email
        }

        const updateUser = await userModel.updateOne({_id: uid}, newUser);
        res.send({
            status: 'success',
            payload: updateUser
        });

    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

// Eliminar un usuario
router.delete('/:uid', async (req, res) => {
    const uid = req.params.uid;
    try {
        const result = await userModel.deleteOne({_id: uid});
        res.status(200).send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

export default router;
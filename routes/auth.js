const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { reisterValidation, loginValidation } = require('../validation');


router.post('/register', async (req, res) => {

    
    const {error} = reisterValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email alredy exsist');

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });

    try {
        const savedUser = await user.save();
        res.send({user: savedUser._id});
    } catch (error) {
        res.status(400).send(error);
    }
});


router.post('/login', async (req, res) =>{

    const { error } = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email or Password is wrong');

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Email or password is wrong');

    const token = jwt.sign({_id: user._id}, 'sdbfdbfhlds');

    res.header('auth-token', token);

    res.send('ok');
});


module.exports = router;
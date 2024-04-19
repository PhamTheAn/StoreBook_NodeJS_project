var express = require('express')

var router = express();

var bodyParser = require("body-parser");

var db = require('../db');

const { User } = require('../models/user');

const { Product } = require('../models/product')

const { Sequelize } = require('sequelize');

const productControllers = require('../controllers/product_controller');

const userControllers = require('../controllers/user_controller')

const { sequelize } = require('../db_sequelize');

const notifier = require('node-notifier');

const bcrypt = require('bcrypt');

const session = require('express-session');

router.use(express.urlencoded({ extended: true }));

router.use(session({
    secret: 'an22092003', // Chuỗi bí mật để ký và giải mã cookie session
    resave: true,
    saveUninitialized: true
}));

// sử dụng middleware để kiểm tra session
router.use((req, res, next) => {
    res.locals.username = req.session.user ? req.session.user.username : null;
    res.locals.id = req.session.user ? req.session.user.id : null;
    res.locals.role = req.session.user ? req.session.user.role : null;
    next();
});

//api user

router.get('/v1/user', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', "username", "email", "role"]
        });
        res.json(users);
    } catch (error) {
        console.log(error);
    }
})

router.get('/v1/product', async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        console.log(error);
    }
})



router.get('/search', productControllers.searchProducts)

router.use(express.json());




router.get('/', productControllers.listProduct)

// router.get('/', (req, res) => {
//     res.render('index', productControllers.listProduct)
// })


// đăng nhập
router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', userControllers.userlogin)

// đăng xuât 
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/')
})


// Đăng ký
router.get('/registed', (req, res) => {
    res.render('registed')
})

router.post('/registed', userControllers.userRegisted)




module.exports = router;

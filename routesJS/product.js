var express = require('express')

var router = express.Router()

const { Product } = require('../models/product');

const productControllers = require('../controllers/product_controller')
const categoryControllers = require('../controllers/category_controller')

const { Sequelize } = require('sequelize');

const { sequelize } = require('../db_sequelize');

const validationForm = require('../middleware/validation')

// router.get('/', categoryControllers.getCategoriesByPK);


router.get('/:productId', productControllers.detaiProuduct);

router.post('/comment/:productId',productControllers.commentProduct)


module.exports = router;
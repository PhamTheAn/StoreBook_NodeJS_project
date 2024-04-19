var express = require('express')
const notifier = require('node-notifier');
const multer = require('multer');
const path = require('path');
const { Sequelize } = require('sequelize');
const { sequelize } = require('../db_sequelize');
const { Product } = require('../models/product');
const productControllers = require('../controllers/product_controller');
const categoryControllers = require('../controllers/category_controller');
const commentController = require('../controllers/comment_controller');
const userController = require('../controllers/user_controller');
var bodyParser = require("body-parser");
var router = express();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Cấu hình Multer để lưu hình ảnh vào thư mục 'public/image'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/image');
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

router.get('/',(req, res) => {
    const role = res.locals.role;
    if(role === 'admin') {
        res.render("admins/index")
    }else {
        notifier.notify({
            title: 'Thông báo',
            message:"Không thể truy cập đến địa chỉ này"
        });
        res.redirect('/')
    }
})

// Router admin category
router.get('/categories', categoryControllers.getAllCategories);

router.get('/categories/add', categoryControllers.createCategories);

router.post('/categories/add', categoryControllers.addCategories);

router.get('/categories/edit/:id', categoryControllers.editCategory);

router.post('/categories/edit/:id', categoryControllers.updateCategories);

router.post('/categories/delete/:id', categoryControllers.deleteCategory);


// Router admin product
router.get('/products', productControllers.getAllProducts)

router.get('/products/add', productControllers.createProduct)

router.post('/products/add', upload.single('productImage'), productControllers.addProduct)

router.get('/products/edit/:id', productControllers.editProduct)

router.post('/products/edit/:id', upload.single('productImage'), productControllers.updateProduct)

router.post('/products/delete/:id', productControllers.deleteProduct)

//Router admin comments

router.get('/comments', commentController.getAllComment)
router.post('/comments/delete/:id', commentController.deleteComment)

// admin User 

router.get('/users', userController.listProduct)
router.post('/users/delete/:id', userController.blockUser)





module.exports = router;
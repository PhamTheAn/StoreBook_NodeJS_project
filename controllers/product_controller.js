const { Product } = require('../models/product')
const notifier = require('node-notifier');
var bodyParser = require("body-parser");
const { Comment } = require('../models/comment')

const { Sequelize, Op } = require('sequelize');

const { User } = require('../models/user')

const path = require('path');
const sequelize = require('../db_sequelize');


const iconPath = path.join(__dirname, '../public/image/logo.png');



const productControllers = {
    //Search 
    searchProducts: async(req, res) => {
        const searchTerm = req.query.q;
        if(searchTerm) {
            try{
                const { count, rows: results } = await Product.findAndCountAll({
                    where: {
                        [Op.or]: [
                            {
                                name_product: {
                                    [Op.like]: `%${searchTerm}%`,
                                },
                            },
                            {
                                author: {
                                    [Op.like]: `%${searchTerm}%`,
                                },
                            },
                            {
                                genre: {
                                    [Op.like]: `%${searchTerm}%`,
                                },
                            }
                        ]
                    }
                })
    
                const alearNotFound = `0 Result for "${searchTerm}"`
                const quanlityProduct = `${count} Result for "${searchTerm}"`
                if(results && results.length > 0) {
                    res.render('products/search', { results, quanlityProduct })
                }else{
                    res.render('products/search404NotFound', { alearNotFound })
                }
            }catch(error) {
                console.error('Error searching products:', error);
                res.status(500).send('Internal Server Error');
            }
        }else {
            res.redirect('/')
            notifier.notify({
                title: 'Thông báo',
                message: "Hãy nhập thứ bạn muốn tìm kiếm <3",
                icon: iconPath // Đường dẫn đến icon
            });
        }
    },

    //Comment 
    commentProduct: async(req, res) => {
        const contentComment = req.body.commentProduct;
        const userId = res.locals.id;
        const productId = req.params.productId;
        const username = res.locals.username
        console.log("User ID: " , userId);
        console.log("productId : " , productId);
        console.log("contentComment : " , contentComment);
        console.log("username : " , username);

        if(!userId) {
            notifier.notify({
                title: 'Thông báo',
                message: "Xin vui lòng đăng nhập để được bình luận !!!",
                icon: iconPath // Đường dẫn đến icon
            });
            res.redirect(`/product/${productId}`);
        }
        else if(!contentComment) {
            notifier.notify({
                title: 'Thông báo',
                message: "Bình luận không được để trống. Xin cảm ơn <3",
                icon: iconPath // Đường dẫn đến icon
            });
            res.redirect(`/product/${productId}`);
        }
        else {
            try{
                const comment = await Comment.create({
                    content: contentComment,
                    userId: userId,
                    username: username,
                    productId: productId

                })
                res.redirect(`/product/${productId}`);
            }catch(error) {
                console.error('Lỗi thêm bình luận:', error);
                res.status(500).send('Error send comment');
            }
        }
    },

    //Show all product
    listProduct: async(req, res) => {
        const products = await Product.findAll();
        res.render("index", { products })
    },

    detaiProuduct: async(req, res) => {
        try{
            const productId = req.params.productId;

            const comments = await Comment.findAll({
                where: {
                    productId : productId
                },
            })

            // Hàm tính toán thời gian

            const calculateRelativeTime = (createdAt) => {
                const now = new Date();
                const commentTime = new Date(createdAt);
                const timeDifference = now - commentTime;
                const daysDifference = Math.floor(timeDifference / ( 1000 * 60 * 60 * 24))

                if(daysDifference > 0) {
                    return `${daysDifference} ngày trước`
                }

                const hoursDifference = Math.floor(timeDifference / ( 1000 * 60 * 60))
                if(hoursDifference > 0) {
                    return `${hoursDifference} giờ trước`
                }

                const minutesDifference = Math.floor(timeDifference / ( 1000 * 60))
                if(minutesDifference > 0) {
                    return `${minutesDifference} phút trước`
                }

                return "Vừa xong"
            }

            comments.forEach(comment => {
                comment.relativeTime = calculateRelativeTime(comment.createdAt);
            })

            // Const userInfo
            const product = await Product.findOne({
                where: {
                    id : productId
                }
            })


            if(product) {
                res.render('products/detailProduct', { product, comments});
            }else {
                res.status(404).send('Not found product');
            }
        }catch(error) {
            console.error('Lỗi khi tìm kiếm chi tiết sản phẩm:', error);
            res.status(500).send('Internal Server Error');
        }
    },


    //

    //Lấy tất cả sản phẩm
    getAllProducts: async (req, res) => {
        const role = res.locals.role;
        if (role === 'admin') {
            try {
                const products = await Product.findAll()
                res.render("admins/products", { products })
            } catch (error) {
                console.error('Error fetching products:', error);
                res.status(500).send('Internal Server Error');
            }
        } else {
            notifier.notify({
                title: 'Thông báo',
                message: "Không thể truy cập đến địa chỉ này",
                icon: iconPath // Đường dẫn đến icon
            });
            res.redirect('/')
        }
    },

    // Tạo sản phẩm
    createProduct: async (req, res) => {
        const role = res.locals.role;
        if (role === 'admin') {
            res.render('admins/addProducts')
        } else {
            notifier.notify({
                title: 'Thông báo',
                message: "Không thể truy cập đến địa chỉ này",
                icon: iconPath // Đường dẫn đến icon
            });
            res.redirect('/')
        }
    },

    // Thêm sản phẩm
    addProduct: async (req, res) => {
        const productName = req.body.productName;
        const productDescription = req.body.productDescription;
        const productPrice = req.body.productPrice;
        const productAuthor = req.body.productAuthor;
        const productGenre = req.body.productGenre;
        const productImage = req.file.filename;
        const productCategoryID = req.body.productCategoryID;

        try {
            const newProduct = await Product.create({
                name_product: productName,
                description: productDescription,
                price: productPrice,
                author: productAuthor,
                genre: productGenre,
                image: "/image/" + productImage,
                categoryId: productCategoryID,
            })
            notifier.notify({
                title: 'Thông báo',
                message: "Thêm sản phẩm thành công",
                icon: iconPath // Đường dẫn đến icon
            })
            res.redirect('/admin/products');

        } catch (error) {
            notifier.notify({
                title: 'Thông báo',
                message: `${error}`,
                icon: iconPath // Đường dẫn đến icon
            })
            res.status(500).send('Internal Server Error');
        }
    },

    editProduct: async (req, res) => {
        const role = res.locals.role;
        if (role === 'admin') {
            const productId = req.params.id;
            try {
                const product = await Product.findByPk(productId);
                res.render('admins/editProduct', { product })
            } catch (error) {
                console.error('Error:', error);
                res.status(500).send('Internal Server Error');
            }
        } else {
            notifier.notify({
                title: 'Thông báo',
                message: "Không thể truy cập đến địa chỉ này",
                icon: iconPath // Đường dẫn đến icon
            });
            res.redirect('/')
        }
    },

    updateProduct: async (req, res) => {
        const productId = req.params.id;
        const dataNewProduct = {
            name_product: req.body.productName,
            description: req.body.productDescription,
            price: req.body.productPrice,
            author: req.body.productAuthor,
            genre: req.body.productGenre,
            image: "/image/" + req.file.filename
        }

        try {
            const [updateRows] = await Product.update(dataNewProduct, {
                where: {
                    id: productId
                }
            })

            if (updateRows > 0) {
                notifier.notify({
                    title: 'Thông báo',
                    message: "Sửa sản phẩm thành công",
                    icon: iconPath // Đường dẫn đến icon
                })
                res.redirect('/admin/products'); // Chuyển hướng sau khi sửa thành công
            } else {
                res.status(404).send('Product not found');
            }
        } catch (error) {

        }
    },

    deleteProduct: async (req, res) => {
        const productId = req.params.id;
        try{
            const product = await Product.findByPk(productId);
            if(product) {
                await product.destroy()
                notifier.notify({
                    title: 'Thông báo',
                    message: 'Xóa sản phẩm thành công',
                    icon: iconPath // Đường dẫn đến icon
                });
                res.redirect('/admin/products');
            }else{
                console.log('Product is not define');
            }
        }catch(error) {
            console.error('Error deleting product:', error);
            res.status(500).send('Internal Server Error');
        }
    }

}

module.exports = productControllers;
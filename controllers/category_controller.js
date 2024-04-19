const notifier = require('node-notifier');
var bodyParser = require("body-parser");
const Category = require('../models/category');
const {Product} = require('../models/product');

const path = require('path');


const iconPath = path.join(__dirname, '../public/image/logo.png');

const categoryControllers = {

    // getCategoriesByPK: async (req, res) => {
    //     try {
    //       // Sử dụng await để đảm bảo lấy dữ liệu thành công trước khi render trang
    //       const category = await Category.findByPk(1, { include: Product });
      
    //       if (!category) {
    //         // Xử lý trường hợp không tìm thấy danh mục
    //         return res.status(404).send('Category not found');
    //       }else {
    //         console.log("Product by cate : ", category);
    //       }
      
    //       // Render trang với dữ liệu đã lấy được
    //       res.render('products/productByCate', { category });
    //     } catch (error) {
    //       // Xử lý lỗi nếu có
    //       console.error('Error retrieving category:', error);
    //       res.status(500).send('Internal Server Error');
    //     }
    // },

    getAllCategories: async (req, res) => {
        const role = res.locals.role;
        if (role === 'admin') {
            try {
                const categories = await Category.findAll()
                res.render("admins/categories", { categories })
            } catch (error) {
                console.error('Error fetching Categories:', error);
                res.status(500).send('Internal Server Error');
            }
        } else {
            notifier.notify({
                title: 'Thông báo',
                message: "Không thể truy cập đến địa chỉ này",
                icon: iconPath,
            });
            res.redirect('/')
        }
    },

    createCategories: async (req, res) => {
        const role = res.locals.role;
        if (role === 'admin') {
            res.render('admins/addCategories')
        } else {
            notifier.notify({
                title: 'Thông báo',
                message: "Không thể truy cập đến địa chỉ này",
                icon: iconPath,
            });
            res.redirect('/')
        }
    },

    addCategories: async (req, res) => {
        const categoryName = req.body.categoryName;

        try {
            const newProduct = await Category.create({
                name: categoryName
            })
            notifier.notify({
                title: 'Thông báo',
                message: "Thêm danh mục thành công",
                icon: iconPath,
            })
            res.redirect('/admin/categories');

        } catch (error) {
            notifier.notify({
                title: 'Thông báo',
                message: `${error}`,
                icon: iconPath,
            })
            res.status(500).send(error);
        }
    },

    editCategory: async (req, res) => {
        const role = res.locals.role;
        if (role === 'admin') {
            const categoryId = req.params.id;
            try {
                const category = await Category.findByPk(categoryId);
                res.render('admins/editCategory', { category })
            } catch (error) {
                console.error('Error:', error);
                res.status(500).send('Internal Server Error');
            }
        } else {
            notifier.notify({
                title: 'Thông báo',
                message: "Không thể truy cập đến địa chỉ này",
                icon: iconPath,
            });
            res.redirect('/')
        }
    },

    updateCategories: async (req, res) => {
        const categoryId = req.params.id;
        
            const newNameCategory =  {
                name : req.body.categoryName  
            } 

        try {
            const [updateRows] = await Category.update(newNameCategory, {
                where: {
                    id: categoryId
                }
            })

            if (updateRows > 0) {
                notifier.notify({
                    title: 'Thông báo',
                    message: "Sửa sản phẩm thành công",
                    icon: iconPath,
                })
                res.redirect('/admin/categories'); // Chuyển hướng sau khi sửa thành công
            } else {
                res.status(404).send('Product not found');
            }
        } catch (error) {

        }
    },

    deleteCategory: async (req, res) => {
        const categoryId = req.params.id;
        try{
            const category = await Category.findByPk(categoryId);
            if(category) {
                await category.destroy()
                notifier.notify({
                    title: 'Thông báo',
                    message: 'Xóa danh mục thành công',
                    icon: iconPath,
                });
                res.redirect('/admin/categories');
            }else{
                console.log('Category is not define');
            }
        }catch(error) {
            console.error('Error deleting product:', error);
            res.status(500).send('Internal Server Error');
        }
    }
}

module.exports = categoryControllers;
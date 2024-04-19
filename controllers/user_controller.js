let userModel = require("../models/user");
const notifier = require('node-notifier');
var bodyParser = require("body-parser");
const { Sequelize, Op } = require('sequelize');
const sequelize = require('../db_sequelize');
const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const path = require('path');
const iconPath = path.join(__dirname, '../public/image/logo.png');




const userController = {
  userlogin: async (req, res) => {
    const infoLogin = req.body;
    if (!infoLogin.username || !infoLogin.password) {
      // return res.status(400).send('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu');
      notifier.notify({
        title: 'Thông báo',
        message: "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu !!!",
        icon: iconPath,
      });
    }else {
      const user = await User.findOne({
        where: { username: infoLogin.username }
      });
      // console.log('result: ', user.password);
      if (user === null) {
        notifier.notify({
          title: 'Thông báo',
          message: "Người dùng không tồn tại !!!",
          icon: iconPath,
        }
        )
      }else {
        const isMatch = await bcrypt.compare(infoLogin.password, user.password)
    
        if (isMatch) {
          notifier.notify({
            title: 'Thông báo',
            message: "Đăng nhập thành công !!!",
            icon: iconPath,
          })
          req.session.user = { id: user.id, username: user.username, role: user.role }
          console.log(user);
          res.redirect('/');
        } else {
          notifier.notify({
            title: 'Thông báo',
            message: "Mật khẩu không chính xác, xin vui lòng nhập lại mật khẩu !!!",
            icon: iconPath,
          })
        }
      }
    }

  },
  userRegisted : async(req, res) => {
    infoRegisted = req.body;
    const userPassword = infoRegisted.password;
    const userEmail = infoRegisted.email;
    const userconfirmPassword = infoRegisted.confirmPassword;
    const userName = infoRegisted.username;


    if (userName && userEmail && userPassword && userconfirmPassword) {

        bcrypt.hash(userPassword, 10, async (err, hash) => {
            if (err) {
                console.log('Lỗi khi mã hóa mật khẩu:', err);
            } else {
                console.log("Đăng ký thành công !!!");
                console.log('Hashed Password:', hash);

                await User.create({
                    username: infoRegisted.username,
                    email: infoRegisted.email,
                    password: hash,
                    role: 'customer'
                }).then(user => {
                    // console.log('Người dùng đã được tạo:', user.toJSON());
                    notifier.notify({
                        title: 'Thông báo',
                        message: "Người dùng đã được tạo !!!"
                    });
                    res.redirect("/login")
                }).catch(err => {
                    console.error('Lỗi khi tạo người dùng:', err);
                });
            }
        })
    } 
    else {
        notifier.notify({
            title: 'Thông báo',
            message: "Vui lòng nhập đầy đủ thông tin !!!"
        });
    }
  },
  listProduct: async(req, res) => {
    const users = await User.findAll();
    res.render("admins/users", { users })
  }, 
  blockUser: async (req, res) => {
    const userId = req.params.id;
    try{
        const user = await User.findByPk(userId);
        if(user) {
            await user.destroy()
            notifier.notify({
                title: 'Thông báo',
                message: 'Block người dùng thành công',
                icon: iconPath // Đường dẫn đến icon
            });
            res.redirect('/admin/users');
        }else{
            console.log('User is not define');
        }
    }catch(error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Internal Server Error');
    }
}
}

module.exports = userController;
var validator = require('validator');
const notifier = require('node-notifier');
const path = require('path');


const iconPath = path.join(__dirname, '../public/image/logo.png');
const validationForm = {
    formComment: async(req, res , next) => {
        const contentComment = req.body.commentProduct;
        
        const error = validator.isEmpty(contentComment);
        if(error === true) {
            notifier.notify({
                title: 'Thông báo',
                message:"Bình luận rỗng, không thể gửi !!!",
                icon: iconPath // Đường dẫn đến icon
            });
        }else {
            return next();
        }

    }
}

module.exports = validationForm
const sequelize = require('../db_sequelize');

const { Comment } = require('../models/comment')

const notifier = require('node-notifier');

const path = require('path');

const iconPath = path.join(__dirname, '../public/image/logo.png');

const commentController = {

    getAllComment : async(req, res) => {
        const role = res.locals.role;
        if( (role === 'admin')) {
            try{
                const comments = await Comment.findAll()
                res.render('admins/comments', {comments} )
            }catch(error) {
                console.error('Error fetching Categories:', error);
                res.status(500).send('Internal Server Error');
            }
        }else {
            notifier.notify({
                title: 'Thông báo',
                message: "Không thể truy cập đến địa chỉ này",
                icon: iconPath,
            });
            res.redirect('/')
        }
    },

    deleteComment: async(req, res) => {
        const role = res.locals.role;
        const commentId = req.params.id
        if(role === 'admin') {
            try {
                const commentDelete = await Comment.findByPk(commentId)
                if(commentDelete) {
                    await commentDelete.destroy()

                    notifier.notify({
                        title: 'Thông báo',
                        message: 'Xóa bình luận thành công',
                        icon: iconPath // Đường dẫn đến icon
                    });
                    res.redirect('/admin/comments');
                }else {
                    console.log('Comment is not define');
                }
            }catch(error) {
                console.error('Error deleting comment:', error);
                res.status(500).send('Internal Server Error');
            }
        }
    }

}

module.exports = commentController;

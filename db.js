var mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bookstore",
});

// db.connect((err) => {
//   if (err) {
//       console.error('Error connecting to MySQL: ' + err.stack);
//       return;
//   }
//   console.log('Connected to MySQL as id ' + db.threadId);
// });


// tạo bảng product : 

const createTableProductQuery = `
  CREATE TABLE IF NOT EXISTS product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name_product VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    author VARCHAR(255),
    isbn VARCHAR(20),
    genre VARCHAR(50),
    published_date DATE,
    image VARCHAR(255)
  )
`;

// tạo bảng user :

const createTableUserQuery = `
  CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50)
  )
`;


// db.query(createTableProductQuery, (err, results) => {
//   if(err) {
//     console.log('Lỗi khi tạo bảng product: ', err);
//   }else {
//     console.log('Bảng product đã được tạo thành công');
//   }
// })

// db.query(createTableUserQuery, (err, results) => {
//   if(err) {
//     console.log('Lỗi khi tạo bảng user: ', err);
//   }else {
//     console.log('Bảng user đã được tạo thành công');
//   }
// })

module.exports = db;
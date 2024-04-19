const express = require('express')
const app = express()
const port = 3000
const root_routes = require("./routesJS/root")
const user_routes = require("./routesJS/user")
const product_routes = require("./routesJS/product")
const admin_routes = require("./routesJS/admin")
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))



const sequelize = require('./db_sequelize')

sequelize.sync()
  .then(() => {
    console.log('Database đã được đồng bộ hóa');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });


app.set("views", "./views"); // specify the views directory
app.set("view engine", "ejs"); // register the template engine

app.use("/", root_routes);
// app.use("/user", user_routes);
app.use("/product", product_routes);
app.use("/admin", admin_routes);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
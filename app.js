const express = require("express");
const server = express()
const cookieParser = require("cookie-parser")

require("dotenv").config()
const cors = require("cors")
const db = require("./configs/db")

const configsSwagger = require("./configs/swagger")

const path = require("path")

//Middleware
server.use(express.json())
server.use(express.urlencoded({ extended: false }))
server.use(cors())
server.use("/cover", express.static(path.join(__dirname, "public/covers")))
configsSwagger(server)
server.use(cookieParser(process.env.JWT_SECURITY))
// Require Routes
const productRoutes = require("./module/product/productRoutes")
const menuRoutes = require("./module/menu/menuRoutes")
const userRoutes = require("./module/user/userRoutes")
const basketRoutes = require("./module/basket/basketRoutes")


// use Routes

server.use("/coffee/product", productRoutes)
server.use("/coffee/menu", menuRoutes)
server.use("/coffee/user", userRoutes)
server.use("/coffee/basket", basketRoutes)



//Error Handller

server.use((error, req, res, next) => {
    return res.status(error.status || 500).send({
        message: error.message || "Server Error"
    })
})


server.listen(process.env.PORT, () => {
    console.log(`Server Running On Port ${process.env.PORT}`)
})
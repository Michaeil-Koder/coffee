const express = require("express");
const server = express()


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

// Require Routes
const productRoutes = require("./module/product/productRoutes")
const menuRoutes = require("./module/menu/menuRoutes")



// use Routes

server.use("/coffee/product", productRoutes)
server.use("/coffee/menu", menuRoutes)



//Error Handller

server.use((error, req, res, next) => {
    return res.status(error.status || 500).send({
        message: error.message || "Server Error"
    })
})


server.listen(process.env.PORT, () => {
    console.log(`Server Running On Port ${process.env.PORT}`)
})
const swaggerUi = require("swagger-ui-express")
const swaggerJsDoc = require("swagger-jsdoc")
require("dotenv").config()

const configsSwagger = (app) => {
    const swaggerjsOption = swaggerJsDoc({
        swaggerDefinition: {
            openapi: "3.0.3",
            info: {
                title: "Coffee Shop",
                description: "This project is for practice",
                version: "1.0.0"
            },
            servers: [
                { url: process.env.URL }
            ],
        },
        apis: ["./module/product/productRoutes.js", "./module/menu/menuRoutes.js", "./module/user/userRoutes.js", "./module/basket/basketRoutes.js"]
    })
    app.use("/coffee/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerjsOption))
}

module.exports = configsSwagger
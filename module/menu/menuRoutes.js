const express = require("express");
const menuControllers = require("./menuControllers")

const Router = express.Router()

/**
 * @swagger
 * /coffee/menu:
 *  get:
 *      summary: get All menu
 *      tags:
 *        - Menu
 *      responses:
 *          "200":
 *              description: get All Successfully
 *          '404':
 *              description: menu Not Found
 */
Router.route("/")
    .get(menuControllers.GetAll)


module.exports = Router
const express = require("express");

const basketControllers = require("./basketControllers")

const router = express.Router()

const checkAdmin = require("../../utils/checkAdmin")
const checkColeader = require("../../utils/checkColeader")
const checkBodyId = require("../../utils/checkBodyId")
const checkTokken = require("../../utils/checkTokken")
const checkId = require("../../utils/checkId")




/**
 * @swagger
 * /coffee/basket/finlizeBasket:
 *  post:
 *      summary: finalize Basket
 *      description: Buy Finally user
 *      tags:
 *          - Basket
 *      responses:
 *              '200':
 *                  description: finally basket successfully
 *              '401':
 *                  description: This route is protected
 *              '405':
 *                  description: date not valid
 */
router.route("/finlizeBasket")
    .post(checkTokken, checkId, checkBodyId, basketControllers.finlizeBasket)


router.route("/payVerification")//test for pay
    .get(checkTokken, checkId, basketControllers.payVerification)


/**
 * @swagger
 * /coffee/basket/:
 *  get:
 *      summary: get basket
 *      description: get basket user
 *      tags:
 *          - Basket
 *      responses:
 *              '200':
 *                  description: get successfully
 *              '401':
 *                  description: This route is protected
 *              '405':
 *                  description: date not valid
 */
router.route("/")
    .get(checkTokken, checkId, basketControllers.getBasket)


/**
 * @swagger
 * /coffee/basket/add:
 *  post:
 *      summary: add basket product
 *      description: this route for add prodcut on basket
 *      tags:
 *          - Basket
 *      responses:
 *              '201':
 *                  description: add basket successfully
 *              '401':
 *                  description: This route is protected
 *              '405':
 *                  description: date not valid
 */
router.route("/add")
    .post(checkTokken, checkId, basketControllers.Add)

/**
 * @swagger
 * /coffee/basket/increase/{id}:
 *  put:
 *      summary: increase number of product
 *      description: this route for increase number
 *      tags:
 *          - Basket
 *      responses:
 *              '200':
 *                  description: increase successfully
 *              '401':
 *                  description: This route is protected
 *              '405':
 *                  description: date not valid
 */
router.route("/increase/:id")
    .put(checkTokken, checkId, basketControllers.Increase)


/**
 * @swagger
 * /coffee/basket/decrease/{id}:
 *  put:
 *      summary: decrease number of product
 *      description: this route for decrease number
 *      tags:
 *          - Basket
 *      responses:
 *              '200':
 *                  description: decrease successfully
 *              '401':
 *                  description: This route is protected
 *              '405':
 *                  description: date not valid
 */
router.route("/decrease/:id")
    .put(checkTokken, checkId, basketControllers.Decrease)

/**
 * @swagger
 * /coffee/basket/delete/{id}:
 *  delete:
 *      summary: delete product on basket
 *      description: this route for delete product
 *      tags:
 *          - Basket
 *      responses:
 *              '200':
 *                  description: delete successfully
 *              '401':
 *                  description: This route is protected
 *              '405':
 *                  description: date not valid
 */
router.route("/delete/:id")
    .delete(checkTokken, checkId, basketControllers.Delete)

/**
 * @swagger
 * /coffee/basket/getAll:
 *  get:
 *      summary: get All basket
 *      description: this route for get All basket by coleader
 *      tags:
 *          - Basket
 *      responses:
 *              '200':
 *                  description: get All successfully
 *              '401':
 *                  description: This route is protected
 *              '405':
 *                  description: date not valid
 */
router.route("/getAll")
    .get(checkTokken, checkId, checkColeader, basketControllers.getAll)

module.exports = router
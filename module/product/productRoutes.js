const express = require("express")
const productControllers = require("./productControllers")
const Router = express.Router()

const multer = require("multer")
const { validatorBody, validatorID } = require("../../utils/productValidator")
const { storage, fileFilter } = require("../../utils/uploder")

/**
 * @swagger
 * /coffee/product/create:
 *      post:
 *          summary: create product
 *          description: This Routes for create product
 *          tags:
 *              - Product
 *          requestBody:
 *              descrtiption: Optional description in *Markdown*
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              title:
 *                                  type: string
 *                                  exampele: kapochino
 *                              href:
 *                                  type: string
 *                                  exampele: kapochino_perfect
 *                              rate:
 *                                  type: number
 *                                  exampele: 3
 *                              price:
 *                                  type: number
 *                                  exampele: 5.2
 *                              description:
 *                                  type: string
 *                                  exampele: loremloremloremlorem
 *                              remaining:
 *                                  type: number
 *                                  exampele: 6
 *                              category:
 *                                  type: array
 *                                  exampele: ["oof","blahh"]
 *                              tag:
 *                                  type: array
 *                                  exampele: ["oof","blahh"]
 *                              information:
 *                                  type: object
 *                                  exampele: {"weight":"0.1 kg"}
 *          responses:
 *              '201':
 *                  description: create successfully
 *              '400':
 *                  description: There is propblem
 */
// Router.route("/create")
//     .post(multer({ storage, fileFilter, limits: { fileSize: 1024 * 1024 * 2 } }).fields([
//         { name: "cover", maxCount: 5 }
//     ]), validatorBody(), productControllers.create)
Router.route("/create")
    .post(multer({ storage, fileFilter, limits: { fileSize: 1024 * 1024 * 5 } }).fields([
        { name: "cover", maxCount: 5 }
    ]), productControllers.create)


/**
 * @swagger
 * /coffee/product:
 *  get:
 *      summary: get All product
 *      tags:
 *        - Product
 *      responses:
 *          "200":
 *              description: get All Successfully
 *          '404':
 *              description: product Not Found
 */
Router.route("/")
    .get(productControllers.GetAll)

/**
 * @swagger
 * /coffee/product/{id}:
 *  delete:
 *      summary: remove One product by id
 *      tags:
 *        - Product
 *      parameters:
 *          - name: id
 *            in: path
 *            description: this id from mongoDb
 *            required: true
 *      responses:
 *          "200":
 *              description: remove Successfully
 *          '404':
 *              description: product Not Found
 */
Router.route("/:id")
    .delete(validatorID(), productControllers.remove)


/**
 * @swagger
 * /coffee/product/{href}:
 *  get:
 *      summary: get One product By href
 *      tags:
 *        - Product
 *      parameters:
 *          - name: href
 *            required: true
 *      responses:
 *          "200":
 *              description: get Successfully
 *          '404':
 *              description: product Not Found
 */
Router.route("/:href")
    .get(productControllers.getOne)


module.exports = Router
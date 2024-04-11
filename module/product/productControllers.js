const productModel = require("./Product")
const { validationResult } = require("express-validator")
const path = require("path")
const fs = require("fs")


const removeImage = async (req) => {
    try {
        if (!req.files?.cover) {
            return
        }
        const images = req.files.cover
        images.forEach(image => {
            fs.rmSync(path.join(image.path))
        })
    } catch (error) {
        throw new Error(error.message)
    }
}



exports.create = async (req, res) => {
    try {
        const { title, href, description, category, tag, rate, price, remaining, information } = req.body
        const resualt = validationResult(req)

        if (!resualt.isEmpty()) {
            await removeImage(req)
            return res.status(400).send(resualt)
        } else if (!req.files?.cover) {
            return res.status(400).send({ message: "Please upload at least one photo" })
        }
        const HasProduct = await productModel.findOne({ $or: [{ title }, { href }] })
        if (HasProduct) {
            await removeImage(req)
            return res.status(400).send({ message: "This product has already been created." })
        }
        const cover = []
        req.files.cover.forEach(image => {
            cover.push(image.filename)
        })
        const resCreate = await productModel.create({ title, href, description, category, tag, rate, price, remaining, information, cover })
        res.status(201).send({ "resualt": resCreate })
    } catch (error) {
        await removeImage(req)
        return res.status(error.status || 400).send(error.message || { message: "There is a Propblem" })
    }
}


exports.GetAll = async (req, res) => {
    try {
        const product = await productModel.find({}).select("-__v").lean()
        if (product.length === 0) {
            return res.status(404).send({ message: "Product Not Found" })
        }
        res.send(product)
    } catch (error) {
        return res.status(error.status || 400).send(error.message || { message: "There is a Propblem" })
    }
}



exports.remove = async (req, res) => {
    try {
        const { id } = req.params
        const resualt = validationResult(req)
        if (!resualt.isEmpty()) {
            return res.status(400).send(resualt)
        }
        const removeProduct = await productModel.findByIdAndDelete(id)
        if (!removeProduct) {
            return res.status(404).send({ message: "Product Not Found" })
        }
        res.send({ message: "remove Successfully:))" })
    } catch (error) {
        return res.status(error.status || 400).send(error.message || { message: "There is a Propblem" })
    }
}



exports.getOne = async (req, res) => {
    try {
        const { href } = req.params
        const product = await productModel.findOne({ href }, "-__v").lean()
        if (!product) {
            return res.status(404).send({ message: "Product Not Found!!" })
        }
        res.send(product)
    } catch (error) {
        return res.status(error.status || 400).send(error.message || { message: "There is a Propblem" })
    }
}
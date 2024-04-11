const mongoose = require("mongoose")


const schema = new mongoose.Schema({
    title: {
        type: String,
        minLength: 4,
        maxLength: 20,
        required: true
    },
    href: {
        type: String,
        minLength: 4,
        maxLength: 50,
        required: true
    },
    rate: {
        type: Number,
        minLength: 1,
        maxLength: 5,
        default: 5,
    },
    price: {
        type: Number,
        minLength: 1,
        maxLength: 10,
        required: true
    },
    description: {
        type: String,
        minLength: 5,
        maxLength: 1_000_000_000,
        required: true
    },
    remaining: {
        type: Number,
        minLength: 1,
        maxLength: 30,
        required: true
    },
    cover: {
        type: Array,
        minLength: 1,
        maxLength: 5,
        required: true
    },
    category: {
        type: Array,
        minLength: 1,
        maxLength: 5,
        required: true
    },
    tag: {
        type: Array,
        minLength: 1,
        maxLength: 5,
        required: true
    },
    information: {
        type: Object,
        required: true
    },
}, { timestamps: true })


const model = mongoose.model("Product", schema)

module.exports = model
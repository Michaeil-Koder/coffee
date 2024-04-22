const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    productID: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: true
    },
    userID: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    number: {
        type: Number,
        default: 1,
        required: true
    },
    status: {
        type: String,
        default: "waiting"
    },

}, { timestamps: true })

const model = mongoose.model("Basket", schema)

module.exports = model
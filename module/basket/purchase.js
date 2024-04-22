const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    TotalPrice: {
        type: Number,
        required: true
    },
    creator: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    status: {
        type: String,
        default: "paid"
    },
    createPay: {
        type: Object,
        required: true,
    },
    order: {
        type: Array,
        required: true,
    },
    basketID: {
        type: Array,
        required: true,
    },
    RefID: {
        type: Number,
        default: 12345678
    }

}, { timestamps: true })

const model = mongoose.model("Purchase", schema)

module.exports = model
const jwt = require("jsonwebtoken")
require("dotenv").config()
const userModel = require("../module/user/User")
// const banModel=require("../model/Ban")
const axios = require("axios")


const checkTokken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization?.split(" ")
        if (authHeader?.length !== 2) {
            return next()
        } else if (authHeader[1].length === 0) {
            return res.status(401).send({ message: "لطفا وارد شوید یا ثبت کنید" })
            // return res.redirect("/page/login")
        }
        const idTokken = jwt.verify(authHeader[1], process.env.JWT_SECURITY)
        const user = await userModel.findById(idTokken.id, "-password")
        // const HasBan= await banModel.findOne({user:user._id})
        // if(HasBan){
        //     return res.status(403).send({message:"متاسفیم شما توسط مدیر بن شده اید"})
        // }
        req.body.user = user
        next()
    } catch (err) {
        res.status(401).send({ message: "توکن منقضی شده یا دارای مشکلی است." })
    }
}


module.exports = checkTokken
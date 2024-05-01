const basketModel = require("./Basket")
const purchaseModel = require("./purchase")
const ZarinpalCheckout = require('zarinpal-checkout');
const zarinpal = ZarinpalCheckout.create('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', true);
const productModel = require("../product/Product")
const url = require("url")





exports.getBasket = async (req, res) => {
    try {
        const { user } = req.body
        const userBasket = await basketModel.find({ $and: [{ userID: user._id }, { status: "waiting" }] }).select("-__v").populate("productID", "title href cover price").populate("userID", "name email role")
        if (userBasket.length === 0) {
            return res.status(404).send({ message: "سبد خرید شما خالی است." })
        }
        res.status(200).send({ Basket: userBasket })
    } catch (error) {
        console.error(error)
    }
}




exports.Add = async (req, res) => {
    try {
        const { user, productID, number } = req.body
        if (typeof (number) !== "number" || number <= 0) {
            return res.status(400).send({ message: "لطفا تعداد را بالای صفر و با تایپ عدد وارد کنید." })
        } else if (!productID || productID.length === 0) {
            return res.status(400).send({ message: "آیدی محصول را وارد کنید." })
        }
        const HasProduct = await basketModel.findOne({ $and: [{ productID }, { userID: user }, { status: "waiting" }] })
        if (HasProduct?.number === 15) {
            return res.status(400).send({ message: "بیشتر از 15 عدد نمی توانید انتخاب کنید." })
        } else if (HasProduct) {
            await basketModel.findOneAndUpdate({ $and: [{ productID }, { userID: user }, { status: "waiting" }] }, { $inc: { number: 1 } })
            return res.send({ message: "به تعداد یک واحد اضافه شد." })
        }
        const resCreate = await basketModel.create({ userID: user._id, productID, number })
        res.status(201).send({ message: "با موفقیت به سبد خرید اضافه شد." })
    } catch (error) {
        console.error(error)
    }
}




exports.Increase = async (req, res) => {
    try {
        const { id } = req.params
        const findBasket = await basketModel.findById(id)
        if (!findBasket) {
            return res.status(404).send({ message: "محصولی یافت نشد" })
        } else if (findBasket.number === 15) {
            return res.status(400).send({ message: "بیشتر از 15 عدد نمی توانید انتخاب کنید." })
        }
        const updateBasket = await basketModel.findByIdAndUpdate(id, { $inc: { number: 1 } }, { new: true }).select("-__v").populate("productID", "title href cover price").populate("userID", "name email role")
        res.send({ update: updateBasket })
    } catch (error) {
        console.error(error)
    }
}





exports.Decrease = async (req, res) => {
    try {
        const { id } = req.params
        const findBasket = await basketModel.findById(id)
        if (!findBasket) {
            return res.status(404).send({ message: "محصولی یافت نشد" })
        } else if (findBasket.number === 1) {
            return res.status(400).send({ message: "کمتر از 1 عدد نمی توانید انتخاب کنید." })
        }
        const updateBasket = await basketModel.findByIdAndUpdate(id, { $inc: { number: -1 } }, { new: true }).select("-__v").populate("productID", "title href cover price").populate("userID", "name email role")
        res.send({ update: updateBasket })
    } catch (error) {
        console.error(error)
    }
}






exports.Delete = async (req, res) => {
    try {
        const { id } = req.params
        const findBasket = await basketModel.findByIdAndDelete(id)
        if (!findBasket) {
            return res.status(404).send({ message: "محصولی یافت نشد" })
        }

        res.send({ message: "با موفقیت حذف شد." })
    } catch (error) {
        console.error(error)
    }
}








exports.getAll = async (req, res) => {
    try {
        const findAllBasket = await basketModel.find({}, "-__v").populate("productID", "title href cover price").populate("userID", "name email role").lean().sort({ _id: -1 })
        if (findAllBasket.length === 0) {
            return res.status(404).send({ message: "سبد خریدی موجود نیست" })
        }
        res.send(findAllBasket)
    } catch (error) {
        console.error(error)
    }
}






exports.finlizeBasket = async (req, res) => {
    try {
        const { user } = req.body
        const findBasket = await basketModel.find({ $and: [{ userID: user._id }, { status: "waiting" }] }, "-__v").populate("productID", "title href cover price remaining").lean()
        if (findBasket.length === 0) {
            return res.status(404).send({ message: "سبد خرید شما خالی است." })
        }
        let TotalPrice = 0
        findBasket.forEach(basket => {
            if (basket.productID.remaining < basket.number) {
                return res.status(400).send({ message: "این مقدار در انبار موجود نیست." })
            }
            TotalPrice += basket.number * basket.productID.price
        })
        const paymentRequest = {
            Amount: TotalPrice,
            CallbackURL: `${process.env.URL}/coffee/basket/payVerification`,
            Description: 'A Payment from Node.JS',
            Email: user.email,
            Mobile: user.phone,
        };
        const createPay = await zarinpal.PaymentRequest(paymentRequest)
        if (createPay.status === 100) {
            const order = []
            const basketID = []
            findBasket.forEach(basket => {
                basketID.push(basket._id)
                order.push({ [basket.productID._id]: basket.number })
            })
            await purchaseModel.create({ TotalPrice, createPay, order, basketID, creator: user._id })
            res.redirect(createPay.url)
        } else {
            throw new Error(createPay)
        }
    } catch (err) {
        return res.status(400).send(err.message || { message: "خطایی روی داده است" })
    }
}

exports.payVerification = async (req, res) => {
    try {
        const paramsurl = url.parse(req.url).query.split("&")
        const Authority = paramsurl[0].split("=")[1]
        const findOrder = await purchaseModel.findOne({ "createPay.authority": Authority })
        if (!findOrder) {
            return res.status(403).send({ message: "تراکنش با خطا مواجه شده است" })
        }
        const payVerifi = await zarinpal.PaymentVerification({
            Amount: findOrder.TotalPrice, // In Tomans
            Authority: findOrder.createPay.authority,
        })
        if (payVerifi.status !== 100) {
            await purchaseModel.deleteOne({ _id: findOrder._id })
            findOrder.order.forEach(async (orde) => {
                try {
                    await productModel.findByIdAndUpdate(Object.keys(orde), { $inc: { remaining: +(Object.values(orde)) }, updatedAt: new Date() })
                } catch (err) {
                    console.error(err)
                }
            })
            findOrder.basketID.forEach(async (basket) => {
                try {
                    await basketModel.findByIdAndUpdate(basket._id, { status: "waiting", updatedAt: new Date() })
                } catch (err) {
                    console.error(err)
                }
            })
            return res.status(400).send({ message: "مشکلی در پرداخت وجود دارد در صورت کسر وجه مبلغ پرداختی تا 72 ساعت به حساب بر میگردد" })
        }

        findOrder.order.forEach(async (orde) => {
            try {
                await productModel.findByIdAndUpdate(Object.keys(orde), { $inc: { remaining: -(Object.values(orde)) }, updatedAt: new Date() })
            } catch (err) {
                console.error(err)
            }
        })
        findOrder.basketID.forEach(async (basket) => {
            try {
                await basketModel.findByIdAndUpdate(basket, { status: "paid", updatedAt: new Date() })
            } catch (err) {
                console.error(err)
            }
        })

        res.status(201).send({
            RefID: payVerifi.RefID,
            id: findOrder._id
        })

    } catch (err) {
        return res.status(400 || err.status).send(err.message || { message: "خطایی روی داده است" })
    }
}

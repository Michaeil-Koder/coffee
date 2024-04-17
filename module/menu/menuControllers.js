const menuModel = require("./Menu")


exports.GetAll = async (req, res) => {
    try {
        const menuParse = JSON.stringify(menuModel)
        res.send(menuParse)
    } catch (error) {
        res.status(400).send(error.message)
    }
}
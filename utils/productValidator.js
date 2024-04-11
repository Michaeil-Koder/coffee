const { body, param } = require("express-validator")

const validatorBody = () => {
    return [
        body("title")
            .notEmpty()
            .withMessage("is title not empty")
            .isLength({ min: 4, max: 20 })
            .withMessage("is title length range of 4 to 20")
            .isString()
            .withMessage("is title type is string"),
        body("href")
            .notEmpty()
            .withMessage("is href not empty")
            .isLength({ min: 4, max: 50 })
            .withMessage("is href length range of 4 to 50")
            .isString()
            .withMessage("is href type is string"),
        body("rate")
            .optional()
            .isLength({ min: 1, max: 5 })
            .withMessage("is rate length range of 1 to 5")
            .isNumeric()
            .withMessage("is rate type is number"),
        body("price")
            .notEmpty()
            .withMessage("is price not empty")
            .isLength({ min: 1, max: 10 })
            .withMessage("is price range of 1 to 10")
            .isNumeric()
            .withMessage("is price type is number"),
        body("description")
            .notEmpty()
            .withMessage("is description not empty")
            .isLength({ min: 5, max: 1_000_000_000 })
            .withMessage("is description range of 5 to 1_000_000_000")
            .isString()
            .withMessage("is description type is String"),
        body("remaining")
            .notEmpty()
            .withMessage("is remaining not empty")
            .isLength({ min: 1, max: 30 })
            .withMessage("is remaining range of 1 to 30")
            .isNumeric()
            .withMessage("is remaining type is Number"),
        body("category")
            .notEmpty()
            .withMessage("is category not empty")
            .isLength({ min: 1, max: 5 })
            .withMessage("is category range of 1 to 5")
            .isArray()
            .withMessage("is category type is Arr"),
        body("tag")
            .notEmpty()
            .withMessage("is tag not empty")
            .isLength({ min: 1, max: 5 })
            .withMessage("is tag range of 1 to 5")
            .isArray()
            .withMessage("is tag type is Arr"),
        body("information")
            .notEmpty()
            .withMessage("is information not empty")
            .isLength({ min: 1, max: 5 })
            .withMessage("is information range of 1 to 5")
            .isObject()
            .withMessage("is information type is Arr"),
    ]
}

const validatorID = () => {
    return [
        param("id")
            .isMongoId()
            .withMessage("This Id Has a Mongo db")
    ]
}

module.exports = { validatorBody, validatorID }
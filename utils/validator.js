const {body} = require('express-validator');

module.exports = {
 user: [
     body('username')
     .isLength({min: 5}),
     body('password')
     .isLength({min: 6})
 ],
 tutorial: [
     body('title')
     .isLength({min: 5})
 ]
}
const model = require('../model');

module.exports = {
    get: {
        home(req, res) {
            res.render('home/home.hbs', {
                isLoggedIn: req.user !== undefined,
                username: req.user ? req.user.username : ''
            });
            }
        }
    };
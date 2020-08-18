const model = require('../model');

module.exports = {
    get: {
        home(req, res) {
            const isLoggedIn = req.user !== null;
            res.render('home/home.hbs', {
                isLoggedIn,
                username: req.user ? req.user.username : '',
                isNotLoggedIn: !isLoggedIn
            });
            }
        }
    };
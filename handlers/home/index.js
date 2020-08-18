const Model = require('../model/Model');

module.exports = {
    get: {
        home(req, res) {
            Model.find().lean().then((courses) => {
                const isLoggedIn = req.user !== undefined;
                res.render('home/home.hbs', {
                    isLoggedIn,
                    username: req.user ? req.user.username : '',
                    isNotLoggedIn: !isLoggedIn,
                    courses
                });

            })
            
        }
    }
};
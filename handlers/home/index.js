const Model = require('../model/Model');

module.exports = {
    get: {
        home(req, res) {
            const isLoggedIn = req.user !== undefined;

           const limit = isLoggedIn ? 0 : 3;
           const criteria = isLoggedIn ? {createdAt: '-1'} : {title: '-1'}



            Model.find({isPublic : true})
            .limit(limit)
            .sort(criteria)
            .lean()
            .then((c) => {
                

                const courses = c.reduce((acc, curr)=> {
                    acc.push({...curr, isLoggedIn})
                    return acc;
                }, []);

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
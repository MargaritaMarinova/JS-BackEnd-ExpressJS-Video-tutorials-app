const User = require('../users/User');
const {validationResult} = require('express-validator');
const Model = require('./Model');

module.exports = {
    get: {
        createCourse(req, res) {
            const isLoggedIn = (req.user !== undefined);
            res.render('courses/create-course.hbs', {
                isLoggedIn,
                username: req.user ? req.user.username : ''
            });
        },

        detailsCourse(req, res) {
            const {courseId} = req.params;
            Model
            .findById(courseId)
            .populate('enrolledUsers')
            .lean()
            .then(course => {
                const hbsOptions = Object.keys(course).reduce((acc, curr) => {
                    acc[curr] = course[curr];
                    return acc;
                }, {})
                const isLoggedIn = (req.user !== undefined);

                res.render('courses/details-course', {
                    ...hbsOptions,
                    isLoggedIn,
                    username: req.user ? req.user.username : '',
                    isTheCreator: JSON.stringify(req.user._id) === JSON.stringify(course.creator)
                });
            })
        } 
    },
    post: {
        createCourse(req, res){
            const {title, description, imageUrl, isPublic: isChecked} = req.body;
            const isPublic = isChecked === 'on' ? true : false;
            const createdAt = (new Date() + "").slice(0, 24);
            const creator = req.user._id
            Model.create({title, description, imageUrl, isPublic, createdAt, creator})
            .then(createdCourse => {
                
                res.status(201).redirect('/home/')
            })
        }
    }
}
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

        editCourse(req, res) {
            const { courseId } = req.params;
            const userId = req.user._id;
            Model
                .findById(courseId).lean().then((course) => {
                    const isLoggedIn = (req.user !== undefined);
                    res.render("courses/edit-course.hbs", {
                        isLoggedIn,
                        username: req.user ? req.user.username : null,
                        course,
                        courseId
                    });
                })

        // editCourse(req, res) {
        //     const {courseId} = req.params;
        //     const {title, description, imageUrl, isPublic} = req.body
        //     const isLoggedIn = (req.user !== undefined);
        //     oldInput = {
        //         title : req.body.title,
        //         imageUrl: req.body.imageUrl, 
        //         description: req.body.description}
        //     Model
        //     .findById(courseId)
        //     .then((course) => {
        //         res.render('courses/edit-course', {course})
        //     })
        // },
        // editCourse(req, res) {
        //     const {courseId} = req.params;
        //     Model
        //     .findById(courseId)
        //     .populate('enrolledUsers')
        //     .lean()
        //     .then((course) => {
        //         const hbsOptions = Object.keys(course).reduce((acc, curr) => {
        //             acc[curr] = course[curr];
        //             return acc;
        //         }, {})
        //         const isLoggedIn = (req.user !== undefined);
        //         const currentUser = JSON.stringify(req.user._id)
        //         const imAlreadyInTheCourse = JSON.stringify(course.enrolledUsers).includes(currentUser);
        //         res.render('courses/edit-course', {
        //             ...hbsOptions,
        //             isLoggedIn,
        //             imAlreadyInTheCourse,
        //             username: req.user ? req.user.username : '',
        //             isTheCreator: JSON.stringify(req.user._id) === JSON.stringify(course.creator)
        //         });
        //     })
        },

        detailsCourse(req, res) {
            const {courseId} = req.params;
            Model
            .findById(courseId)
            .populate('enrolledUsers')
            .lean()
            .then((course) => {
                const hbsOptions = Object.keys(course).reduce((acc, curr) => {
                    acc[curr] = course[curr];
                    return acc;
                }, {})
                const isLoggedIn = (req.user !== undefined);
                const currentUser = JSON.stringify(req.user._id)
                const imAlreadyInTheCourse = JSON.stringify(course.enrolledUsers).includes(currentUser);
                res.render('courses/details-course', {
                    ...hbsOptions,
                    isLoggedIn,
                    imAlreadyInTheCourse,
                    username: req.user ? req.user.username : '',
                    isTheCreator: JSON.stringify(req.user._id) === JSON.stringify(course.creator)
                });
            })
        },
        
        enrollForCourse(req, res) {
            const {courseId} = req.params;
            const {_id} = req.user;
            console.log(courseId)
            
            Promise.all([
            Model.updateOne({_id: courseId}, {$push: {enrolledUsers: _id}}),
            User.updateOne({_id}, {$push: {enrolledCourses: courseId}})
        ]).then (([updatedModel, updatedUser])=>{
            res.redirect(`/courses/details-course/${courseId}`)
        }).catch((err)=> {
            console.log(err.message)
        })
    },

        deleteCourse(req, res) {
            const {courseId} = req.params;
            const userId = req.user._id

            Promise.all([
            Model.deleteOne({_id: courseId}, {$pull: {enrolledUsers: userId}}),
            User.updateOne({_id: userId}, {$pull: {enrolledCourses: courseId}})
        ]).then(([updatedModel, updatedUser])=>{
            res.redirect('/home/')
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
                console.log(createdCourse)
                
                res.status(201).redirect('/home/')
            })
        },
        editCourse(req, res) {
            const {courseId} = req.params;
            const { title, description, imageUrl, isPublic: public } = req.body;        // isPublic: "on" || undefined
            isPublic = !!public;
            Model.findByIdAndUpdate({ _id: courseId }, {
                "title": title,
                "description": description,
                "imageUrl": imageUrl,
                "isPublic": isPublic
            }).then((err, updated) => {
                if (err) console.log("Update error:    ", err)
                const isLoggedIn = (req.user !== undefined);
                res.redirect(`/courses/details-course/${courseId}`)
                
            
            })
        }

        // editCourse(req, res){
        //     const {courseId} = req.params;
        //     const { title, description, imageUrl, isPublic} = req.body
            
        //     Model
        //     .findByIdAndUpdate({_id: courseId}, {title, description, imageUrl, isPublic})
        //         .then((course) => {
        //         console.log(course)
        //         res.redirect(`/courses/details-course/${courseId}`)
                
        //     })
        // }
    }
}
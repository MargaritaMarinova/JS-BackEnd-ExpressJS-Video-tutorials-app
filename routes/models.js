const router = require('express').Router();
const handler = require('../handlers/model');
const isAuth = require('../utils/isAuth');
const validations = require('../utils/validator');

router.get('/create-course', isAuth(), handler.get.createCourse);
router.get('/details-course/:courseId', isAuth(), handler.get.detailsCourse);

router.post('/create-course', isAuth(), handler.post.createCourse)
module.exports = router;
const express = require('express');
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  requestEnrollment,
  acceptEnrollment,
  declineEnrollment,
  getCoursesByOwner,
  getCoursesByStudent
  
} = require('../controllers/courses');
const { stripToken, verifyToken } = require('../middleware'); 

router.use(express.json());

router.post('/', createCourse);
router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);
router.get('/owner/:id', stripToken, verifyToken, getCoursesByOwner);
router.get('/student/:id', stripToken, verifyToken, getCoursesByStudent);

router.post('/:id/enroll', stripToken, verifyToken, requestEnrollment);
router.post('/:id/enrollments/:studentId/accept', stripToken, verifyToken, acceptEnrollment);
router.post('/:id/enrollments/:studentId/decline', stripToken, verifyToken, declineEnrollment);

module.exports = router;
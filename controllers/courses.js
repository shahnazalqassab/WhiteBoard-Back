const { Course } = require('../Models');
const { User } = require('../Models');

const getUserId = (req, res) => {
  if (res.locals?.payload?._id) return res.locals.payload._id;
  if (req.user?._id) return req.user._id;
  return null;
};

const createCourse = async (req, res) => {
  
  try {
    const { name, owner, description } = req.body;
    if (!name || !owner) return res.status(400).json({ message: 'Please provide course name and owner.' });

    const ownerExists = await User.exists({ _id: owner });
    if (!ownerExists) return res.status(400).json({ message: 'Owner user does not exist' });

    const courseData = { name, owner, description };
    console.log('Creating course with data:', courseData);

    const savedCourse = await Course.create(courseData);
    const populatedCourse = await Course.findById(savedCourse._id).populate('owner');

    res.status(201).json(populatedCourse);
  } catch (error) {
    if (error.name === 'ValidationError') return res.status(400).json({ message: error.message });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



const getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find({})
      .populate('owner', 'name email')
      .populate('students', 'name email')
      .populate('pendingEnrollments', 'name email');
    res.status(200).json(allCourses);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('students', 'name email')
      .populate('pendingEnrollments', 'name email');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.status(200).json(course);
  } catch (error) {
    if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid course ID format' });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { name, description, owner } = req.body;
    const courseId = req.params.id;

    if (owner) {
      const ownerExists = await User.exists({ _id: owner });
      if (!ownerExists) return res.status(400).json({ message: 'Owner user does not exist' });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (owner) updateData.owner = owner;
    if (description) updateData.description = description;

    const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
      runValidators: true,
    }).populate('owner');

    if (!updatedCourse) return res.status(404).json({ message: 'Course not found' });

    res.status(200).json(updatedCourse);
  } catch (error) {
    if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid course ID format' });
    if (error.name === 'ValidationError') return res.status(400).json({ message: error.message });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) return res.status(404).json({ message: 'Course not found' });
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid course ID format' });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const requestEnrollment = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const userId = getUserId(req, res);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    if (course.students.includes(userId) || course.pendingEnrollments.includes(userId)) {
      return res.status(400).json({ message: 'Already enrolled or pending' });
    }

    course.pendingEnrollments.push(userId);
    await course.save();
    res.status(200).json({ message: 'Enrollment request sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const acceptEnrollment = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const userId = getUserId(req, res);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    if (course.owner.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const studentId = req.params.studentId;
    const idx = course.pendingEnrollments.findIndex(id => id.toString() === studentId);
    if (idx === -1) return res.status(400).json({ message: 'No such pending request' });

    course.pendingEnrollments.splice(idx, 1);
    course.students.push(studentId);
    await course.save();
    res.status(200).json({ message: 'Enrollment accepted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const declineEnrollment = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const userId = getUserId(req, res);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    if (course.owner.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const studentId = req.params.studentId;
    const idx = course.pendingEnrollments.findIndex(id => id.toString() === studentId);
    if (idx === -1) return res.status(400).json({ message: 'No such pending request' });

    course.pendingEnrollments.splice(idx, 1);
    await course.save();
    res.status(200).json({ message: 'Enrollment declined' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  requestEnrollment,
  acceptEnrollment,
  declineEnrollment,
};

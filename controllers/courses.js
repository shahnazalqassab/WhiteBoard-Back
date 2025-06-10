const { Course } = require('../Models');
const { User } = require('../Models');

const createCourse = async (req, res) => {
  try {
    const { name, owner } = req.body;

    if (!name || !owner) {
      return res.status(400).json({ message: 'Please provide course name and owner.' });
    }

    const ownerExists = await User.exists({ _id: owner });
    if (!ownerExists) {
      return res.status(400).json({ message: 'Owner user does not exist' });
    }

    const courseData = {
      name,
      owner,
      lessons: []
    };

    const savedCourse = await Course.create(courseData);
    const populatedCourse = await Course.findById(savedCourse._id).populate('owner');

    res.status(201).json(populatedCourse);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find({}).populate('owner', 'name email');
    return res.status(200).json(allCourses);
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('owner');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid course ID format' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { name, lessons, owner } = req.body;
    const courseId = req.params.id;

    if (owner) {
      const ownerExists = await User.exists({ _id: owner });
      if (!ownerExists) {
        return res.status(400).json({ message: 'Owner user does not exist' });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (owner) updateData.owner = owner;
    if (lessons) updateData.lessons = lessons;

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      updateData,
      { new: true, runValidators: true }
    ).populate('owner');

    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json(updatedCourse);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid course ID format' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid course ID format' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse
};

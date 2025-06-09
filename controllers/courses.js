const { Course } = require('../Models');
const { User } = require('../Models');


const createCourse = async (req, res) => {
  try {
    const { name, lessons, owner } = req.body;

      if (!name || !Array.isArray(lessons) || lessons.length === 0 || !owner) {
      return res.status(401).json({ message: 'Please provide course name, at least one lesson, and owner.' })
    }

    for (const lesson of lessons) {
      if (!lesson.title || !lesson.material) {
        return res.status(400).json({ message: 'Each lesson must have a title and material.' })
      }
      if (lesson.assignment) {
        const { title, material } = lesson.assignment
        if (!title || !material) {
          return res.status(400).json({ message: 'Each assignment must have a title and material.' })
        }
      }
    }

    const courseData = {
      name,
      lessons: {
        title: lessons.title,
        material: lessons.material,
        assignment: { title, material, document }
      },
      owner
    };

    const savedCourse = await Course.create(courseData);

    res.status(201).json(savedCourse);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find({}, 'name owner').populate('owner', 'name');

    return res.status(200).json(allCourses);
    
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('owner').orFail();

    res.status(200).json(course);

  } catch (error) {
    if (error.name === 'DocumentNotFoundError') {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { name, lessons, ownerId } = req.body;

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.name = name;
    course.lessons.title = lessons.title;
    course.lessons.material = lessons.material;
    course.lessons.assignment.title = lessons.assignment.title;
    course.lessons.assignment.material = lessons.assignment.material;
    course.lessons.assignment.document = lessons.assignment.document;
    course.owner = ownerId;

    const updatedCourse = await course.save();

    res.status(200).json(updatedCourse.populate('owner'));

  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid course ID format' });
    }

    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Course deleted successfully' });

  } catch (error) {
    if (error.kind === 'ObjectId') {
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

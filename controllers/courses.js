const Course = require('./courseModel');

async function createCourse(req, res) {
  try {
    const { name, lessons, owner } = req.body;

    if (!name || !lessons || !lessons.title || !lessons.material || !lessons.assignment || !lessons.assignment.title || !lessons.assignment.material || !lessons.assignment.document) {
      return res.status(400).json({ message: 'Please provide all required course and lesson details.' });
    }

    const newCourse = new Course({
      name,
      lessons: {
        title: lessons.title,
        material: lessons.material,
        assignment: {
          title: lessons.assignment.title,
          material: lessons.assignment.material,
          document: lessons.assignment.document
        }
      },
      owner 
    });

    const course = await newCourse.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

async function getAllCourses(req, res) {
  try {
    const courses = await Course.find().populate('owner'); 
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

async function getCourseById(req, res) {
  try {
    const course = await Course.findById(req.params.id).populate('owner');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid course ID format' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

async function updateCourse(req, res) {
  try {
    const { name, lessons, owner } = req.body;
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      {
        name,
        lessons: {
          title: lessons.title,
          material: lessons.material,
          assignment: {
            title: lessons.assignment.title,
            material: lessons.assignment.material,
            document: lessons.assignment.document
          },
        },
        owner,
      },
      { new: true, runValidators: true }
    ).populate('owner');

    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(updatedCourse);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid course ID format' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

async function deleteCourse(req, res) {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json({ message: 'Course deleted successfully', course: deletedCourse });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid course ID format' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse
};

const Project = require('../models/Project');
const slugify = require('slugify');

// @desc    Get all public projects
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ isPublic: true }).sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all projects (admin)
// @route   GET /api/projects/admin
// @access  Private/Admin
const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single project by slug
// @route   GET /api/projects/:slug
// @access  Public
const getProjectBySlug = async (req, res) => {
    try {
        const project = await Project.findOne({ slug: req.params.slug });
        if (project) {
            res.json(project);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res) => {
    const { title, description, features, tech, images, demoUrl, repoUrl, isPublic } = req.body;

    try {
        const slug = slugify(title, { lower: true, strict: true });
        const projectExists = await Project.findOne({ slug });
        if (projectExists) {
            return res.status(400).json({ message: 'Project with this title already exists' });
        }

        const project = await Project.create({
            title,
            slug,
            description,
            features,
            tech,
            images,
            demoUrl,
            repoUrl,
            isPublic
        });

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (project) {
            project.title = req.body.title || project.title;
            if (req.body.title) {
                project.slug = slugify(req.body.title, { lower: true, strict: true });
            }
            project.description = req.body.description || project.description;
            project.features = req.body.features || project.features;
            project.tech = req.body.tech || project.tech;
            project.images = req.body.images || project.images;
            project.demoUrl = req.body.demoUrl || project.demoUrl;
            project.repoUrl = req.body.repoUrl || project.repoUrl;
            project.isPublic = req.body.isPublic !== undefined ? req.body.isPublic : project.isPublic;

            const updatedProject = await project.save();
            res.json(updatedProject);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (project) {
            await project.deleteOne();
            res.json({ message: 'Project removed' });
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProjects,
    getAllProjects,
    getProjectBySlug,
    createProject,
    updateProject,
    deleteProject
};

const express = require('express');
const router = express.Router();
const Artifact = require('../model/Artifact');

router.get('/:id', async (req, res) => {
    try {
        const artifact = await Artifact.findOne({ id: req.params.id });
        if (!artifact) {
            return res.status(404).json({
                message: 'Artifact not found'
            })
        }
        res.status(200).json(artifact);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching artifact: ' + err.message });
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const artifact = await Artifact.findByIdAndDelete(req.params.id);
        if (!artifact) {
            return res.status(404).json({
                message: 'Artifact not found'
            })
        }
        res.status(200).json({ message: 'Artifact deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting artifact: ' + err.message });
    }
})

router.get('/search/:query', async (req, res) => {
    try {
        const query = req.params.query.toLowerCase();
        const artifacts = await Artifact.find();

        const results = artifacts.filter(item => {
            const titleMatch = item.title?.toLowerCase().includes(query);
            const tagMatch = item.tags?.some(tag => tag.toLowerCase().includes(query));
            return titleMatch || tagMatch;
        });

        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ message: 'Error searching artifacts: ' + err.message });
    }
});

router.patch('/:id/like', async (req, res) => {
  try {
    const { userId } = req.body;
    const artifact = await Artifact.findById(req.params.id);

    if (!artifact) {
      return res.status(404).json({ message: 'Artifact not found' });
    }

    const alreadyLiked = artifact.like.some(likeUser => likeUser.toString() === userId);

    if (!alreadyLiked) {
      artifact.like.push(userId);
      await artifact.save();
    }

    res.status(200).json(artifact);
  } catch (err) {
    res.status(500).json({ message: 'Error updating like: ' + err.message });
  }
});

router.patch('/:id/unlike', async (req, res) => {
  try {
    const { userId } = req.body;
    const artifact = await Artifact.findById(req.params.id);

    if (!artifact) {
      return res.status(404).json({ message: 'Artifact not found' });
    }

    artifact.like = artifact.like.filter(uid => uid.toString() !== userId);
    await artifact.save();

    res.status(200).json(artifact);
  } catch (err) {
    res.status(500).json({ message: 'Error removing like: ' + err.message });
  }
});

router.get('/', async (req, res) => {
    try {
        const artifacts = await Artifact.find();
        res.status(200).json(artifacts);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching artifacts: ' + err.message });
    }
})

router.post('/', async (req, res) => {
    const { _id, title, desc, img, contentType, like, tags } = req.body;

    if (!_id || !title || !desc || !img || !contentType) {
        return res.status(400).json({
            message: 'Invalid input. All fields are required and cannot be empty.'
        })
    }

    try {
        const artifact = new Artifact({
            _id,
            title,
            desc,
            img,
            contentType,
            like,
            tags
        });
        await artifact.save();
        res.status(201).json(artifact);
    } catch (err) {
        res.status(500).json({ message: 'Error creating artifact: ' + err.message });
    }
})

module.exports = router;
const express = require('express');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const postRoutes = require('./post.route');
const commentRoutes = require('./comment.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET v1/docs
 */
router.use('/docs', express.static('docs'));

router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);
router.use('/users', userRoutes);
router.use('/auth', authRoutes);

module.exports = router;

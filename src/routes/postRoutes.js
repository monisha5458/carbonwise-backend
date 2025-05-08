import express from 'express';
import multer from 'multer';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  getAllPosts, getPostsByUser, getPostById,
  createPost, updatePost, deletePost,
  likePost, addComment
} from '../controllers/postController.js';

const router = express.Router();
import upload from '../middleware/uploadMiddleware.js'

router.get('/',              getAllPosts);
router.get('/user/:userId',  getPostsByUser);
router.get('/:postId',       getPostById);
router.post('/upload',
  authMiddleware,
  upload.single('image'),
  createPost
);
router.put('/:postId',    authMiddleware, updatePost);
router.delete('/:postId', authMiddleware, deletePost);
router.post('/:postId/like',    authMiddleware, likePost);
router.post('/:postId/comment', authMiddleware, addComment);

export default router;

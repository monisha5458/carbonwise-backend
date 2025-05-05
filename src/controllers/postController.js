import Post from '../models/Post.js';
import { fetchUserById } from '../services/userService.js';

export async function getAllPosts(req, res, next) {
  try { res.json(await Post.find()); }
  catch (e) { next(e); }
}

export async function getPostsByUser(req, res, next) {
  try { res.json(await Post.find({ userId: req.params.userId })); }
  catch (e) { next(e); }
}

export async function getPostById(req, res, next) {
  try {
    const p = await Post.findById(req.params.postId);
    if (!p) return res.status(404).end();
    res.json(p);
  } catch (e) { next(e); }
}

export async function createPost(req, res, next) {
  try {
    // Ensure the user creating the post is the authenticated user
    if (req.user.id !== req.body.userId) {
      return res.status(403).json({ message: 'You are not authorized to create posts for this user.' });
    }

    // Fetch user to confirm existence
    const u = await fetchUserById(req.body.userId, req.headers.authorization);
    
    console.log(u);

    // Create a new post
    const p = new Post({
      userId: u._id,
      userName: u.name,
      postTitle: req.body.postTitle,
      postCaption: req.body.postCaption,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined
    });

    // Save the post and send response
    res.json(await p.save());
  } catch (e) {
    next(e); // Handle errors
  }
}


export async function updatePost(req, res, next) {
  try {
    const p = await Post.findByIdAndUpdate(req.params.postId, {
      postTitle:   req.body.postTitle,
      postCaption: req.body.postCaption,
      imageUrl:    req.body.imageUrl
    }, { new: true });
    res.json(p);
  } catch (e) { next(e); }
}

export async function deletePost(req, res, next) {
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(204).end();
  } catch (e) { next(e); }
}

export async function likePost(req, res, next) {
  try {
    const p = await Post.findById(req.params.postId);
    p.likes++;
    res.json(await p.save());
  } catch (e) { next(e); }
}

export async function addComment(req, res, next) {
  try {
    const p = await Post.findById(req.params.postId);
    p.comments.push(req.body.comment);
    res.json(await p.save());
  } catch (e) { next(e); }
}



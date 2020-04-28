"use strict";

// const OffensiveValidator = require("../middlewares/offensiveValidator");
const PostService = require("../services/post");

class PostController {
    constructor() { }

    async getPosts(req, res, next) {
        try {
            const post = await PostService.getPosts();
            res.status(200).send(post);
            // res.json(post);
        } catch (err) {
            res.status(404).send(err.message); //Con err.message nos muestra sólo el mensaje de error y no el error completo
        } finally {
            next();//En este ejemplo en concreto no necesitaríamos el finally ni el next()
        }
    }

    async getPostById(req, res, next) {
        try {
            const postId = req.params.postId;
            const post = await PostService.getPostById(postId);
            if (post !== null) {
                res.status(200).send(post);
                // res.json(post);
            } else {
                res.status(404).send({ message: "No hay ningún post con ese ID" });
            }
        } catch (err) {
            res.status(404).send(err.message);
        } finally {
            next();
        }
    }

    async deletePost(req, res, next) {
        try {
            // console.log("ctrl req", req.user._id);
            const postId = req.params.postId;
            const role = req.user.role;
            const authorId = req.user._id;
            // console.log(postId);
            const post = await PostService.getPostById(postId);
            // console.log("post", post);
            if (role === "admin" || authorId.equals(post.authorId)) {
                const postDeleted = await PostService.deletePost(postId);
                res.status(200).send(postDeleted);
                // console.log("ctrl post", post.authorId);
            } else {
                res.status(401).send({ message: "No tienes permiso para eliminar este post" });
            }
        } catch (err) {
            res.status(404).send(err.message);

        } finally {
            next();
        }
    }

    async savePost(req, res, next) {
        try {
            // console.log("ctrl author", req.user._id);
            const post = req.body;
            const authorId = req.user._id;
            // console.log("post ctrl", post);
            const newPost = await PostService.savePost(post, authorId);
            // console.log("ctrl authorId", authorId);
            if (typeof newPost.author != 'string' || typeof newPost.nickname != 'string' || typeof newPost.title != 'string' || typeof newPost.content != 'string') {
                res.status(400).send({ message: "El post debe tener los campos author, nickname, title y content" });
            } else {
                res.status(200).send(newPost);
            }
        } catch (err) {
            res.status(404).send(err.message);
        } finally {
            next();
        }
    }

    async updatePost(req, res, next) {
        // console.log("req ctrl", req.user._id);
        // console.log(req.user.role);
        try {
            const postId = req.params.postId;
            const newPost = req.body;
            const role = req.user.role;
            const authorId = req.user._id;
            const post = await PostService.getPostById(postId);
            // console.log("update", newPost, req.params);
            // console.log("ctrl post", post);
            if (typeof newPost.author != 'string' || typeof newPost.nickname != 'string' || typeof newPost.title != 'string' || typeof newPost.content != 'string') {
                res.status(400).send({ message: "El post debe tener los campos author, nickname, title y content" });
            }
            if (role === "admin" || authorId.equals(post.authorId)) {
                const postUpdated = await PostService.updatePost(postId, newPost);
                res.status(200).send(postUpdated);
            }
            else {
                res.status(401).send({ message: "No tienes permiso para modificar el post" });
            }
        } catch (err) {
            res.status(404).send(err.message);
        } finally {
            next();
        }
    }

    async addComment(req, res, next) {
        try {
            const postId = req.params.postId;
            const comment = req.body;
            const updatePost = await PostService.addComment(postId, comment);
            res.status(200).send(updatePost);
        } catch (err) {
            res.status(404).send(err.message);
        } finally {
            next();
        }
    }
}

module.exports = new PostController();
const express = require('express');
const router = express.Router();
const { 
    addChapter, 
    deleteChapter,
    getAllChapters, 
    updateChapter, 
    getOneChapter } = require('../controllers/chapter');

    router.get('/books/:bookId/', getAllChapters);
    router.get('/books/:bookId/:id', getOneChapter);
    router.delete('/books/:bookId/delete/:id', deleteChapter);
    router.patch('/books/:bookId/update/:id', updateChapter);
    router.post('/books/:bookId/add', addChapter);
     

module.exports = router;
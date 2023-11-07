import { Router } from 'express'
import noteController from '../controllers/noteController'
import middlewares from '../middlewares'
import { body, query } from 'express-validator'

const router = Router()
router.post('/add-note', [middlewares.handleRateLimit, middlewares.verifyAccessToken], 
    body().custom((value, { req }) => {
        const { title, content } = req.body;
        console.log(title, content, req.files)
        if (!title && !content && !req.files) {
            throw new Error("At least one input field is required.");
        }
        return true;
    }), noteController.addNote)



router.put('/edit-note', [middlewares.handleRateLimit, middlewares.verifyAccessToken], 
    query("id").trim().notEmpty(), 
    body().custom((value, { req }) => {
        const { title, content } = req.body;
        if (!title && !content && req.files) {
            throw new Error("At least one input field is required.");
        }
        return true;
    }), noteController.editNote)



router.delete('/delete-note', 
    [middlewares.handleRateLimit, middlewares.verifyAccessToken], 
    query("id").trim().notEmpty(), 
    noteController.deleteNote)



router.get('/get-note-details', 
    [middlewares.handleRateLimit, middlewares.verifyAccessToken], 
    query("id").trim().notEmpty(), 
    noteController.getNoteDetails)



router.get('/get-notes', 
    [middlewares.handleRateLimit, middlewares.verifyAccessToken], 
    noteController.getNotes)



router.get('/search-notes', 
    [middlewares.handleRateLimit, middlewares.verifyAccessToken], 
    query("key").trim().notEmpty(), 
    noteController.searchNotes)



export default router
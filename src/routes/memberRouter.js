import { Router } from "express";
import memberController from '../controllers/memberController'
import middlewares from '../middlewares'
import { body, query } from "express-validator";
import { MEMBER_ROLE } from "../utils/constant";
const router = Router()
router.post('/add-member', [middlewares.handleRateLimit, middlewares.verifyAccessToken], 
    query("noteId").trim().notEmpty(), 
    body("email").trim().isEmail().normalizeEmail(), 
    body("role").custom((value, { req }) => {
        if (!MEMBER_ROLE.includes(value)) {
            throw new Error("Invalid role.");
        }
        return true;
    }),
    memberController.addMember)



router.put('/edit-member', [middlewares.handleRateLimit, middlewares.verifyAccessToken], 
    query(["noteId, memberId"]).trim().notEmpty(),
    body("role").custom((value, { req }) => {
        if (!MEMBER_ROLE.includes(value)) {
            throw new Error("Invalid role.");
        }
        return true;
    }),
    memberController.editMember)



router.delete('/delete-member', [middlewares.handleRateLimit, middlewares.verifyAccessToken], 
    query(["noteId", "memberId"]).trim().notEmpty(),
    memberController.deleteMember)



router.get('/get-members', [middlewares.handleRateLimit, middlewares.verifyAccessToken], 
    query("noteId").trim().notEmpty(),
    query("pageIndex").toInt().isInt({min: 0}),
    query("limit").toInt().isInt({min: 1}),
    memberController.getMembers)



router.get('/get-member-details', [middlewares.handleRateLimit, middlewares.verifyAccessToken], 
    query(["noteId", "memberId"]).trim().notEmpty(),
    memberController.getMemberDetails)



router.put('/update-pin', [middlewares.handleRateLimit, middlewares.verifyAccessToken], 
    query("noteId").trim().notEmpty(),
    memberController.updatePin)

export default router
import { Router } from "express";
import { loginUser, logout, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.js"
import {ApiError} from "../utils/ApiError.js"
const router=Router();

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser);

    router.route("/login").post(loginUser);
    router.route("/logout").post(verifyJWT,logout);
    router.route("/refresh-token").post(refreshAccessToken);

export default router;
import { Router} from "express";
import {UserAuthController} from "@/handlers/controllers/user";

const router = Router();

router.post("/collect",UserAuthController.default.Collect)
router.get("/fetch/:username",UserAuthController.default.Fetch)
router.patch("/update/:id",UserAuthController.default.Update)
router.delete("/delete/:id",UserAuthController.default.Delete)





export default  router
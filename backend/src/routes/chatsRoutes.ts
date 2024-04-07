import chatsController from "../controllers/chatsController";
import { Router } from "express";

const chatsRouter = Router();

chatsRouter.get("/all", chatsController.getAllChats);

chatsRouter.get("/one/:id", chatsController.getOneChat);

chatsRouter.get("/:id", chatsController.getChatsOfUser);

chatsRouter.get("/", chatsController.getChat);

chatsRouter.post("/new", chatsController.postChat);

// chatsRouter.patch("/:id", chatsController.patchWorkout);

chatsRouter.delete("/:id", chatsController.deleteChat);

export default chatsRouter;

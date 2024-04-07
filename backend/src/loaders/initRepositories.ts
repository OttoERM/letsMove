import mongoose from "mongoose";

import calendarsRepository from "../repositories/calendarsRepository";
import calendarsController from "../controllers/calendarsController";

import workoutsRepository from "../repositories/workoutsRepository";
import workoutsController from "../controllers/workoutsController";

import usersRepository from "../repositories/usersRepository";
import usersController from "../controllers/usersController";

import chatsRepository from "../repositories/chatsRepository";
import chatsController from "../controllers/chatsController";

export default (dbInstance: mongoose.Connection) => {
  const calendar = new calendarsRepository(dbInstance);
  const users = new usersRepository(dbInstance, calendar);
  const workout = new workoutsRepository(dbInstance);
  const chats = new chatsRepository(dbInstance, users);

  calendarsController.init(calendar);
  usersController.init(users);
  workoutsController.init(workout);
  chatsController.init(chats);
};

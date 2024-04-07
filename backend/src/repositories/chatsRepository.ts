import chatsInterface from "../db/interfaces/chatsInterface";
import chatsSchema from "../db/schemas/chatSchema";
import mongoose from "mongoose";
import { options } from "../controllers/queryManager";
import usersRepository from "./usersRepository";
import usersInterface from "../db/interfaces/usersInterface";

class chatsRepository {
  private chatModel: mongoose.Model<chatsInterface>;
  private userInjector: usersRepository;

  constructor(dbInstance: mongoose.Connection, userInstance: usersRepository) {
    this.chatModel = dbInstance.model<chatsInterface>("chats", chatsSchema);
    this.userInjector = userInstance;
  }

  public async findAllChats(filter?: object, options?: options) {
    return await this.chatModel
      .find({ ...filter }, {}, { ...options })
      .catch((e) => new Error(e.message));
  }

  public async findAllChatOfUser(id: string) {
    let user = await this.userInjector.findUser(id);

    if (!user || user instanceof Error) return user;

    let userChats = await this.chatModel
      .distinct("receiver", { emisor: (user as usersInterface).username })
      .catch((e) => new Error(e.message));

    if (!userChats || userChats instanceof Error) return userChats;

    let result = await this.userInjector
      .findAllUsers({ username: { $in: [...userChats] } })
      .catch((e) => new Error(e.message));

    return result;
  }

  public async findOneChat(id: string, options?: options) {
    return await this.chatModel
      .findOne({ _id: id }, {}, { ...options })
      .catch((e) => new Error(e.message));
  }

  public async findChat(filter: { involved: object }, options?: options) {
    return await this.chatModel
      .find(
        { emisor: filter.involved, receiver: filter.involved },
        {},
        { ...options }
      )
      .sort({ createdAt: 1 })
      .catch((e) => new Error(e.message));
  }

  public async insertMessage(
    chatData: chatsInterface
  ): Promise<string | Error> {
    const chat = new this.chatModel({ ...chatData });
    const result = await chat.save().catch((e) => new Error(e.message));

    if (result instanceof Error) return result;

    return result.id;
  }

  public async deleteChat(id: string): Promise<Error | number | null> {
    const result = await this.chatModel
      .deleteOne({ _id: id })
      .catch((e) => new Error(e.message));

    if (result instanceof Error) return result;

    if (result.acknowledged) return result.deletedCount;

    return null;
  }
}

export default chatsRepository;

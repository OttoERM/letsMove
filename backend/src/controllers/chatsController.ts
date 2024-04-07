import { Request, Response } from "express";
import chatsRepository from "../repositories/chatsRepository";
import { paginationOptions, queryManager } from "./queryManager";

enum filterParams {
  emisor = "emisor",
  receiver = "receiver",
  involved = "involved",
}

let chats: chatsRepository;
const chatsController = {
  init: function (chatsInstance: chatsRepository) {
    chats = chatsInstance;
  },

  getAllChats: async (req: Request, res: Response) => {
    let qM = new queryManager(
      req.query,
      [],
      [paginationOptions.limit, paginationOptions.skip]
    );

    const result = await chats.findAllChats(qM.getFilter(), qM.getOptions());

    if (result instanceof Error)
      return res.status(500).json({
        status: {
          success: false,
          message: result.message,
        },
      });

    return res.status(200).json({
      status: {
        success: true,
        message: "Request completed succesfully",
      },
      data: result,
    });
  },

  getChatsOfUser: async (req: Request, res: Response) => {
    if (req.params.id.length != 24)
      return res.status(401).json({
        status: {
          success: false,
          message: "Invalid user id",
        },
      });

    let result = await chats.findAllChatOfUser(req.params.id);

    if (!result)
      return res.status(404).json({
        status: {
          success: false,
          message: "User id was not found",
        },
      });

    if (result instanceof Error)
      return res.status(500).json({
        status: {
          success: false,
          message: result.message,
        },
      });

    return res.status(200).json({
      status: {
        success: true,
        message: "Request completed succesfully",
      },
      data: result,
    });
  },

  getOneChat: async (req: Request, res: Response) => {
    if (!req.params.id)
      return res.status(400).json({
        status: {
          success: false,
          message: "Missing id parameter",
        },
      });

    let qM = new queryManager(
      req.query,
      [],
      [paginationOptions.limit, paginationOptions.skip]
    );

    const result = await chats.findOneChat(req.params.id, qM.getOptions());

    if (result instanceof Error)
      return res.status(500).json({
        status: {
          success: false,
          message: result.message,
        },
      });

    return res.status(200).json({
      status: {
        success: true,
        message: "Request completed succesfully",
      },
      data: result,
    });
  },

  getChat: async (req: Request, res: Response) => {
    if (!req.query.involved)
      return res.status(400).json({
        status: {
          success: false,
          message: "Missing involved query parameter",
        },
      });

    let qM = new queryManager(
      req.query,
      [filterParams.involved],
      [paginationOptions.limit, paginationOptions.skip]
    );

    const result = await chats.findChat(
      qM.getFilter() as { involved: object },
      qM.getOptions()
    );

    if (result instanceof Error)
      return res.status(500).json({
        status: {
          success: false,
          message: result.message,
        },
      });

    return res.status(200).json({
      status: {
        success: true,
        message: "Request completed succesfully",
      },
      data: result,
    });
  },

  postChat: async (req: Request, res: Response) => {
    let result = await chats.insertMessage(req.body);

    if (result instanceof Error)
      return res.status(500).json({
        status: {
          success: false,
          message: result.message,
        },
      });

    return res.status(201).json({
      status: {
        success: true,
        message: "Inserted chat succesfully",
      },
      resource: `chats/${result}`,
    });
  },

  deleteChat: async (req: Request, res: Response) => {
    if (req.params.id.length != 24)
      return res.status(401).json({
        status: {
          success: false,
          message: "Invalid chat id",
        },
      });

    let result = await chats.deleteChat(req.params.id);

    if (!result)
      return res.status(404).json({
        status: {
          success: false,
          message: "Chat id wasn't found",
        },
      });

    if (result instanceof Error)
      return res.status(500).json({
        status: {
          success: false,
          message: result.message,
        },
      });

    return res.status(201).json({
      status: {
        success: true,
        message: "Deleted chat succesfully",
      },
      deletedCount: result,
    });
  },

  //   patchCalendar: async (req: Request, res: Response) => {
  //     if (req.params.id.length != 24)
  //       return res.status(401).json({
  //         status: {
  //           success: false,
  //           message: "Invalid calendar id",
  //         },
  //       });

  //     let result = await chats.updateCalendar(req.params.id, req.body);

  //     if (!result)
  //       return res.status(404).json({
  //         status: {
  //           success: false,
  //           message: "Calendar id was not found",
  //         },
  //       });

  //     if (result instanceof Error)
  //       return res.status(500).json({
  //         status: {
  //           success: false,
  //           message: result.message,
  //         },
  //       });

  //     return res.status(200).json({
  //       status: {
  //         success: true,
  //         message: "Updated workout succesfully",
  //       },
  //       updatedFields: result,
  //     });
  //   },
};

export default chatsController;

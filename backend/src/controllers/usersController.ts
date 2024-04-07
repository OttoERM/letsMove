import { Request, Response } from "express";
import usersRepository from "../repositories/usersRepository";
import { paginationOptions, queryManager } from "./queryManager";
import bcrypt from "bcrypt";
import serverConf from "../configs/serverConf";
import jwt from "jsonwebtoken";

enum filterParams {
  username = "username",
  role = "role",
}

let users: usersRepository;
const usersController = {
  init: function (usersInstance: usersRepository) {
    users = usersInstance;
  },

  getAllUsers: async (req: Request, res: Response) => {
    let qM = new queryManager(
      req.query,
      [],
      [paginationOptions.limit, paginationOptions.skip]
    );

    const result = await users.findAllUsers(qM.getFilter(), qM.getOptions());

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

  getUser: async (req: Request, res: Response) => {
    if (req.params.id.length != 24)
      return res.status(401).json({
        status: {
          success: false,
          message: "Invalid user id",
        },
      });

    let result = await users.findUser(req.params.id);

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

  getUserWorkouts: async (req: Request, res: Response) => {
    if (req.params.id.length != 24)
      return res.status(401).json({
        status: {
          success: false,
          message: "Invalid user id",
        },
      });

    let result = await users.findUserWorkouts(req.params.id);

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

  getTrainerWorkouts: async (req: Request, res: Response) => {
    if (req.params.id.length != 24)
      return res.status(401).json({
        status: {
          success: false,
          message: "Invalid user id",
        },
      });

    let result = await users.findTrainerWorkouts(req.params.id);

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

  postUser: async (req: Request, res: Response) => {
    if (!req.body.username || !req.body.password || !req.body.role)
      return res.status(400).json({
        status: {
          success: false,
          message: "Missing payload fields",
        },
      });

    req.body.password = await bcrypt.hash(req.body.password, 10);
    let result = await users.insertUser(req.body);

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
        message: "Inserted user succesfully",
      },
      resource: `users/${result}`,
    });
  },

  postLogin: async (req: Request, res: Response) => {
    console.log(req.body);

    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({
        status: {
          success: false,
          message: "Missing payload fields",
        },
      });

    let result = await users.findAllUsers({ username: username });
    if (result instanceof Error)
      return res.status(500).json({
        status: {
          success: false,
          message: result.message,
        },
      });

    if (result.length == 0)
      return res.status(404).json({
        status: {
          success: false,
          message: "User wasn't found",
        },
      });

    let passwordMatch: boolean;
    try {
      passwordMatch = await bcrypt.compare(password, result[0].password);
    } catch (err) {
      return res.status(500).json({
        status: {
          success: false,
          message: err,
        },
      });
    }

    if (!passwordMatch)
      return res.status(403).json({
        status: {
          success: false,
          message: "Unauthorized",
        },
      });

    const accessToken = jwt.sign(
      {
        UserMetadata: {
          _id: result[0]._id,
          username: result[0].username,
          role: result[0].role,
        },
      },
      serverConf.token,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      status: {
        success: true,
        message: "Login succesfully",
      },
      token: accessToken,
      role: result[0].role,
      id: result[0]._id,
    });
  },

  patchUser: async (req: Request, res: Response) => {
    if (req.params.id.length != 24)
      return res.status(401).json({
        status: {
          success: false,
          message: "Invalid user id",
        },
      });

    let result = await users.updateUser(req.params.id, req.body);

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
        message: "Updated user succesfully",
      },
      updatedFields: result,
    });
  },

  deleteUser: async (req: Request, res: Response) => {
    if (req.params.id.length != 24)
      return res.status(401).json({
        status: {
          success: false,
          message: "Invalid user id",
        },
      });

    let result = await users.deleteUser(req.params.id);

    if (!result)
      return res.status(404).json({
        status: {
          success: false,
          message: "User id wasn't found",
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
        message: "Deleted user succesfully",
      },
      deletedCount: result,
    });
  },
};

export default usersController;

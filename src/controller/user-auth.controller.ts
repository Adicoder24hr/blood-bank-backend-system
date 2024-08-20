import type { Request, Response } from "express";
import user from "../module/user";
import { createToken } from "../lib";

export const userSignup = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    if (!body.username || !body.password || !body.bloodGroup || !body.email) {
      return res.status(404).send("Invalid data");
    }
    if (typeof body.username !== "string") {
      return res.status(404).send("Invalid username");
    }
    if (typeof body.password !== "string") {
      return res.status(404).send("Invalid password");
    }
    if (typeof body.bloodGroup !== "string") {
      return res.status(404).send("Invalid blood group");
    }
    if (typeof body.email !== "string") {
      return res.status(404).send("Invalid email");
    }

    const registered_user = await user.findOne({ email: body.email });

    if (registered_user) {
      return res.status(403).json({
        status: 403,
        message: "User already registered",
      });
    }

    let userdata = { ...body };
    await user.create(userdata);

    res.cookie(
      "token",
      createToken({ username: body.username, email: body.email }),
      {
        // path: "/user",
        httpOnly: true,
        encode: btoa,
        expires: new Date(new Date().setDate(new Date().getDate() + 30)),
      }
    );
    return res.status(200).json({
      status: "200",
      message: "User created successfully",
      data: userdata,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: "500",
      message: "Internal Server Error",
    });
  }
};

export const userLogin = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    if (!body.username || !body.password || !body.bloodGroup || !body.email) {
      return res.status(404).send("Invalid data");
    }
    if (typeof body.username !== "string") {
      return res.status(404).send("Invalid username");
    }
    if (typeof body.password !== "string") {
      return res.status(404).send("Invalid password");
    }
    if (typeof body.bloodGroup !== "string") {
      return res.status(404).send("Invalid blood group");
    }
    if (typeof body.email !== "string") {
      return res.status(404).send("Invalid email");
    }

    const user_data = await user.findOne({ email: body.email });

    if (!user_data) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    const isValidPassword = await user_data.isValidPassword(body.password);
    if (!isValidPassword) {
      return res.status(401).json({
        status: "401",
        message: "Invalid password",
      });
    }

    res.cookie(
      "token",
      createToken({ username: user_data.username, email: user_data.email }),
      {
        // path: "/user",
        httpOnly: true,
        encode: btoa,
        expires: new Date(new Date().setDate(new Date().getDate() + 30)),
      }
    );

    return res.status(200).json({
      status: "200",
      message: "User logged in successfully",
      data: user_data.toJSON(),
    });
  } catch (e) {
    return res.status(500).json({
      status: "500",
      message: "Internal server error",
    });
  }
};

export const userLogout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", { path: "/user" });
    return res.status(200).json({
      status: "200",
      message: "User logged out successfully",
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

export const refresh_token = async (req: Request, res: Response) => {
  try {
    res.cookie(
      "token",
      createToken({
        username: (req.user as any).username as any,
        email: (req.user as any).email as any,
      }),
      {
        httpOnly: true,
        // path: "/user",
        encode: btoa,
        expires: new Date(new Date().setDate(new Date().getDate() + 30)),
      }
    );

    return res.status(200).json({
      status: "200",
      message: "Token refreshed successfully",
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

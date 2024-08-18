import type { Request, Response } from "express";
import superadmin from "../module/superadmin";
import { createToken } from "../lib";
import admin from "../module/admin";
import user from "../module/user";

export const superAdminSignup = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    if (!body.name || !body.password || !body.email) {
      return res.status(404).send("Invalid data");
    }
    if (typeof body.name !== "string") {
      return res.status(404).send("Invalid name");
    }
    if (typeof body.password !== "string") {
      return res.status(404).send("Invalid password");
    }
    if (typeof body.email !== "string") {
      return res.status(404).send("Invalid email");
    }

    const registered_superAdmin = await superadmin.findOne({
      email: body.email,
    });

    if (registered_superAdmin) {
      return res.status(404).json({
        status: 404,
        message: "superAdmin already registered!",
      });
    }

    let superAdminData = { ...body };

    await superadmin.create(superAdminData);

    res.cookie(
      "token",
      createToken({ username: body.name, email: body.email }),
      {
        httpOnly: true,
        encode: btoa,
        expires: new Date(new Date().setDate(new Date().getDate() + 30)),
      }
    );

    return res.status(200).json({
      status: "200",
      message: "superAdmin created successfully",
      data: superAdminData,
    });
  } catch (e) {
    console.log(e);

    return res.status(500).json({
      status: "500",
      message: "Internal Server Error",
    });
  }
};

export const superAdminLogin = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    if (!body.username || !body.password || !body.email) {
      return res.status(404).send("Invalid Credentials");
    }
    if (typeof body.username !== "string") {
      return res.status(404).send("Invalid name");
    }
    if (typeof body.password !== "string") {
      return res.status(404).send("Invalid password");
    }
    if (typeof body.email !== "string") {
      return res.status(404).send("Invalid email");
    }

    const superAdmin_data = await superadmin.findOne({ email: body.email });

    if (!superAdmin_data) {
      return res.status(404).json({
        status: "404",
        message: "Super Admin not found",
      });
    }

    const isValidPassword = await superAdmin_data.isValidPassword(
      body.password
    );

    if (!isValidPassword) {
      return res.status(401).json({
        status: "401",
        message: "Invalid password",
      });
    }

    res.cookie(
      "token",
      createToken({
        username: superAdmin_data.username,
        email: superAdmin_data.email,
      }),
      {
        // path: "/superadmin",
        httpOnly: true,
        encode: btoa,
        expires: new Date(new Date().setDate(new Date().getDate() + 30)),
      }
    );

    return res.status(200).json({
      status: "200",
      message: "Super Admin logged in successfully",
      data: superAdmin_data.toJSON(),
    });
  } catch (e) {
    return res.status(500).json({
      status: "500",
      message: "Internal server error",
    });
  }
};

export const superAdminLogout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", { path: "/superadmin" });
    return res.status(200).json({
      status: "200",
      message: "Super Admin logged out successfully",
    });
  } catch (e) {
    return res.status(500).json({
      status: "500",
      message: "Internal server error",
    });
  }
};

export const refreshtoken = async (req: Request, res: Response) => {
  try {
    res.cookie(
      "token",
      createToken({
        username: (req.user as any).username as any,
        email: (req.user as any).email as any,
      }),
      {
        // path: "/superadmin",
        httpOnly: true,
        encode: btoa,
        expires: new Date(new Date().setDate(new Date().getDate() + 30)),
      }
    );

    return res.status(200).json({
      status: "200",
      message: "Super Admin token refreshed successfully",
    });
  } catch (e) {
    return res.status(500).json({
      status: "500",
      message: "Internal server error",
    });
  }
};

export const S_dashboard = async (req: Request, res: Response) => {
  try {
    const admins = await admin.find({ select: { id: true } });
    const users = await user.find({ select: { id: true } }); //DONE

    return res.status(200).json({
      status: 200,
      data: {
        AdminCount: admins.length,
        userCount: users.length,
      },
    });
  } catch (e) {
    return res.status(500).json({
      status: "500",
      message: "Internal server error",
    });
  }
};

export const updateSuperAdmin = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    if (!body.name || !body.password || !body.email) {
      return res.status(404).send("Invalid Credentials");
    }
    if (typeof body.name !== "string") {
      return res.status(404).send("Invalid name");
    }
    if (typeof body.password !== "string") {
      return res.status(404).send("Invalid password");
    }
    if (typeof body.email !== "string") {
      return res.status(404).send("Invalid email");
    }

    const updatedSuperAdmin = superadmin.updateOne({ email: body.email }, body);

    if (!updatedSuperAdmin) {
      return res.status(500).json({
        status: "500",
        message: "SuperAdmin not updated!",
      });
    }

    return res.status(200).json({
      status: "200",
      message: "SuperAdmin updated successfully",
      data: updatedSuperAdmin,
    });
  } catch (e) {
    return res.status(500).json({
      status: "500",
      message: "Internal server error",
    });
  }
};

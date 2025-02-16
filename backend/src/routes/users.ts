import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";

import User from "../models/user";
import { verifyToken } from "../middleware/auth";

const router = Router();

// GET /api/users/me
router.get("/me", verifyToken, async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not Found!",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
});

// POST /api/users/register
router.post(
  "/register",
  [
    check("email", "Email is required.").isString(),
    check("firstName", "First Name is required.").isString(),
    check("lastName", "Last Name is required.").isString(),
    check(
      "password",
      "Password with 6 or more characters are required."
    ).isLength({
      min: 6,
    }),
    check("isAdmin", "Role is required"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array(),
      });
    }
    try {
      let user = await User.findOne({
        email: req.body.email,
      });

      if (user) {
        return res.status(400).json({
          message: "User already esists.",
        });
      }

      user = new User(req.body);
      await user.save();

      const token = jwt.sign(
        { userId: user.id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "1d",
        }
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });

      return res.status(200).send({
        message: "User registered successfully.",
      });
    } catch (error) {
      console.log({
        error,
      });
      res.status(500).send({
        message: "Something went wrong!",
      });
    }
  }
);

export default router;

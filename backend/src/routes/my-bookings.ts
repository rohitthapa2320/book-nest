import { Request, Response, Router } from "express";
import { verifyToken } from "../middleware/auth";
import Hotel from "../models/hotel";

const router = Router();

router.get("/", verifyToken, async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const hotels = await Hotel.find({ "bookings.userId": userId });

    if (!hotels.length) {
      return res.status(500).json({
        message: "No bookings found",
      });
    }

    return res.status(200).json(hotels);
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
});

export default router;

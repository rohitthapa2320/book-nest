import { Request, Response, Router } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel, { HotelType } from "../models/hotel";
import { verifyToken } from "../middleware/auth";
import { body } from "express-validator";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5MB
  },
});

async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    const b64 = Buffer.from(image.buffer).toString("base64");

    let dataURI = "data:" + image.mimetype + ";base64," + b64;
    const res = await cloudinary.v2.uploader.upload(dataURI);
    return res.url;
  });

  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}

// GET /api/my-hotels

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId });
    return res.status(200).json(hotels);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching hotels",
    });
  }
});

// POST /api/my-hotels
router.post(
  "/",
  verifyToken,
  [
    body("name").notEmpty().withMessage("Name is required."),
    body("city").notEmpty().withMessage("City is required."),
    body("country").notEmpty().withMessage("Country is required."),
    body("description").notEmpty().withMessage("Description is required."),
    body("type").notEmpty().withMessage("Hotel Type is required."),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("Price Per Night is required and must be a number."),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("Facilities are required."),
  ],
  upload.array("imageFiles", 3),
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[];
      const newHotel: HotelType = req.body;

      const imageUrls = await uploadImages(imageFiles);

      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId;

      const hotel = new Hotel(newHotel);
      await hotel.save();

      return res.status(201).json({
        message: "Hotel created successfully",
        hotel,
      });
    } catch (error) {
      console.log("Error creating hotel:", error);
      return res.status(500).json({
        message: "Something went wrong!",
      });
    }
  }
);

// GET /api/my-hotels/:id

router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  const id = req.params.id.toString();
  try {
    const hotel = await Hotel.findOne({
      userId: req.userId,
      _id: id,
    });

    return res.status(200).json(hotel);
  } catch (error) {
    return res.status(500).json({
      message: `Error while fetching hotel details for id: ${id}`,
    });
  }
});

// PUT /api/my-hotels/:id

router.put(
  "/:id",
  verifyToken,
  upload.array("imageFiles"),
  async (req: Request, res: Response) => {
    const id = req.params.id.toString();
    try {
      const updatedHotel: HotelType = req.body;
      updatedHotel.lastUpdated = new Date();

      const hotel = await Hotel.findOneAndUpdate(
        {
          _id: id,
          userId: req.userId,
        },
        updatedHotel,
        { new: true }
      );

      if (!hotel) {
        return res.status(404).json({
          message: "Hotel Not found.",
        });
      }

      const files = req.files as Express.Multer.File[];

      const updatedImageUrls = await uploadImages(files);

      hotel.imageUrls = [
        ...updatedImageUrls,
        ...(updatedHotel.imageUrls || []),
      ];

      await hotel.save();

      return res.status(200).json(hotel);
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong!!",
      });
    }
  }
);

export default router;

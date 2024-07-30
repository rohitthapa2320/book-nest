import { Request, Response, Router } from "express";
import Hotel from "../models/hotel";
import {
  BookingType,
  HotelSearchResponse,
  PaymentIntentResponse,
} from "../types/types";
import Stripe from "stripe";
import { verifyToken } from "../middleware/auth";

const stripe = new Stripe(process.env.STRIPE_API_KEY as string);

const router = Router();

const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {};

  if (queryParams.destination) {
    constructedQuery.$or = [
      { city: new RegExp(queryParams.destination, "i") },
      { country: new RegExp(queryParams.destination, "i") },
    ];
  }

  if (queryParams.adultCount) {
    constructedQuery.adultCount = {
      $gte: parseInt(queryParams.adultCount),
    };
  }

  if (queryParams.childCount) {
    constructedQuery.childCount = {
      $gte: parseInt(queryParams.childCount),
    };
  }

  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }
  if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    };
  }

  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => parseInt(star))
      : parseInt(queryParams.stars);
    constructedQuery.rating = {
      $in: starRatings,
    };
  }

  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice).toString(),
    };
  }

  return constructedQuery;
};

// GET /api/hotels/search
router.get("/search", async (req: Request, res: Response) => {
  try {
    const query = constructSearchQuery(req.query);

    let sortOptions = {};

    switch (req.query.sortOptions) {
      case "rating":
        sortOptions = { rating: -1 };
        break;
      case "pricePerNightAsc":
        sortOptions = { pricePerNight: 1 };
        break;
      case "pricePerNightDesc":
        sortOptions = { pricePerNight: -1 };
        break;
    }

    const pageSize = 5;

    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    );

    const skip = (pageNumber - 1) * pageSize;

    const hotels = await Hotel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    const total = await Hotel.countDocuments(query);

    const response: HotelSearchResponse = {
      data: hotels,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
});

//GET /api/hotels/:id
router.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id.toString();
  try {
    const hotel = await Hotel.findOne({ _id: id });

    if (!hotel) {
      return res.status(404).json({
        message: "Hotel Not Found!",
      });
    }

    return res.status(200).json(hotel);
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
});

router.post(
  "/:id/bookings/payment-intent",
  verifyToken,
  async (req: Request, res: Response) => {
    const { numberOfNights } = req.body;
    const hotelId = req.params.id;

    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
      return res.status(500).json({
        message: "Hotel Not Found.",
      });
    }

    const totalCost = Number(hotel.pricePerNight * numberOfNights);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCost,
      currency: "gbp",
      metadata: {
        hotelId,
        userId: req.userId,
      },
    });

    if (!paymentIntent.client_secret) {
      return res.status(500).json({
        message: "Error creating payment intent",
      });
    }

    const response = {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret.toString(),
      totalCost,
    };

    return res.status(200).json(response);
  }
);

router.post(
  "/:id/bookings",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const paymentIntentId = req.body.paymentIntentId;

      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId as string
      );

      if (!paymentIntent) {
        return res.status(400).json({
          message: "Payment Intent Not Found.",
        });
      }

      if (
        paymentIntent.metadata.hotelId !== req.params.id ||
        paymentIntent.metadata.userId !== req.userId
      ) {
        return res.status(400).json({
          message: "Payment Intent Mismatch!!",
        });
      }

      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({
          message: `Payment Intent Not Succeeded. Status: ${paymentIntent.status}`,
        });
      }

      const newBooking: BookingType = {
        ...req.body,
        userId: req.userId,
      };

      const hotel = await Hotel.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          $push: { bookings: newBooking },
        }
      );

      if (!hotel) {
        return res.status(500).json({
          message: "Hotel Not Found",
        });
      }
      await hotel.save();

      return res.status(200).json(hotel);
    } catch (error) {
      console.log("error", error);
      return res.status(500).json({
        message: "Something went wrong.",
      });
    }
  }
);

export default router;

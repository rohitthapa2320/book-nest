import React from "react";

import { HotelType } from "../../../backend/src/models/hotel";
import LocationIcon from "../assets/location.png";
import BudgetIcon from "../assets/money.png";
import TypeIcon from "../assets/hotel.png";
import BedIcon from "../assets/bed.png";
import StarIcon from "../assets/star.png";
import { Link } from "react-router-dom";

const Hotel = ({
  hotel
}: React.FC<HotelType>) => {
  const { name, city, country, type, pricePerNight, adultCount, childCount, rating, _id } = hotel;
  const hotelDetailsArray = [
    {
      title: `${city}, ${country}`,
      icon: LocationIcon
    },
    {
      title: type,
      icon: TypeIcon
    },
    {
      title: `${pricePerNight} per night`,
      icon: BudgetIcon
    },
    {
      title: `${adultCount} adult, ${childCount} children`,
      icon: BedIcon
    },
    {
      title: `${rating} star rating`,
      icon: StarIcon
    },

  ]
  return (
    <div className="w-full border-2 border-neutral-300 p-4 rounded">
      <div className="flex flex-col gap-4">
        <p className="text-xl font-bold">{name}</p>
        <p className="text-sm">{city}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {
            hotelDetailsArray.map((item) => (
              <div className="border-2 border-neutral-300 p-2 rounded">
                <div className="flex w-full gap-2 items-center">
                  <img src={item.icon} />
                  <p className="text-xs font-normal">{item.title}</p>
                </div>
              </div>
            ))
          }
        </div>
        <div className="flex justify-end">
          <Link 
          to={`/edit-hotel/${_id}`}
            className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Hotel;
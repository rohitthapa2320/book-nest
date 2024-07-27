import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

import * as apiClient from "../api-client";
import { HotelType } from "../types/types";
import { AiFillStar } from "react-icons/ai";
import GuestInfoForm from "../forms/guest-info/GuestInfoForm";

const HotelDetails = () => {
  const { id } = useParams();

  const { data: hotel, isLoading } = useQuery<HotelType>(
    "fetch-hotel-details",
    () => apiClient.fetchHotelDetailsById(id || ""),
    {
      enabled: !!id,
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!hotel) {
    return <div>No Hotel Found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="flex">
          {Array.from({ length: hotel.rating }).map(() => (
            <AiFillStar className="fill-yellow-400" />
          ))}
        </span>
        <h1 className="text-3xl font-bold">{hotel.name}</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {hotel.imageUrls.slice(0, 3).map((url) => (
          <div className="h-[300px]">
            <img
              src={url}
              alt={hotel.name}
              className="rounded-md w-full h-full object-cover object-center"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        {hotel.facilities.map((facility) => (
          <div className="border border-slate-300 rounded-sm p-3">
            {facility}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        <div className="whitespace-pre-line">{hotel.description}</div>
        <div className="h-fit">
          <GuestInfoForm
            hotelId={hotel._id}
            pricePerNight={hotel.pricePerNight}
          />
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;

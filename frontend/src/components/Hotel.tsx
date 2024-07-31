import { Link, useNavigate } from "react-router-dom";
import { HotelType } from "../types/types";
import { useMutation, useQueryClient } from "react-query";
import { BiBed, BiBuilding, BiMap, BiMoney, BiStar } from "react-icons/bi";

import * as apiClient from "../api-client";
import { useAppContext } from "../context/AppContext";

const Hotel = ({ hotel }: { hotel: HotelType }) => {
  const {
    name,
    city,
    country,
    type,
    pricePerNight,
    adultCount,
    childCount,
    rating,
    _id,
  } = hotel;
  const hotelDetailsArray = [
    {
      title: `${city}, ${country}`,
      icon: <BiMap size={16} />,
    },
    {
      title: type,
      icon: <BiBuilding size={16} />,
    },
    {
      title: `${pricePerNight} per night`,
      icon: <BiMoney size={16} />,
    },
    {
      title: `${adultCount} adult, ${childCount} children`,
      icon: <BiBed size={16} />,
    },
    {
      title: `${rating} star rating`,
      icon: <BiStar size={16} />,
    },
  ];

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  const { mutate } = useMutation(apiClient.deleteMyHotel, {
    onSuccess: async () => {
      showToast({
        message: "Hotel Deleted!!",
        type: "SUCCESS",
      });
      await queryClient.invalidateQueries("fetchMyHotels");
      navigate("/my-hotels");
    },
    onError: () => {
      showToast({
        message: "Hotel Not Deleted!!",
        type: "ERROR",
      });
    },
  });

  const handleDeleteHotel = (hotelId: string) => {
    alert("Are you sure you want to delete the hotel?");
    mutate(hotelId);
  };
  return (
    <div className="w-full border-2 border-neutral-300 p-4 rounded">
      <div className="flex flex-col gap-4">
        <p className="text-xl font-bold">{name}</p>
        <p className="text-sm">{city}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {hotelDetailsArray.map((item) => (
            <div className="border-2 border-neutral-300 p-2 rounded">
              <div className="flex w-full gap-2 items-center">
                {item.icon}
                <p className="text-xs font-normal">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 justify-end">
          <Link
            to={`/edit-hotel/${_id}`}
            className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500"
          >
            Edit Details
          </Link>
          <button
            className="bg-red-600 text-white p-2 font-bold hover:bg-red-500"
            onClick={() => handleDeleteHotel(hotel._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hotel;

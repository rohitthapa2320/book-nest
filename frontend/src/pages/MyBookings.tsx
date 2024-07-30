import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { HotelType } from "../types/types";
import BookingCard from "../components/BookingCard";

const MyBookings = () => {
  const { data: bookings } = useQuery<HotelType[]>(
    "fetchMyBookings",
    apiClient.fetchMyBookings
  );
  if (!bookings || !bookings.length) {
    return <div>No Bookings Found.</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Bookings</h1>
      <div className="flex flex-col">
        {bookings.map((hotel) => (
          <BookingCard hotel={hotel} />
        ))}
      </div>
    </div>
  );
};

export default MyBookings;

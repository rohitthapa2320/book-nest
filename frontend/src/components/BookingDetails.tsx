import { HotelType } from "../types/types";

const Details = ({ title, value }: { title: string; value: string }) => {
  return (
    <div className="flex flex-col">
      <p className="text-sm font-medium">{title}:</p>
      <p className="font-bold">{value}</p>
    </div>
  );
};

const BookingDetails = ({
  checkIn,
  checkOut,
  adultCount,
  childCount,
  hotel,
  numNights,
}: {
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
  hotel: HotelType;
  numNights: number;
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-slate-300 p-5">
      <span className="font-bold text-xl">Your Booking Details</span>
      <div className="flex flex-col">
        <Details
          title="Location"
          value={`${hotel.name}, ${hotel.city}, ${hotel.country}`}
        />
        <hr className="my-4" />
        <div className="grid grid-cols-2 gap-8">
          <Details title="Check-in" value={checkIn.toDateString()} />
          <Details title="Check-out" value={checkOut.toDateString()} />
        </div>
        <hr className="my-4" />
        <Details title="Total Length of Stay" value={`${numNights} nights`} />
        <hr className="my-4" />
        <Details
          title="Guests"
          value={`${adultCount} Adults & ${childCount} Children`}
        />
      </div>
    </div>
  );
};

export default BookingDetails;

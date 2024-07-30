import { BookingType, HotelType } from "../types/types";

const BookingCard = ({ hotel }: { hotel: HotelType }) => {
  return (
    <div className="grid grid-cols-[1fr_2fr] gap-6 p-8 border border-slate-300 rounded-md">
      <div className="w-full h-[350px]">
        <img
          src={hotel.imageUrls[0]}
          className="w-full h-full object-cover object-center rounded-md"
        />
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">{hotel.name}</h1>
          <p>
            {hotel.city}, {hotel.country}
          </p>
        </div>
        {hotel.bookings.length &&
          hotel.bookings.map((booking: BookingType) => (
            <div className="flex flex-col">
              <span className="flex gap-2">
                <p className="font-bold">Dates:</p>
                <p>
                  {new Date(booking.checkIn.toString()).toDateString()}-
                  {new Date(booking.checkOut.toString()).toDateString()}
                </p>
              </span>
              <span className="flex gap-2">
                <p className="font-bold">Guests:</p>
                <p>
                  {booking.adultCount} Adults, {booking.childCount} Children
                </p>
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default BookingCard;

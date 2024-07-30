import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { HotelType, UserType } from "../types/types";
import BookingForm from "../forms/booking";
import BookingDetails from "../components/BookingDetails";
import { useParams } from "react-router-dom";
import { useSearchContext } from "../context/SearchContext";
import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { useAppContext } from "../context/AppContext";

const calculateNumberOfNights = (startDate: Date, endDate: Date) => {
  return Math.ceil(
    (Number(endDate.getTime()) - Number(startDate.getTime())) /
      (24 * 1000 * 3600)
  );
};

const Booking = () => {
  const { checkIn, checkOut, adultCount, childCount } = useSearchContext();
  const { stripePromise } = useAppContext();

  const { id } = useParams();

  const [numNights, setNumNights] = useState<number>(0);

  const { data: currentUser } = useQuery<UserType>(
    "fetch-current-user",
    apiClient.fetchCurrentUser
  );

  const { data: hotel } = useQuery<HotelType>(
    "fecthHotelsById",
    () => apiClient.fetchHotelDetailsById(id as string),
    {
      enabled: !!id,
    }
  );

  const { data: paymentIntentData } = useQuery(
    "createPaymentIntent",
    () => apiClient.createPaymentIntent(id as string, numNights.toString()),
    {
      enabled: !!id && numNights > 0,
    }
  );

  useEffect(() => {
    if (checkIn && checkOut) {
      setNumNights(calculateNumberOfNights(checkIn, checkOut));
    }
  }, [checkIn, checkOut]);

  if (!hotel) {
    return <>No Hotel Found</>;
  }

  return (
    <div className="grid md:grid-cols-[1fr_2fr] gap-5">
      <BookingDetails
        checkIn={checkIn}
        checkOut={checkOut}
        adultCount={adultCount}
        childCount={childCount}
        hotel={hotel}
        numNights={numNights}
      />
      {currentUser && paymentIntentData && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret: paymentIntentData.clientSecret,
          }}
        >
          <BookingForm
            currentUser={currentUser}
            paymentIntent={paymentIntentData}
          />
        </Elements>
      )}
    </div>
  );
};

export default Booking;

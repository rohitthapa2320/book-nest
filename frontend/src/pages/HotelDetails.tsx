import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

import * as apiClient from "../api-client";
import { HotelType } from "../types/types";

const HotelDetails = () => {
  const { id } = useParams();

  const { data: hotel, isLoading } = useQuery<HotelType>(
    "fetch-hotel-details",
    () => apiClient.fetchHotelDetailsById(id || "")
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return <div>{hotel && <p>{hotel.name}</p>}</div>;
};

export default HotelDetails;

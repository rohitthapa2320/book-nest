import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";

import * as apiClient from "../api-client";
import ManageHotelForm from "../forms/ManageHotelForm";
import { HotelType } from "../types/types";
import { useAppContext } from "../context/AppContext";

const EditHotel = () => {
  const { hotelId } = useParams();
  const { showToast } = useAppContext();
  const { data: hotel } = useQuery<HotelType>(
    "fetch-my-hotel-details",
    () => apiClient.fetchMyHotelDetailsById(hotelId || ""),
    {
      enabled: !!hotelId,
      retry: false,
    }
  );

  const { mutate, isLoading } = useMutation(apiClient.updateHotelById, {
    onSuccess: () => {
      showToast({
        message: "Hotel Saved!",
        type: "SUCCESS",
      });
    },
    onError: () => {
      showToast({
        message: "Error Saving Hotel",
        type: "ERROR",
      });
    },
  });

  const handleSave = (hotelFormData: FormData) => {
    mutate(hotelFormData);
  };

  return (
    <ManageHotelForm isLoading={isLoading} onSave={handleSave} hotel={hotel} />
  );
};

export default EditHotel;

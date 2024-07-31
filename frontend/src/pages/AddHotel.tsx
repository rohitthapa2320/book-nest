import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";

import ManageHotelForm from "../forms/ManageHotelForm";
import { useAppContext } from "../context/AppContext";
import * as apiClient from "../api-client";

const AddHotel = () => {
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const { mutate, isLoading } = useMutation(apiClient.addMyHotel, {
    onSuccess: () => {
      showToast({
        message: "Hotel Saved!",
        type: "SUCCESS",
      });
      navigate("/my-hotels");
    },
    onError: () => {
      showToast({
        message: "Error Saving Hotel.",
        type: "ERROR",
      });
    },
  });

  const handleSave = (hotelFormData: FormData) => {
    mutate(hotelFormData);
  };

  return <ManageHotelForm isLoading={isLoading} onSave={handleSave} />;
};

export default AddHotel;

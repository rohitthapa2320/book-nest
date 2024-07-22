import { FormProvider, useForm } from "react-hook-form";
import HotelDetailsSection from "./HotelDetailsSection";
import HotelTypeSection from "./HotelTypeSection";
import HotelFacilitiesSection from "./HotelFacilitiesSection";
import HotelGuestsSection from "./HotelGuestsSection";
import HotelImagesSection from "./HotelImagesSection";

 

export type HotelFormData = {
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  adultCount: number;
  childCount: number;
  facilities: string[];
  pricePerNight: number;
  rating: number;
  imageFiles: FileList;
  lastUpdated: Date;
}

const ManageHotelForm = ({
  isLoading,
  onSave
}:{
  isLoading: boolean;
  onSave: (hotelFormData: FormData) => void
}) => {
  const fromMethods = useForm<HotelFormData>();
  const { handleSubmit } = fromMethods;

  const onSubmit = handleSubmit((formDataJson: HotelFormData) => {
    const formData = new FormData();
    formData.append("name", formDataJson.name);
    formData.append("city", formDataJson.city);
    formData.append("country", formDataJson.country);
    formData.append("description", formDataJson.description);
    formData.append("type", formDataJson.type);
    formData.append("pricePerNight", formDataJson.pricePerNight.toString());
    formData.append("rating", formDataJson.rating.toString());
    formData.append("adultCount", formDataJson.adultCount.toString());
    formData.append("childCount", formDataJson.childCount.toString());

    formDataJson.facilities.forEach((facility, index) => {
      formData.append(`facilities[${index}]`, facility);
    });

    Array.from(formDataJson.imageFiles).forEach((imageFile) => {
      formData.append(`imageFiles`, imageFile);
    });

    onSave(formData);

  })
  return (
    <FormProvider {...fromMethods}>
      <form className="flex flex-col gap-10" onSubmit={onSubmit}>
        <HotelDetailsSection />
        <HotelTypeSection />
        <HotelFacilitiesSection />
        <HotelGuestsSection />
        <HotelImagesSection />
        <span className="flex justify-end">
          <button 
            type="submit" 
            className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl disabled:bg-gray-500"
            disabled={isLoading}
          >
            {
              isLoading ? "Saving...": "Save"
            }
          </button>
        </span>
      </form>
    </FormProvider>

  )
}

export default ManageHotelForm;
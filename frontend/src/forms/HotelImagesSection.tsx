import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";

const HotelImagesSection = () => {
  const { register, formState: {errors}} = useFormContext<HotelFormData>();
  return(
    <div>
      <h2 className="text-2xl font-bold mb-3">Images</h2>
      <div>
        <input
         type="file"
         multiple
         accept="image/*"
         className="w-full text-gray-700 font-normal"
        {
          ...register(
            "imageFiles", {
              validate: (imageFiles) => {
                const totalLength= imageFiles.length;

                if(totalLength === 0) return "Atleast one image should be added."

                if(totalLength> 3) return "Total number of images cannot be more than 3."

                return true;

              }
            }
          )
        }
        />
      </div>
      {
        errors.imageFiles && (
          <span className="text-red-500 text-sm font-bold">{errors.imageFiles.message}</span>
        )
      }
    </div>
  )
}

export default HotelImagesSection;
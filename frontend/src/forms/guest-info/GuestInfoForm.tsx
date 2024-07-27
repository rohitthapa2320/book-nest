import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import { useSearchContext } from "../../context/SearchContext";
import { useAppContext } from "../../context/AppContext";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  hotelId: string;
  pricePerNight: number;
};

type GuestInfoFormData = {
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
};

const GuestInfoForm = ({ hotelId, pricePerNight }: Props) => {
  const search = useSearchContext();
  const { isLoggedIn } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    watch,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<GuestInfoFormData>({
    defaultValues: {
      checkIn: search.checkIn,
      checkOut: search.checkOut,
      adultCount: search.adultCount,
      childCount: search.childCount,
    },
  });

  const onSubmit = (data: GuestInfoFormData) => {
    const { checkIn, checkOut, adultCount, childCount } = data;
    search.saveSearchValues("", checkIn, checkOut, adultCount, childCount);
    navigate(`/hotel/${hotelId}/booking`);
  };

  const onSignInToBook = (data: GuestInfoFormData) => {
    const { checkIn, checkOut, adultCount, childCount } = data;
    search.saveSearchValues("", checkIn, checkOut, adultCount, childCount);
    navigate("/sign-in", { state: { from: location } });
  };

  const minDate = new Date();
  const maxDate = new Date();

  maxDate.setFullYear(maxDate.getFullYear() + 1);

  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");

  return (
    <div className="flex flex-col p-4 bg-blue-200 gap-4 rounded-md">
      <h3 className="text-md font-bold">Rs. {pricePerNight} per night</h3>
      <form
        className="grid grid-cols-1 gap-4 items-center"
        onSubmit={
          isLoggedIn ? handleSubmit(onSubmit) : handleSubmit(onSignInToBook)
        }
      >
        <div>
          <DatePicker
            selected={checkIn}
            required
            onChange={(date) => setValue("checkIn", date as Date)}
            selectsStart
            startDate={checkIn}
            endDate={checkOut}
            minDate={minDate}
            maxDate={maxDate}
            placeholderText="Check-in Date"
            className="min-w-full bg-white p-2 focus:outline-none"
            wrapperClassName="min-w-full"
          />
        </div>
        <div>
          <DatePicker
            selected={checkOut}
            required
            onChange={(date) => setValue("checkOut", date as Date)}
            selectsStart
            startDate={checkIn}
            endDate={checkOut}
            minDate={minDate}
            maxDate={maxDate}
            placeholderText="Check-out Date"
            className="min-w-full bg-white p-2 focus:outline-none"
            wrapperClassName="min-w-full"
          />
        </div>
        <div className="flex bg-white px-2 py-1 gap-2">
          <label className="flex items-center">
            Adult:
            <input
              className="w-full p-1 focus:outline-none font-bold"
              type="number"
              min={1}
              max={20}
              {...register("adultCount", {
                required: "This field is required",
                min: {
                  value: 1,
                  message: "There must be atleast one adult.",
                },
                valueAsNumber: true,
              })}
            />
          </label>
          <label className="flex items-center">
            Children:
            <input
              className="w-full p-1 focus:outline-none font-bold"
              type="number"
              min={0}
              max={20}
              {...register("childCount", {
                valueAsNumber: true,
              })}
            />
          </label>
          <div>
            {errors.adultCount && (
              <span className="text-red-500 font-semibold text-sm">
                {errors.adultCount.message}
              </span>
            )}
          </div>
        </div>
        {isLoggedIn ? (
          <button className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl">
            Book Now
          </button>
        ) : (
          <button className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl">
            Sign in to book
          </button>
        )}
      </form>
    </div>
  );
};

export default GuestInfoForm;

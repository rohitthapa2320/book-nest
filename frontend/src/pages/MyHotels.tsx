import { useQuery } from "react-query";

import * as apiClient from "../api-client";
import Hotel from "../components/Hotel";
import { Link } from "react-router-dom";

const MyHotels = () => {
  
  const {data: myHotels, isLoading} = useQuery("my-hotels", apiClient.fetchAllMyHotels, {
    retry: false
  });

  return(
    <div className="space-y-5">
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-3xl font-bold">My Hotels</h1>
        <Link to="/add-hotel"
          className="flex items-center cursor-pointer text-white p-2 font-bold bg-blue-700 hover:bg-blue-600"
        >
          Add Hotel
        </Link>
      </div>
      {
        isLoading ? (
          <div>Loading...</div>
        ):(
          <div className="flex flex-col gap-5 w-full">
            {
              myHotels && myHotels.length && myHotels.map((hotel) => (
                <Hotel hotel={hotel} key={hotel.name} />
              ))
            }
          </div>
        )
      }
    </div>
  )
}

export default MyHotels;
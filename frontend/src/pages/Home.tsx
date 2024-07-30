import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { HotelType } from "../types/types";
import LatestHotelCard from "../components/LatestHotelCard";

const Home = () => {
  const { data: hotels } = useQuery<HotelType[]>(
    "fetchHotels",
    apiClient.fetchHotels
  );

  const topRowHotels = hotels?.slice(0, 2) || [];
  const bottomRowHotels = hotels?.slice(2) || [];
  return (
    <div className="space-y-3">
      <h2 className="text-3xl font-bold">Latest Destinations</h2>
      <p>Most Recent Destinations Added By Our Hosts</p>
      <div className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topRowHotels.map((hotel) => (
            <LatestHotelCard hotel={hotel} />
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {bottomRowHotels.map((hotel) => (
            <LatestHotelCard hotel={hotel} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

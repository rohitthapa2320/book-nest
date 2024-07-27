import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { UserType } from "../types/types";

const Booking = () => {
  const { data: currentUser } = useQuery<UserType>(
    "fetch-current-user",
    apiClient.fetchCurrentUser
  );
  return (
    <div className="grid md:grid-cols-[1fr_2fr]">
      <p>{currentUser?.email}</p>
    </div>
  );
};

export default Booking;

import { useMutation, useQueryClient } from "react-query";

import * as apiClient from "../api-client";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const SignOutButton = () => {
  const { showToast } = useAppContext();

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const mutation = useMutation(apiClient.signOut, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("validateToken");
      showToast({
        message: "Logged Out",
        type: "SUCCESS",
      });
      navigate("/");
    },
    onError: (error: Error) => {
      showToast({
        message: error.message,
        type: "ERROR",
      });
    },
  });

  const handleClick = () => {
    mutation.mutate();
  };
  return (
    <button
      className="text-blue-600 px-3 font-bold bg-white hover:bg-gray-100"
      onClick={handleClick}
    >
      Sign Out
    </button>
  );
};

export default SignOutButton;

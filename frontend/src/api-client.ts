import { RegisterFormData } from "./pages/Register";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: "POST",
    headers:{
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(formData)
  });

  const responseBody= await response.json();

  if(!response.ok){
    throw new Error(responseBody.message);
  }
};

export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    credentials: "include"
  });

  if(!response.ok){
    throw new Error("Token Invalid")
  }

  return response.json();
}
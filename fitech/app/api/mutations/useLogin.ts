import { useMutation } from "@tanstack/react-query";
import { api } from "../api";
import { LoginRequest, LoginResponse } from "@/app/types/user";

export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: async (request): Promise<LoginResponse> =>
      api.post("/auth/login", request)
  });
};

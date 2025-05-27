import { useMutation } from "@tanstack/react-query";
import { api } from "../api";
import { CreateUserRequest, LoginResponse } from "@/app/types/user";

export const useCreateUser = () => {
  return useMutation<LoginResponse, Error, CreateUserRequest>({
    mutationFn: async (request): Promise<LoginResponse> =>
      api.post("/user", request)
  });
};

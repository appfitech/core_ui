import { useMutation } from "@tanstack/react-query";
import { api } from "../api";
import { LoginResponse, User } from "@/app/types/user";

export const useUpdateUser = () => {
  return useMutation<LoginResponse, Error, User>({
    mutationFn: async (request): Promise<LoginResponse> =>
      api.put(`/profile/${request?.id}`, request?.person)
  });
};

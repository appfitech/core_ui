import { useMutation } from "@tanstack/react-query";
import { api } from "../api";
import { LoginResponse, User } from "@/app/types/user";
import { useUserStore } from "@/app/stores/user";

export const useUploadPhoto = () => {
  const userId = useUserStore((s) => s?.user?.user?.id);

  return useMutation<LoginResponse, Error, FormData>({
    mutationFn: async (formData): Promise<LoginResponse> =>
      api.post(`/profile/${userId}/photos`, formData, true)
  });
};

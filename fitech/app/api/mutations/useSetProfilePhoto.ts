import { useMutation } from "@tanstack/react-query";
import { api } from "../api";
import { LoginResponse, User } from "@/app/types/user";
import { SetProfilePhotoRequest } from "@/app/types/photos";
import { useUserStore } from "@/app/stores/user";

export const useSetProfilePhoto = () => {
  const userId = useUserStore((s) => s?.user?.user?.id);

  return useMutation<LoginResponse, Error, SetProfilePhotoRequest>({
    mutationFn: async (request): Promise<LoginResponse> =>
      api.put(`/profile/${userId}/profile-photo`, request)
  });
};

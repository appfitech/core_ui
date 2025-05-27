import { useMutation } from "@tanstack/react-query";
import { api } from "../api";
import { LoginResponse, User } from "@/app/types/user";
import { useUserStore } from "@/app/stores/user";

export const useDeletePhoto = () => {
  const userId = useUserStore((s) => s?.user?.user?.id);

  return useMutation<LoginResponse, Error, number>({
    mutationFn: async (photoId: number): Promise<LoginResponse> =>
      api.delete(`/profile/${userId}/photos/${photoId}`)
  });
};

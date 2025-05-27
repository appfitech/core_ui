import { useQuery } from "@tanstack/react-query";
import { api } from "../api";
import { useUserStore } from "@/app/stores/user";
import { Photo } from "@/app/types/photos";

export const useGetUserPhotos = () => {
  const userId = useUserStore((s) => s?.user?.user?.id);

  return useQuery<Photo[]>({
    enabled: !!userId,
    queryKey: ["/file-upload/user", userId],
    queryFn: async () => {
      return api.get(`/profile/${userId}/photos`);
    }
  });
};

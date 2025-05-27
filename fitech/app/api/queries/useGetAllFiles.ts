import { useQuery } from "@tanstack/react-query";
import { api } from "../api";

export const useGetAllFiles = (userId?: number) => {
  return useQuery({
    enabled: !!userId,
    queryKey: ["/file-upload/user", userId],
    queryFn: async () => {
      return api.get(`/file-upload/user/${userId}`);
    }
  });
};

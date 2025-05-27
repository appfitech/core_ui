import { useQuery } from "@tanstack/react-query";
import { api } from "../api";

export const useGetUser = (userId?: number) => {
  return useQuery({
    enabled: !!userId,
    queryKey: ["user", userId],
    queryFn: async () => {
      return api.get(`/user/${userId}`);
    }
  });
};

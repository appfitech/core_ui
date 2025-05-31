import { useQuery } from '@tanstack/react-query';

import { api } from '../api';

export const useGetPicture = (fileId?: number) => {
  return useQuery({
    enabled: !!fileId,
    queryKey: ['/file-upload/view', fileId],
    queryFn: async () => {
      return api.get(`/file-upload/view/${fileId}`);
    },
  });
};

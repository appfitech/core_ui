import { useMutation } from '@tanstack/react-query';

import { useUserStore } from '@/stores/user';
import { LoginResponse } from '@/types/user';

import { api } from '../api';

export const useSendInquiry = () => {
  const user = useUserStore((s) => s?.user?.user);

  return useMutation<LoginResponse, Error, any>({
    mutationFn: async (request): Promise<LoginResponse> =>
      api.post(`/support/send-inquiry`, {
        email: user?.person?.email,
        message: request?.description,
        name: user?.person?.firstName,
        phone: user?.person?.phoneNumber,
        subject: request.subject,
        type: request.type,
        userId: user?.id,
        userType: 2,
      }),
  });
};

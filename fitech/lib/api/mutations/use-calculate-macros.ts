import { useMutation } from '@tanstack/react-query';

import {
  MacroCalculationRequestDto,
  MacroCalculationResponseDto,
} from '@/types/api/types.gen';

import { api } from '../api';

export const useCalculateMacros = () => {
  return useMutation<
    MacroCalculationResponseDto,
    Error,
    MacroCalculationRequestDto
  >({
    mutationFn: async (request) => {
      const result = await api.post(
        '/nutrition/foods/calculate-macros',
        request,
      );
      if (
        result &&
        typeof result === 'object' &&
        'data' in result &&
        (result as { data: unknown }).data
      ) {
        return (result as { data: MacroCalculationResponseDto }).data;
      }
      return result as MacroCalculationResponseDto;
    },
  });
};

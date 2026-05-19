import { Stack } from 'expo-router';
import React from 'react';

import { STACK_SCREEN_OPTIONS } from '@/constants/navigation';
import { MacroFoodItemsProvider } from '@/contexts/MacroFoodItemsContext';

export default function MacrosCalculatorLayout() {
  return (
    <MacroFoodItemsProvider>
      <Stack screenOptions={STACK_SCREEN_OPTIONS} />
    </MacroFoodItemsProvider>
  );
}

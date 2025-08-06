import { Stack } from 'expo-router';
import React from 'react';

import { MacroFoodItemsProvider } from '@/contexts/MacroFoodItemsContext';

export default function MacrosCalculatorLayout() {
  return (
    <MacroFoodItemsProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </MacroFoodItemsProvider>
  );
}

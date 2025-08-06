import React, { createContext, useCallback, useContext, useState } from 'react';

import {
  FoodItemDto,
  MacroCalculationResponseDto,
  SelectedFoodDto,
} from '@/types/api/types.gen';

type MacroFoodItemsContextType = {
  selectedItems: FoodItemDto[];
  foodItemRequest: SelectedFoodDto[];
  onFoodSelection: (foodItem: FoodItemDto) => void;
  onRequestChange: (foodId: number, text: string) => void;
  calculation: MacroCalculationResponseDto | null;
  setCalculation: (value: MacroCalculationResponseDto | null) => void;
};

const MacroFoodItemsContext = createContext<MacroFoodItemsContextType>({
  selectedItems: [],
  foodItemRequest: [],
  onFoodSelection: () => {},
  onRequestChange: () => {},
  calculation: null,
  setCalculation: () => {},
});

export const MacroFoodItemsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [selected, setSelected] = useState<FoodItemDto[]>([]);
  const [foodItemRequest, setFoodItemRequest] = useState<SelectedFoodDto[]>([]);
  const [calculation, setCalculation] =
    useState<MacroCalculationResponseDto | null>(null);

  const handleFoodSelection = useCallback((foodItem: FoodItemDto) => {
    if (!foodItem) {
      return;
    }

    setCalculation(null);

    const foodItemId = foodItem?.id;

    setSelected((prev) => {
      const existing = prev.find((item) => item.id === foodItemId);

      if (existing) {
        return prev.filter((item) => item.id !== foodItemId);
      }

      return [...prev, foodItem];
    });

    setFoodItemRequest((prev) => {
      const existing = prev.find((item) => item.foodId === foodItemId);

      if (existing) {
        return prev.filter((item) => item.foodId !== foodItemId);
      } else {
        return [...prev, { foodId: foodItemId, quantity: 1 }];
      }
    });
  }, []);

  const handleRequestChange = useCallback((foodId: number, text: string) => {
    if (isNaN(Number(text)) && !!text) {
      return;
    }

    setCalculation(null);

    setFoodItemRequest((prev) =>
      prev?.map((item) =>
        item.foodId === foodId
          ? { ...item, quantity: !!text ? Number(text) : text }
          : item,
      ),
    );
  }, []);

  return (
    <MacroFoodItemsContext.Provider
      value={{
        selectedItems: selected,
        onFoodSelection: handleFoodSelection,
        foodItemRequest,
        onRequestChange: handleRequestChange,
        calculation,
        setCalculation,
      }}
    >
      {children}
    </MacroFoodItemsContext.Provider>
  );
};

export const useMacroFoodItemsContext = () => useContext(MacroFoodItemsContext);

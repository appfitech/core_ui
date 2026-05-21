import React, { createContext, useCallback, useContext, useState } from 'react';

import {
  formatPortionInput,
  isValidPortionInput,
  parsePortionInput,
} from '@/lib/macros/portion-input';
import {
  FoodItemDto,
  MacroCalculationResponseDto,
  SelectedFoodDto,
} from '@/types/api/types.gen';

type MacroFoodItemsContextType = {
  selectedItems: FoodItemDto[];
  foodItemRequest: SelectedFoodDto[];
  portionInputs: Record<number, string>;
  onFoodSelection: (foodItem: FoodItemDto) => void;
  onRequestChange: (foodId: number, text: string) => void;
  getPortionInput: (foodId: number) => string;
  calculation: MacroCalculationResponseDto | null;
  setCalculation: (value: MacroCalculationResponseDto | null) => void;
};

const MacroFoodItemsContext = createContext<MacroFoodItemsContextType>({
  selectedItems: [],
  foodItemRequest: [],
  portionInputs: {},
  onFoodSelection: () => {},
  onRequestChange: () => {},
  getPortionInput: () => '1',
  calculation: null,
  setCalculation: () => {},
});

export const MacroFoodItemsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [selected, setSelected] = useState<FoodItemDto[]>([]);
  const [foodItemRequest, setFoodItemRequest] = useState<SelectedFoodDto[]>([]);
  const [portionInputs, setPortionInputs] = useState<Record<number, string>>(
    {},
  );
  const [calculation, setCalculation] =
    useState<MacroCalculationResponseDto | null>(null);

  const handleFoodSelection = useCallback((foodItem: FoodItemDto) => {
    if (!foodItem?.id) return;

    setCalculation(null);
    const foodItemId = foodItem.id;

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
      }
      return [...prev, { foodId: foodItemId, quantity: 1 }];
    });

    setPortionInputs((prev) => {
      if (prev[foodItemId] != null) {
        const next = { ...prev };
        delete next[foodItemId];
        return next;
      }
      return { ...prev, [foodItemId]: '1' };
    });
  }, []);

  const handleRequestChange = useCallback((foodId: number, text: string) => {
    if (!isValidPortionInput(text)) return;

    setCalculation(null);
    setPortionInputs((prev) => ({ ...prev, [foodId]: text }));
    setFoodItemRequest((prev) =>
      prev.map((item) =>
        item.foodId === foodId
          ? { ...item, quantity: parsePortionInput(text) }
          : item,
      ),
    );
  }, []);

  const getPortionInput = useCallback(
    (foodId: number) => {
      if (portionInputs[foodId] != null) return portionInputs[foodId];
      const request = foodItemRequest.find((item) => item.foodId === foodId);
      return formatPortionInput(request?.quantity) || '1';
    },
    [foodItemRequest, portionInputs],
  );

  return (
    <MacroFoodItemsContext.Provider
      value={{
        selectedItems: selected,
        onFoodSelection: handleFoodSelection,
        foodItemRequest,
        portionInputs,
        onRequestChange: handleRequestChange,
        getPortionInput,
        calculation,
        setCalculation,
      }}
    >
      {children}
    </MacroFoodItemsContext.Provider>
  );
};

export const useMacroFoodItemsContext = () => useContext(MacroFoodItemsContext);

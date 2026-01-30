import { ReactNode } from "react";
import { create } from "zustand";

interface IPlayerBottomSheetState {
  isPlayerVisible: boolean;
  setShowPlayerSheet: (state: Omit<IPlayerBottomSheetState, "setShowPlayerSheet">) => void;
  children: ReactNode;
}

export const useBottomPlayerSheetStore = create<IPlayerBottomSheetState>(set => ({
  isPlayerVisible: false,
  setShowPlayerSheet: ({ isPlayerVisible, children }: Omit<IPlayerBottomSheetState, "setShowPlayerSheet">) =>
    set({ isPlayerVisible, children }),
  children: null
}));

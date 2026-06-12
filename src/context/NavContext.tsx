"use client";
import { createContext } from "react";

type NavContextType = {
  activeTab: string;
  setActiveTab: (activeTab: string) => void;
};

export const NavContext = createContext<NavContextType | undefined>(undefined);

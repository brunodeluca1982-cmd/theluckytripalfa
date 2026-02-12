import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface CarnavalModeContextValue {
  isCarnavalMode: boolean;
  toggleCarnavalMode: () => void;
  carnavalSuggestions: string[];
  removeCarnavalSuggestion: (item: string) => void;
}

const DEFAULT_SUGGESTIONS = [
  "Power bank",
  "Doleira",
  "Protetor solar",
  "Transfer agendado",
  "Ingresso Sapucaí / Camarote",
  "Restaurante reservado (pós-bloco)",
];

const CarnavalModeContext = createContext<CarnavalModeContextValue | null>(null);

export const CarnavalModeProvider = ({ children }: { children: ReactNode }) => {
  const [isCarnavalMode, setIsCarnavalMode] = useState(true);
  const [carnavalSuggestions, setCarnavalSuggestions] = useState<string[]>(DEFAULT_SUGGESTIONS);

  const toggleCarnavalMode = useCallback(() => {
    setIsCarnavalMode((prev) => !prev);
    // Reset suggestions when turning back on
    setCarnavalSuggestions(DEFAULT_SUGGESTIONS);
  }, []);

  const removeCarnavalSuggestion = useCallback((item: string) => {
    setCarnavalSuggestions((prev) => prev.filter((s) => s !== item));
  }, []);

  return (
    <CarnavalModeContext.Provider value={{ isCarnavalMode, toggleCarnavalMode, carnavalSuggestions, removeCarnavalSuggestion }}>
      {children}
    </CarnavalModeContext.Provider>
  );
};

export const useCarnavalMode = () => {
  const ctx = useContext(CarnavalModeContext);
  if (!ctx) throw new Error("useCarnavalMode must be used within CarnavalModeProvider");
  return ctx;
};

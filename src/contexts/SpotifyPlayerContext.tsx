import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface SpotifyPlayerState {
  active: boolean;
  sheetOpen: boolean;
  openSheet: () => void;
  closeSheet: () => void;
  dismiss: () => void;
}

const SpotifyPlayerContext = createContext<SpotifyPlayerState>({
  active: false,
  sheetOpen: false,
  openSheet: () => {},
  closeSheet: () => {},
  dismiss: () => {},
});

export const useSpotifyPlayer = () => useContext(SpotifyPlayerContext);

export const SpotifyPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [active, setActive] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const openSheet = useCallback(() => {
    setActive(true);
    setSheetOpen(true);
  }, []);

  const closeSheet = useCallback(() => {
    setSheetOpen(false);
  }, []);

  const dismiss = useCallback(() => {
    setActive(false);
    setSheetOpen(false);
  }, []);

  return (
    <SpotifyPlayerContext.Provider value={{ active, sheetOpen, openSheet, closeSheet, dismiss }}>
      {children}
    </SpotifyPlayerContext.Provider>
  );
};

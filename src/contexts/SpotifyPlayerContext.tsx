import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface SpotifyPlayerState {
  active: boolean;
  sheetOpen: boolean;
  activate: () => void;
  openSheet: () => void;
  closeSheet: () => void;
  dismiss: () => void;
}

const SpotifyPlayerContext = createContext<SpotifyPlayerState>({
  active: false,
  sheetOpen: false,
  activate: () => {},
  openSheet: () => {},
  closeSheet: () => {},
  dismiss: () => {},
});

export const useSpotifyPlayer = () => useContext(SpotifyPlayerContext);

export const SpotifyPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [active, setActive] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const activate = useCallback(() => {
    setActive(true);
  }, []);

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
    <SpotifyPlayerContext.Provider value={{ active, sheetOpen, activate, openSheet, closeSheet, dismiss }}>
      {children}
    </SpotifyPlayerContext.Provider>
  );
};

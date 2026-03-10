import { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export interface PendingAction {
  type: string;
  payload?: Record<string, string>;
  returnTo?: string;
}

const STORAGE_KEY = "pending_auth_action";

/**
 * Stores a pending action before redirecting to auth,
 * and retrieves it after successful authentication.
 */
export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectToAuth = useCallback(
    (pendingAction?: PendingAction) => {
      const action: PendingAction = pendingAction || {
        type: "return",
        returnTo: location.pathname + location.search,
      };

      // Always store the current page as returnTo if not set
      if (!action.returnTo) {
        action.returnTo = location.pathname + location.search;
      }

      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(action));
      } catch {}

      navigate("/auth");
    },
    [navigate, location]
  );

  const getPendingAction = useCallback((): PendingAction | null => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as PendingAction;
    } catch {
      return null;
    }
  }, []);

  const clearPendingAction = useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  /**
   * After successful auth, resume the pending action.
   * Returns true if an action was resumed.
   */
  const resumePendingAction = useCallback((): boolean => {
    const action = getPendingAction();
    if (!action) return false;

    clearPendingAction();

    // Navigate back to original page — the component there will handle the rest
    if (action.returnTo) {
      navigate(action.returnTo, { replace: true });
      return true;
    }

    navigate("/", { replace: true });
    return true;
  }, [getPendingAction, clearPendingAction, navigate]);

  return {
    redirectToAuth,
    getPendingAction,
    clearPendingAction,
    resumePendingAction,
  };
};

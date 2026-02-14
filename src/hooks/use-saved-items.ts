import { useState, useEffect, useCallback } from "react";

/**
 * SAVED ITEMS — Normalized persistence layer (localStorage)
 * Single source of truth for the itinerary generator.
 */

export interface SavedItemRecord {
  id: string;
  type: "block" | "attraction" | "restaurant" | "hotel" | "festa" | "activity";
  title: string;
  date_iso?: string;
  start_time_24h?: string;
  end_time_24h?: string;
  start_hour_display?: string;
  neighborhood_full: string;
  neighborhood_short: string;
  vibe_one_word?: string;
  location_label: string;
  gmaps_url: string;
  gmaps_urls?: string[];
  notes_full: string;
  created_at: string;
  rsvp: boolean;
  // Scheduling metadata
  priority?: "fixed" | "preferred" | "flexible";
  duration_minutes?: number;
  schedule_status?: "scheduled" | "unscheduled";
  unscheduled_reason?: string;
  missing_fields?: string[];
  overnight?: boolean;
  // Internal logging
  last_itinerary_build_at?: string;
  last_itinerary_input_count?: number;
  last_itinerary_included_ids?: string[];
}

export interface ItineraryConflict {
  id_a: string;
  id_b: string;
  reason: "time_overlap";
}

export interface ItinerarySegment {
  from_id: string;
  to_id: string;
  gmaps_directions_url: string;
}

const SAVED_ITEMS_KEY = "saved-items";

function readItems(): SavedItemRecord[] {
  try {
    return JSON.parse(localStorage.getItem(SAVED_ITEMS_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeItems(items: SavedItemRecord[]) {
  localStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("saved-items-updated"));
}

/** Upsert a SavedItem by id+type. Returns the updated list. */
export function upsertSavedItem(item: SavedItemRecord): SavedItemRecord[] {
  const items = readItems();
  const idx = items.findIndex((i) => i.id === item.id && i.type === item.type);
  if (idx >= 0) {
    // Merge: keep existing rsvp if already true
    items[idx] = { ...items[idx], ...item, rsvp: items[idx].rsvp || item.rsvp };
  } else {
    items.push(item);
  }
  writeItems(items);
  return items;
}

/** Set rsvp=true on an existing item (or create it) */
export function markRsvp(id: string, type: SavedItemRecord["type"]): void {
  const items = readItems();
  const idx = items.findIndex((i) => i.id === id && i.type === type);
  if (idx >= 0) {
    items[idx].rsvp = true;
    writeItems(items);
  }
}

/** Remove a saved item */
export function removeSavedItem(id: string, type: SavedItemRecord["type"]): SavedItemRecord[] {
  const items = readItems().filter((i) => !(i.id === id && i.type === type));
  writeItems(items);
  return items;
}

/** Check if an item is saved */
export function isItemSaved(id: string, type?: SavedItemRecord["type"]): boolean {
  const items = readItems();
  return items.some((i) => i.id === id && (type ? i.type === type : true));
}

/** Get all saved items */
export function getAllSavedItems(): SavedItemRecord[] {
  return readItems();
}

/** Get saved items filtered by date range */
export function getSavedItemsByDateRange(startISO: string, endISO: string): SavedItemRecord[] {
  return readItems().filter((i) => {
    if (!i.date_iso) return false;
    return i.date_iso >= startISO && i.date_iso <= endISO;
  });
}

/** Get saved items for a specific date, sorted by start_time_24h */
export function getSavedItemsByDate(dateISO: string): SavedItemRecord[] {
  return readItems()
    .filter((i) => i.date_iso === dateISO)
    .sort((a, b) => (a.start_time_24h || "99:99").localeCompare(b.start_time_24h || "99:99"));
}

/** Build itinerary segments + conflict detection for a date */
export function buildItineraryForDate(dateISO: string): {
  items: SavedItemRecord[];
  conflicts: ItineraryConflict[];
  segments: ItinerarySegment[];
} {
  const items = getSavedItemsByDate(dateISO);
  const conflicts: ItineraryConflict[] = [];
  const segments: ItinerarySegment[] = [];

  for (let i = 0; i < items.length; i++) {
    // Detect time overlaps with next item
    if (i > 0 && items[i].start_time_24h && items[i - 1].start_time_24h) {
      if (items[i].start_time_24h === items[i - 1].start_time_24h) {
        conflicts.push({
          id_a: items[i - 1].id,
          id_b: items[i].id,
          reason: "time_overlap",
        });
      }
    }

    // Build directions segment between consecutive items
    if (i > 0 && items[i].gmaps_url && items[i - 1].gmaps_url) {
      const origin = items[i - 1].location_label || items[i - 1].neighborhood_full;
      const destination = items[i].location_label || items[i].neighborhood_full;
      segments.push({
        from_id: items[i - 1].id,
        to_id: items[i].id,
        gmaps_directions_url: `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin + ", Rio de Janeiro")}&destination=${encodeURIComponent(destination + ", Rio de Janeiro")}`,
      });
    }
  }

  // Internal logging
  const now = new Date().toISOString();
  const allItems = readItems();
  let changed = false;
  for (const item of items) {
    const idx = allItems.findIndex((i) => i.id === item.id && i.type === item.type);
    if (idx >= 0) {
      allItems[idx].last_itinerary_build_at = now;
      allItems[idx].last_itinerary_input_count = items.length;
      allItems[idx].last_itinerary_included_ids = items.map((i) => i.id);
      changed = true;
    }
  }
  if (changed) writeItems(allItems);

  return { items, conflicts, segments };
}

/** React hook for reactive saved items state */
export function useSavedItems() {
  const [items, setItems] = useState<SavedItemRecord[]>(readItems);

  useEffect(() => {
    const handler = () => setItems(readItems());
    window.addEventListener("saved-items-updated", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("saved-items-updated", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const save = useCallback((item: SavedItemRecord) => {
    const updated = upsertSavedItem(item);
    setItems(updated);
  }, []);

  const remove = useCallback((id: string, type: SavedItemRecord["type"]) => {
    const updated = removeSavedItem(id, type);
    setItems(updated);
  }, []);

  return { items, save, remove, isItemSaved };
}

import { useEffect, useRef, useCallback, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { X, MapPin } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { MapItem } from "./useItemCoordinates";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface Props {
  open: boolean;
  onClose: () => void;
  categoryLabel: string;
  items: MapItem[];
  focusItemId?: string | null;
  onSelectItem?: (id: string) => void;
}

const ACTIVE_COLOR = "hsl(var(--primary))";
const INACTIVE_COLOR = "#94a3b8";

export default function ExpandedMapSheet({
  open,
  onClose,
  categoryLabel,
  items,
  focusItemId,
  onSelectItem,
}: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.CircleMarker>>(new Map());
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Sync external focus
  useEffect(() => {
    if (focusItemId && open) {
      setSelectedId(focusItemId);
    }
  }, [focusItemId, open]);

  // Init map
  useEffect(() => {
    if (!open || !mapContainerRef.current) return;

    // Small delay to let sheet animate
    const timer = setTimeout(() => {
      if (mapRef.current || !mapContainerRef.current) return;

      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
      }).addTo(map);

      const bounds = L.latLngBounds([]);
      const markers = new Map<string, L.CircleMarker>();

      items.forEach((item) => {
        const ll = L.latLng(item.lat, item.lng);
        bounds.extend(ll);

        const marker = L.circleMarker(ll, {
          radius: 8,
          color: INACTIVE_COLOR,
          fillColor: INACTIVE_COLOR,
          fillOpacity: 0.8,
          weight: 2,
        }).addTo(map);

        marker.bindPopup(
          `<div style="font-family:inherit;min-width:120px">
            <strong style="font-size:13px">${item.nome}</strong><br/>
            <span style="font-size:11px;color:#64748b">${item.bairro}</span>
          </div>`,
          { closeButton: false, offset: [0, -6] }
        );

        marker.on("click", () => {
          setSelectedId(item.id);
          onSelectItem?.(item.id);
        });

        markers.set(item.id, marker);
      });

      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40] });
      }

      mapRef.current = map;
      markersRef.current = markers;
    }, 150);

    return () => {
      clearTimeout(timer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current.clear();
      }
    };
  }, [open, items, onSelectItem]);

  // Highlight selected marker + flyTo
  useEffect(() => {
    if (!mapRef.current || !selectedId) return;

    markersRef.current.forEach((m, id) => {
      const isActive = id === selectedId;
      m.setStyle({
        color: isActive ? ACTIVE_COLOR : INACTIVE_COLOR,
        fillColor: isActive ? ACTIVE_COLOR : INACTIVE_COLOR,
        radius: isActive ? 10 : 8,
      });
      if (isActive) {
        m.openPopup();
        mapRef.current?.flyTo(m.getLatLng(), 15, { duration: 0.6 });
      }
    });
  }, [selectedId]);

  const handleChipClick = useCallback((id: string) => {
    setSelectedId(id);
    onSelectItem?.(id);
  }, [onSelectItem]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 h-[80vh] md:h-[70vh] bg-background rounded-t-[24px] shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1.5 bg-muted rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3">
          <div>
            <h2 className="text-lg font-serif font-semibold text-foreground">
              {categoryLabel}
            </h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {items.length} {items.length === 1 ? "local" : "locais"} no mapa
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Fechar mapa"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Chips row */}
        <div className="px-5 pb-3">
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-1">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleChipClick(item.id)}
                  className={`whitespace-nowrap text-xs px-3 py-1.5 rounded-full border transition-colors flex-shrink-0 ${
                    selectedId === item.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"
                  }`}
                >
                  {item.nome.length > 22
                    ? item.nome.slice(0, 20) + "…"
                    : item.nome}
                </button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* Map */}
        <div ref={mapContainerRef} className="flex-1 min-h-0" />
      </div>
    </>
  );
}

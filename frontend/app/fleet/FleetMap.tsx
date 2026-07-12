"use client";

import React, { useRef, useCallback, useState } from "react";
import Map, { Marker, Popup, NavigationControl, MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { FleetVehicle, VehicleStatus, MARKER_COLORS, STATUS_LABELS } from "../data";
import { Truck, AlertTriangle, Wrench, CheckCircle } from "lucide-react";

const STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";

interface FleetMapProps {
  vehicles: FleetVehicle[];
  selectedVehicle: FleetVehicle | null;
  onVehicleSelect: (vehicle: FleetVehicle) => void;
}

function VehicleIcon({ status }: { status: VehicleStatus }) {
  const color = MARKER_COLORS[status];

  switch (status) {
    case "on_trip":
      return <Truck size={14} color="#fff" />;
    case "available":
      return <CheckCircle size={14} color="#fff" />;
    case "on_maintenance":
      return <Wrench size={14} color="#fff" />;
    case "in_shop":
      return <AlertTriangle size={14} color="#fff" />;
    default:
      return <Truck size={14} color="#fff" />;
  }
}

export default function FleetMap({ vehicles, selectedVehicle, onVehicleSelect }: FleetMapProps) {
  const mapRef = useRef<MapRef>(null);
  const [popupVehicle, setPopupVehicle] = useState<FleetVehicle | null>(null);

  const handleMarkerClick = useCallback(
    (vehicle: FleetVehicle) => {
      onVehicleSelect(vehicle);
      setPopupVehicle(vehicle);
      mapRef.current?.flyTo({
        center: [vehicle.location.lng, vehicle.location.lat],
        zoom: 10,
        duration: 1200,
      });
    },
    [onVehicleSelect]
  );

  const handleMapClick = useCallback(() => {
    setPopupVehicle(null);
  }, []);

  return (
    <Map
      ref={mapRef}
      initialViewState={{
        longitude: 76.4,
        latitude: 10.2,
        zoom: 7,
      }}
      style={{ width: "100%", height: "100%" }}
      mapStyle={STYLE_URL}
      onClick={handleMapClick}
      attributionControl={false}
    >
      <NavigationControl position="top-right" />

      {vehicles.map((vehicle) => {
        const isSelected = selectedVehicle?.id === vehicle.id;
        const color = MARKER_COLORS[vehicle.status];

        return (
          <Marker
            key={vehicle.id}
            longitude={vehicle.location.lng}
            latitude={vehicle.location.lat}
            anchor="center"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              handleMarkerClick(vehicle);
            }}
          >
            <div
              style={{
                background: color,
                boxShadow: isSelected
                  ? `0 0 0 3px ${color}40, 0 0 0 6px ${color}20`
                  : `0 2px 8px ${color}60`,
                transform: isSelected ? "scale(1.25)" : "scale(1)",
              }}
              className="relative flex size-8 cursor-pointer items-center justify-center rounded-full border-2 border-white transition-all duration-200"
            >
              <VehicleIcon status={vehicle.status} />
              {vehicle.status === "on_trip" && (
                <span className="absolute -top-1 -right-1 flex size-3">
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                    style={{ background: color }}
                  />
                  <span
                    className="relative inline-flex size-3 rounded-full"
                    style={{ background: color }}
                  />
                </span>
              )}
            </div>
          </Marker>
        );
      })}

      {popupVehicle && (
        <Popup
          longitude={popupVehicle.location.lng}
          latitude={popupVehicle.location.lat}
          anchor="bottom"
          offset={20}
          closeButton={false}
          closeOnClick={false}
          onClose={() => setPopupVehicle(null)}
          className="fleet-popup"
        >
          <div className="rounded-lg bg-card p-3 shadow-lg ring-1 ring-foreground/10 min-w-[180px]">
            <div className="flex items-center gap-2 mb-1.5">
              <div
                className="size-2 rounded-full flex-shrink-0"
                style={{ background: MARKER_COLORS[popupVehicle.status] }}
              />
              <span className="text-xs font-semibold text-foreground">
                {popupVehicle.registrationNumber}
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-medium mb-0.5">{popupVehicle.name}</p>
            <p className="text-xs text-muted-foreground">{popupVehicle.location.address}</p>
            {popupVehicle.driver && (
              <p className="text-xs text-foreground/70 mt-1 font-medium">
                Driver: {popupVehicle.driver.name}
              </p>
            )}
          </div>
        </Popup>
      )}
    </Map>
  );
}

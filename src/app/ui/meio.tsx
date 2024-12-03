"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

interface MapProps {
    posix: [number, number];
    zoom?: number;
}

const defaults = {
    zoom: 13,
};

function Map({ posix, zoom = defaults.zoom }: MapProps) {
    const mapRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.setView(posix, zoom);
        }
    }, [posix, zoom]);

    return (
        <MapContainer
            center={posix}
            zoom={zoom}
            ref={mapRef}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={posix}>
                <Popup>Nós estudamos aqui!</Popup>
            </Marker>
            <Marker position={[-21.087021723885282, -44.229153273125625]}>
                <Popup>Aqui é o aeroporto</Popup>
            </Marker>
        </MapContainer>
    );
}

export default function Meio() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <div
            key="meio"
            className="text-black flex w-3/5 h-5/6 items-center rounded-lg border bg-slate-200 justify-center overflow-hidden"
        >
            <Map posix={[-21.106016282941873, -44.24965143017836]} />
        </div>
    );
}

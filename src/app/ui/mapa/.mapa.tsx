"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from 'leaflet';

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

interface MapProps {
    posix: LatLngExpression | LatLngTuple,
    zoom?: number,
}

const defaults = {
    zoom: 15,
}

const Map = ({ posix, zoom = defaults.zoom }: MapProps) => {

    return (
        <MapContainer
            key={`${posix}-${zoom}`}
            center={posix}
            zoom={zoom}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={posix} draggable={false}>
                <Popup>Nós estudamos aqui!</Popup>
            </Marker>
            <Marker position={[-21.087021723885282, -44.229153273125625]} draggable={false}>
                <Popup>Aqui é o aeroporto</Popup>
            </Marker>
        </MapContainer>
    )
}

export default Map;

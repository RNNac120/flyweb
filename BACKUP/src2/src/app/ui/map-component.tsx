"use client"

import { useEffect, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import type L from "leaflet"

interface MapProps {
  posix: [number, number]
  zoom?: number
}

const defaults = {
  zoom: 13,
}

export default function MapComponent({ posix, zoom = defaults.zoom }: MapProps) {
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(posix, zoom)
    }
  }, [posix, zoom])

  return (
    <MapContainer center={posix} zoom={zoom} ref={mapRef} style={{ height: "100%", width: "100%" }}>
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
  )
}


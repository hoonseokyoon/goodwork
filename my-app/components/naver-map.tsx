"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type NaverLatLng = unknown;
type NaverMapInstance = unknown;
type NaverMarkerInstance = unknown;

type NaverMapOptions = {
  center: NaverLatLng;
  zoom: number;
};

type NaverMarkerOptions = {
  position: NaverLatLng;
  title?: string;
  map: NaverMapInstance;
};

type NaverMaps = {
  Map: new (element: HTMLElement, options: NaverMapOptions) => NaverMapInstance;
  LatLng: new (lat: number, lng: number) => NaverLatLng;
  Marker: new (options: NaverMarkerOptions) => NaverMarkerInstance;
  Event: {
    addListener: (
      instance: NaverMarkerInstance,
      eventName: string,
      handler: () => void,
    ) => void;
  };
};

declare global {
  interface Window {
    naver?: {
      maps?: NaverMaps;
    };
  }
}

type Marker = {
  lat: number;
  lng: number;
  title?: string | null;
  slug: string;
};

type NaverMapProps = {
  center: {
    lat: number;
    lng: number;
  };
  markers: Marker[];
  zoom?: number;
};

export default function NaverMap({ center, markers, zoom = 10 }: NaverMapProps) {
  const mapId = useRef(`map_${Math.random().toString(36).slice(2)}`);
  const router = useRouter();

  useEffect(() => {
    const scriptSrc = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID ?? ""}`;
    let scriptElement = document.querySelector<HTMLScriptElement>(
      'script[src*="maps.js"]',
    );

    const initialize = () => {
      const maps = window.naver?.maps;

      if (!maps) {
        return;
      }

      const container = document.getElementById(mapId.current) as
        | HTMLElement
        | null;

      if (!container) {
        return;
      }

      container.innerHTML = "";

      const map = new maps.Map(container, {
        center: new maps.LatLng(center.lat, center.lng),
        zoom,
      });

      markers.forEach((marker) => {
        if (
          typeof marker.lat !== "number" ||
          Number.isNaN(marker.lat) ||
          typeof marker.lng !== "number" ||
          Number.isNaN(marker.lng)
        ) {
          return;
        }

        const markerInstance = new maps.Marker({
          position: new maps.LatLng(marker.lat, marker.lng),
          title: marker.title ?? undefined,
          map,
        });

        maps.Event.addListener(markerInstance, "click", () => {
          router.push(`/institutions/${marker.slug}`);
        });
      });
    };

    const handleScriptLoad = () => {
      initialize();
    };

    if (!scriptElement) {
      scriptElement = document.createElement("script");
      scriptElement.src = scriptSrc;
      scriptElement.async = true;
      document.head.appendChild(scriptElement);
      scriptElement.addEventListener("load", handleScriptLoad);
    } else if (window.naver?.maps) {
      initialize();
    } else {
      scriptElement.addEventListener("load", handleScriptLoad);
    }

    return () => {
      scriptElement?.removeEventListener("load", handleScriptLoad);
    };
  }, [center.lat, center.lng, markers, router, zoom]);

  return (
    <div
      id={mapId.current}
      className="h-[70vh] w-full rounded-2xl"
      role="application"
      aria-label="수도원·수녀원 위치 지도"
    />
  );
}

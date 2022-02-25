import { LatLngBounds } from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useSelector } from "react-redux";
import { selectAutofitBounds } from "../store/mapFilteringSlice";
import { selectSamples } from "../store/samplesSlice";

const MapControls = () => {
  const samples = useSelector(selectSamples);
  const autofitBounds = useSelector(selectAutofitBounds);
  const map = useMap();

  useEffect(() => {
    if (autofitBounds && samples.length > 0) {
      const bounds = new LatLngBounds();
      samples.forEach((s) => {
        bounds.extend([s.lat, s.lng]);
      });
      map.fitBounds(bounds, { padding: [25, 25] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [samples, autofitBounds]);

  return null;
};

export default MapControls;

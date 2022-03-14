import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import {
  LayersControl,
  MapContainer,
  TileLayer,
  WMSTileLayer,
} from "react-leaflet";
import Fullscreen from "react-leaflet-fullscreen-plugin";
import { useSelector } from "react-redux";
import {
  selectHighlightedIndex,
  selectTrackedProject,
} from "../store/mapFilteringSlice";
import { selectSelectedProjects } from "../store/projectsSlice";
import { selectSamplesAndMaxIndexByProjectId } from "../store/samplesSlice";
import MapControls from "./MapControls";
import SamplesMarkers from "./SamplesMarkers";

const DEFAULT_CENTER = [43.3395, 7.6464];
const DEFAULT_ZOOM = 6;

const Map = () => {
  const selectedProjects = useSelector(selectSelectedProjects);
  const trackedProject = useSelector(selectTrackedProject);
  const highlightedIndex = useSelector(selectHighlightedIndex);
  const [trackedProjectSamples] = useSelector((state) =>
    selectSamplesAndMaxIndexByProjectId(state, trackedProject?.id)
  );
  const [highlightedIndexTime, setHighlightedIndexTime] = useState(null);

  useEffect(() => {
    if (trackedProject && highlightedIndex > 0) {
      const s = trackedProjectSamples.find(
        (s) => s.index_ === highlightedIndex
      );
      setHighlightedIndexTime(
        s ? s.datetime.split("T")[0] + "T12:00:00.000Z" : null
      );
    } else {
      setHighlightedIndexTime(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackedProject, trackedProjectSamples, highlightedIndex]);

  return (
    <MapContainer
      style={{
        width: "100%",
        height: "750px",
      }}
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
    >
      <MapControls />
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="OpenStreetMap">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Esri_WorldImagery">
          <TileLayer
            attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        </LayersControl.BaseLayer>
        {selectedProjects.map((project) => {
          return (
            <LayersControl.Overlay
              key={project.id + project.name}
              checked
              name={`Project ${project.name} (${project.id})`}
            >
              <SamplesMarkers project={project} />
            </LayersControl.Overlay>
          );
        })}
        {trackedProject && (
          <LayersControl.Overlay name="sea_water_velocity-2016-now">
            <WMSTileLayer
              attribution="E.U Copernicus Marine Environment Monitoring Service"
              url="https://nrt.cmems-du.eu/thredds/wms/global-analysis-forecast-phy-001-024"
              opacity={0.75}
              params={{
                layers: "sea_water_velocity",
                format: "image/png",
                styles: "linevec/greyscale",
                transparent: true,
                time: highlightedIndexTime,
                width: 256,
                height: 256,
                version: "1.3.0",
              }}
            />
          </LayersControl.Overlay>
        )}
      </LayersControl>
      <Fullscreen />
    </MapContainer>
  );
};

export default Map;

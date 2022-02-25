import "leaflet/dist/leaflet.css";
import { LayersControl, MapContainer, TileLayer } from "react-leaflet";
import Fullscreen from "react-leaflet-fullscreen-plugin";
import { useSelector } from "react-redux";
import { selectViewTrack } from "../store/mapFilteringSlice";
import { selectSelectedProjects } from "../store/projectsSlice";
import MapControls from "./MapControls";
import SamplesMarkers from "./SamplesMarkers";

const DEFAULT_CENTER = [43.3395, 7.6464];
const DEFAULT_ZOOM = 6;

const Map = () => {
  const selectedProjects = useSelector(selectSelectedProjects);
  const viewTrack = useSelector(selectViewTrack);

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
            url="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        </LayersControl.BaseLayer>
        {selectedProjects.map((project) => {
          return (
            <LayersControl.Overlay
              key={project.id}
              checked
              name={`Project ${project.name} (${project.id})`}
            >
              <SamplesMarkers project={project} viewTrack={viewTrack} />
            </LayersControl.Overlay>
          );
        })}
      </LayersControl>
      <Fullscreen />
    </MapContainer>
  );
};

export default Map;

import { Fragment } from "react";
import { CircleMarker, FeatureGroup, Popup, Tooltip } from "react-leaflet";
import TextPath from "react-leaflet-textpath";
import { useSelector } from "react-redux";
import { selectSamplesByProjectId } from "../store/samplesSlice";
import SampleView from "./SampleView";

const SamplesMarkers = ({ project, viewTrack = false }) => {
  const samples = useSelector((state) =>
    selectSamplesByProjectId(state, project.id)
  );
  return (
    <FeatureGroup>
      {samples
        .sort((s1, s2) => s1.index_ <= s2.index_)
        .map((s, index, samplesSorted) => {
          return (
            <Fragment key={s.id}>
              <CircleMarker center={[s.lat, s.lng]} radius={5}>
                <Popup>
                  <SampleView sample={s} />
                </Popup>
              </CircleMarker>
              {viewTrack && index > 0 && (
                <TextPath
                  text="    ►    "
                  orientation={180}
                  center={true}
                  opacity={0.5}
                  attributes={{ fill: "#3388ff" }}
                  repeat={true}
                  positions={[samplesSorted[index - 1], samplesSorted[index]]}
                >
                  <Tooltip direction="center" permanent={true} opacity={0.5}>
                    {s.index_}
                  </Tooltip>
                </TextPath>
              )}
            </Fragment>
          );
        })}
    </FeatureGroup>
  );
};
export default SamplesMarkers;

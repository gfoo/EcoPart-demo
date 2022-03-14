import { Fragment } from "react";
import { CircleMarker, FeatureGroup, Popup, Tooltip } from "react-leaflet";
import TextPath from "react-leaflet-textpath";
import { useSelector } from "react-redux";
import {
  selectHighlightedIndex,
  selectTrackedProject,
  selectViewTrack,
} from "../store/mapFilteringSlice";
import { selectSamplesAndMaxIndexByProjectId } from "../store/samplesSlice";
import SampleView from "./SampleView";

function markerColor(index, lastIndex, highlightedIndex) {
  if (index === highlightedIndex) {
    return { color: "orange" };
  }
  if (index === 1) {
    return { color: "green" };
  }
  if (index === lastIndex) {
    return { color: "red" };
  }
  return { color: "#3388ff" };
}

function markerRadius(index, lastIndex, highlightedIndex) {
  if (index === highlightedIndex) {
    return 10;
  }
  if (index === 1 || index === lastIndex) {
    return 10;
  }
  return 5;
}

const SamplesMarkers = ({ project }) => {
  const [samples] = useSelector((state) =>
    selectSamplesAndMaxIndexByProjectId(state, project.id)
  );
  const highlightedIndex = useSelector(selectHighlightedIndex);
  const trackedProject = useSelector(selectTrackedProject);
  const viewTrack = useSelector(selectViewTrack);

  return (
    <FeatureGroup>
      {samples
        .sort((s1, s2) => s1.index_ <= s2.index_)
        .map((s, index, samplesSorted) => {
          return (
            <Fragment key={s.id + "_" + s.index_}>
              <CircleMarker
                center={[s.lat, s.lng]}
                radius={
                  trackedProject && trackedProject.id === project.id
                    ? markerRadius(
                        s.index_,
                        samplesSorted.length,
                        highlightedIndex
                      )
                    : 5
                }
                pathOptions={
                  trackedProject && trackedProject.id === project.id
                    ? markerColor(
                        s.index_,
                        samplesSorted.length,
                        highlightedIndex
                      )
                    : { color: "#3388ff" }
                }
              >
                <Popup>
                  <SampleView sample={s} />
                </Popup>
              </CircleMarker>
              {trackedProject &&
                trackedProject.id === project.id &&
                viewTrack &&
                index > 0 && (
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

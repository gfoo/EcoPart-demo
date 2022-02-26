import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSample } from "../lib/api";
import { trackProject } from "../store/mapFilteringSlice";
import { selectProjects } from "../store/projectsSlice";
const SampleView = (props) => {
  const [sample, setSample] = useState(props.sample);
  const dispatch = useDispatch();
  const projects = useSelector(selectProjects);

  useEffect(() => {
    async function f() {
      const sample = await fetchSample(props.sample.id);
      setSample((prevSample) => ({ ...prevSample, ...sample }));
    }
    f();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const trackProjectHandler = (e, project) => {
    e.preventDefault();
    dispatch(trackProject(project));
  };

  return (
    <div style={{ width: "300px" }}>
      <div>
        <strong>ID: </strong>
        {sample.id} | <strong>lat,lng:</strong> {sample.lat.toFixed(4)},
        {sample.lng.toFixed(4)}
      </div>
      <div>
        <strong>Date:</strong> {sample.datetime} | <strong>index:</strong>{" "}
        {sample.index_}
      </div>
      {"ecopart_project" in sample && (
        <div>
          <strong>EcoPart Project:</strong> {sample.ecopart_project.name} (
          {sample.ecopart_project.id}){" "}
          <button
            onClick={(e) =>
              trackProjectHandler(
                e,
                projects.find((p) => p.id === sample.ecopart_project.id)
              )
            }
          >
            Track project
          </button>
        </div>
      )}
      {"ecotaxa_project" in sample && (
        <div>
          <strong>EcoTaxa Project:</strong>{" "}
          <a
            href={`https://ecotaxa.obs-vlfr.fr/prj/${sample.ecotaxa_project.id}`}
            target="_blank"
            rel="noreferrer"
          >
            {sample.ecotaxa_project.name} ({sample.ecotaxa_project.id})
          </a>
        </div>
      )}
      {"profile" in sample && (
        <div>
          <strong>Profile:</strong> {sample.profile.name}
        </div>
      )}
      {"ship" in sample && (
        <div>
          <strong>Ship:</strong> {sample.ship.name}
        </div>
      )}
      {"cruise" in sample && (
        <div>
          <strong>Cruise:</strong> {sample.cruise.name}
        </div>
      )}
    </div>
  );
};

export default SampleView;

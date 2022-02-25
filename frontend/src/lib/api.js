import axios from "axios";

export const BACKEND_API_CLIENT = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_API_URL}`,
});

export const fetchAllProjects = async () => {
  const response = await BACKEND_API_CLIENT.get(
    "/ecopart_projects/?limit=1000"
  );
  return response.data;
};

export const fetchSamplesOfProjectId = async (projectId) => {
  const response = await BACKEND_API_CLIENT.get(
    `/ecopart_projects/${projectId}/samples`
  );
  return response.data.map((s) => ({ ...s, project_id: projectId }));
};

export const fetchSample = async (sampleId) => {
  const response = await BACKEND_API_CLIENT.get(`/samples/${sampleId}`);
  return response.data;
};

export const fetchSamplesOfProjectIds = async (projectsIds) => {
  return (await Promise.all(projectsIds.map(fetchSamplesOfProjectId))).flat();
};

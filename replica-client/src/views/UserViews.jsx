import { Routes, Route } from "react-router-dom"
import { Home } from "../components/home/Home.jsx"
import { ProjectList } from "../components/project/ProjectList.jsx"
import { ProjectDetail } from '../components/project/ProjectDetail.jsx';
import { ProjectEdit } from '../components/project/ProjectEdit.jsx';
import { ProjectCreate } from '../components/project/ProjectCreate.jsx';
import { MLModelList } from "../components/models/MLModelList.jsx";
import { AnalysisWorkflows } from "../components/analysis/AnalysisWorkflows.jsx";
import AnalysisDetail from "../components/analysis/AnalysisDetail.jsx";

export const UserViews = ({currentUser}) => {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="projects" element={<ProjectList currentUser={currentUser}/>}/>
      <Route path="/projects/:projectId" element={<ProjectDetail />} />
      <Route path="/projects/:projectId/edit" element={<ProjectEdit />} />
      {/* <Route path="/projects/:projectId/analyze" element={<AnalysisCreate />} /> */}
      <Route path="/projects/create" element={<ProjectCreate />} />
      <Route path="models" element={<MLModelList />} />
      <Route path="workflows" element={<AnalysisWorkflows />} />
      <Route path="/analyses/:analysisId" element={<AnalysisDetail />} />
    </Routes>
  )
}
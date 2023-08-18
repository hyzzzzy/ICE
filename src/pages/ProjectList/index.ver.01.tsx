import { ProjectFilterProvider } from '../../contexts/ProjectFilterContext';
import ProjectListPage from './ProjectList';

function ProjectListIndex() {
  return (
    <>
      {/* <ProjectFilterProvider> */}
      <ProjectListPage />
      {/* </ProjectFilterProvider> */}
    </>
  );
}

export default ProjectListIndex;

import { useEffect } from 'react';
import { ProjectFilterProvider } from '../../contexts/ProjectFilterContext';
import ProjectList from './ProjectList';

function ProjectListIndex() {
  return (
    <>
      <ProjectFilterProvider>
        <ProjectList />
      </ProjectFilterProvider>
    </>
  );
}

export default ProjectListIndex;

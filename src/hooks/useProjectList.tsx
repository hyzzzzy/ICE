import { useProjectFilterDispatch, useProjectFilterState } from '../contexts/ProjectFilterContext';
import { useEffect, useState } from 'react';
import * as fetcher from '../apis/Fetcher';

const useProjectList = () => {
  const projectFilterState = useProjectFilterState();
  const projectFilterDispatch = useProjectFilterDispatch();
  const [projectList, setProjectList] = useState<any>([]);

  useEffect(() => {
    console.log('state changed');
    const fetchProjectList = async () => {
      try {
        const { category, recruitment, searchValue } = projectFilterState;
        console.log(projectFilterState);
        const res = await fetcher.getProjects(category, recruitment, searchValue || false, 1);
        setProjectList(res.data);
      } catch (e: any) {
        console.log(e);
      }
    };
    fetchProjectList();
  }, [projectFilterState]);

  const handleChangeCategory = (category: string) => {
    projectFilterDispatch({ type: 'CHANGE_CATEGORY', payload: category });
  };

  const handleChangeRecruitingState = (state: string) => {
    projectFilterDispatch({ type: 'CHANGE_RECRUITING_STATE', payload: state });
  };

  const handleChangeSearchValue = (category: string) => {
    console.log(category);
    projectFilterDispatch({ type: 'CHANGE_SEARCH_VALUE', payload: category });
  };

  return {
    projectList,
    projectFilterState,
    handleChangeCategory,
    handleChangeRecruitingState,
    handleChangeSearchValue,
  };
};

export default useProjectList;

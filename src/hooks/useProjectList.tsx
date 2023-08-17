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
        const { category, recruitment, searchValue, pageCount } = projectFilterState;
        console.log(projectFilterState);
        const res = await fetcher.getProjects(
          category,
          recruitment,
          searchValue || false,
          pageCount
        );
        if (pageCount === 1) {
          setProjectList(res.data.pagenatedProjects);
        } else {
          setProjectList((prev: any) => [...prev, ...res.data.pagenatedProjects]);
        }
      } catch (e: any) {
        console.log(e);
      }
    };
    fetchProjectList();
  }, [projectFilterState]);

  const handleChangeCategory = (category: string) => {
    window.scroll(0, 0);
    projectFilterDispatch({ type: 'CHANGE_CATEGORY', payload: category });
  };

  const handleChangeRecruitingState = (state: string) => {
    window.scroll(0, 0);
    projectFilterDispatch({ type: 'CHANGE_RECRUITING_STATE', payload: state });
  };

  const handleChangeSearchValue = (searchValue: string) => {
    window.scroll(0, 0);
    projectFilterDispatch({ type: 'CHANGE_SEARCH_VALUE', payload: searchValue });
  };

  const handleIncreasePageCount = () => {
    projectFilterDispatch({ type: 'INCREASE_PAGE_COUNT' });
  };

  return {
    projectList,
    projectFilterState,
    handleChangeCategory,
    handleChangeRecruitingState,
    handleChangeSearchValue,
    handleIncreasePageCount,
  };
};

export default useProjectList;

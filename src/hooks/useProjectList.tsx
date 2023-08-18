import { useProjectFilterDispatch, useProjectFilterState } from '../contexts/ProjectFilterContext';
import { useCallback, useEffect } from 'react';
import * as fetcher from '../apis/Fetcher';
import { debounce } from 'lodash';
import { useProjectListDispatch, useProjectListState } from '../contexts/ProjectListContext';

const useProjectList = () => {
  const projectFilterState = useProjectFilterState();
  const projectFilterDispatch = useProjectFilterDispatch();
  const projectListData = useProjectListState();
  const projectListDataDispatch = useProjectListDispatch();

  const fetchData = useCallback(async () => {
    try {
      projectListDataDispatch({ type: 'HOLD_MORE_DATA' });

      const { category, recruitment, searchValue, pageCount } = projectFilterState;
      console.log(projectFilterState);
      const res = await fetcher.getProjects(category, recruitment, searchValue || false, pageCount);
      console.log(res);
      const { pageSize, pagenatedProjects: posts } = res.data;
      const moreData = pageSize > pageCount;
      if (pageCount === 1) {
        projectListDataDispatch({ type: 'GET_POSTS', payload: { pageSize, posts, moreData } });
      } else {
        projectListDataDispatch({ type: 'GET_NEW_PAGE', payload: { pageSize, posts, moreData } });
      }
    } catch (e: any) {
      console.log(e);
    }
  }, [projectFilterState, projectListDataDispatch]);

  useEffect(() => {
    if (!projectListData.data.posts.length) {
      fetchData();
    }
  }, [fetchData]);

  const handleChangeCategory = (category: string) => {
    window.scroll(0, 0);
    projectFilterDispatch({ type: 'CHANGE_CATEGORY', payload: category });
    fetchData();
  };

  const handleChangeRecruitingState = (state: string) => {
    window.scroll(0, 0);
    projectFilterDispatch({ type: 'CHANGE_RECRUITING_STATE', payload: state });
    fetchData();
  };

  const handleChangeSearchValue = debounce((searchValue: string) => {
    window.scroll(0, 0);
    projectFilterDispatch({ type: 'CHANGE_SEARCH_VALUE', payload: searchValue });
    fetchData();
  }, 700);

  const handleIncreasePageCount = () => {
    if (projectListData.data.pageSize > projectFilterState.pageCount) {
      projectFilterDispatch({ type: 'INCREASE_PAGE_COUNT' });
    }
    fetchData();
  };

  return {
    projectListData,
    projectFilterState,
    handleChangeCategory,
    handleChangeRecruitingState,
    handleChangeSearchValue,
    handleIncreasePageCount,
  };
};

export default useProjectList;

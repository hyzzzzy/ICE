import { useProjectFilterDispatch, useProjectFilterState } from '../contexts/ProjectFilterContext';
import { useEffect, useState } from 'react';
import * as fetcher from '../apis/Fetcher';
import { debounce } from 'lodash';

const useProjectList = () => {
  const projectFilterState = useProjectFilterState();
  const projectFilterDispatch = useProjectFilterDispatch();
  const [projectListData, setProjectListData] = useState<{
    pageSize: number;
    posts: any[];
    moreData: boolean;
  }>({
    pageSize: 0,
    posts: [],
    moreData: false,
  });

  useEffect(() => {
    console.log('state changed');
    const fetchProjectList = async () => {
      try {
        setProjectListData((prev: any) => ({
          ...prev,
          moreData: false,
        }));

        const { category, recruitment, searchValue, pageCount } = projectFilterState;
        console.log(projectFilterState);
        const res = await fetcher.getProjects(
          category,
          recruitment,
          searchValue || false,
          pageCount
        );
        console.log(res);
        const { pageSize, pagenatedProjects: posts } = res.data;
        const moreData = pageSize > pageCount;
        if (pageCount === 1) {
          setProjectListData({ pageSize, posts, moreData });
        } else {
          setProjectListData((prev: any) => ({
            ...prev,
            posts: [...prev.posts, ...posts],
            moreData: moreData,
          }));
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

  const handleChangeSearchValue = debounce((searchValue: string) => {
    window.scroll(0, 0);
    projectFilterDispatch({ type: 'CHANGE_SEARCH_VALUE', payload: searchValue });
  }, 700);

  const handleIncreasePageCount = () => {
    projectFilterDispatch({ type: 'INCREASE_PAGE_COUNT' });
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

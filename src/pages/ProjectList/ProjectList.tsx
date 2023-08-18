import { RefObject, useEffect } from 'react';
import useProjectList from '../../hooks/useProjectList';
import { useMediaQuery } from 'react-responsive';
import styles from './ProjectListMain.module.scss';
import Category from '../../components/ProjectList/Category';
import ProjectPostButton from '../../components/common/ProjectPostButton';
import ProjectSearch from '../../components/ProjectList/ProjectSearch';
import RecruitingProjectFilter from '../../components/ProjectList/RecruitingProjectFilter';
import ProjectList from '../../components/ProjectList/ProjectList';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';

function ProjectListPage() {
  const isMobile = useMediaQuery({ query: '(max-width:768px)' });

  const {
    projectListData,
    projectFilterState,
    handleChangeCategory,
    handleChangeSearchValue,
    handleChangeRecruitingState,
    handleIncreasePageCount,
  } = useProjectList();

  const getNextPageRef: RefObject<HTMLElement | HTMLLIElement> = useInfiniteScroll(() => {
    handleIncreasePageCount();
  });

  return (
    <>
      <div className={!isMobile ? `${styles.container}` : `${styles.mobileContainer}`}>
        <div className={styles.leftContainer}>
          <div className={styles.leftContentContainer}>
            <Category
              selectedCategory={projectFilterState.category}
              handleClick={handleChangeCategory}
            />
            {!isMobile && <ProjectPostButton />}
          </div>
        </div>
        <div className={styles.rightContainer}>
          <div className={styles.searchContainer}>
            <ProjectSearch handleChange={handleChangeSearchValue} />
            <RecruitingProjectFilter onChange={handleChangeRecruitingState} />
          </div>
          <ProjectList
            projectList={projectListData.data.posts}
            isLoading={projectListData.isLoading}
            moreData={projectListData.data.moreData}
            innerRef={getNextPageRef}
          />
        </div>
        {isMobile && <ProjectPostButton />}
      </div>
    </>
  );
}

export default ProjectListPage;

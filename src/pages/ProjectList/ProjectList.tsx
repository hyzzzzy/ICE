import { useEffect } from 'react';
import useProjectList from '../../hooks/useProjectList';
import { useMediaQuery } from 'react-responsive';
import styles from './ProjectListMain.module.scss';
import Category from '../../components/ProjectList/Category';
import ProjectPostButton from '../../components/common/ProjectPostButton';
import ProjectSearch from '../../components/ProjectList/ProjectSearch';
import RecruitingProjectFilter from '../../components/ProjectList/RecruitingProjectFilter';

function ProjectList() {
  const isMobile = useMediaQuery({ query: '(max-width:768px)' });

  const {
    projectList,
    projectFilterState,
    handleChangeCategory,
    handleChangeSearchValue,
    handleChangeRecruitingState,
  } = useProjectList();
  useEffect(() => {
    console.log(projectList);
  }, [projectList]);

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
            <ProjectSearch
              handleChange={handleChangeSearchValue}
              value={projectFilterState.searchValue}
            />
            <RecruitingProjectFilter
              value={projectFilterState.recruitment}
              onChange={handleChangeRecruitingState}
            />
          </div>
          {/* <ProjectList
            projectList={projectListState.projectList}
            isLoading={projectListState.isLoading}
            moreData={projectListState.moreData}
            innerRef={target}
          /> */}
        </div>
        {isMobile && <ProjectPostButton />}
      </div>
    </>
  );
}

export default ProjectList;

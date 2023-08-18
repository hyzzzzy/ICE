import { AiFillCloseCircle } from 'react-icons/ai';
import styles from './ProjectSearch.module.scss';
import { useMediaQuery } from 'react-responsive';
import { useRef } from 'react';

interface ProjectSearchProps {
  handleChange: (keyword: string) => void;
}

function ProjectSearch({ handleChange }: ProjectSearchProps) {
  const isMobile = useMediaQuery({ query: '(max-width:768px)' });
  const searchRef = useRef<HTMLInputElement>(null);
  const searchValue = searchRef.current?.value;

  return (
    <div
      className={
        !isMobile ? `${styles.container}` : `${styles.container} ${styles.mobileContainer}`
      }
    >
      <div className={styles.searchContainer}>
        <span>🔍</span>
        <input
          type="text"
          placeholder="제목, 내용, 기술스택으로 검색"
          onChange={(e) => handleChange(e.target.value)}
          ref={searchRef}
        ></input>
        {searchValue && searchValue.length > 0 && (
          <button onClick={() => handleChange('')}>
            <AiFillCloseCircle />
          </button>
        )}
      </div>
      {searchValue && searchValue.length > 0 && !isMobile && (
        <div className={styles.resultContainer}>
          <p>"{searchValue}"(으)로 검색한 결과</p>
        </div>
      )}
    </div>
  );
}

export default ProjectSearch;

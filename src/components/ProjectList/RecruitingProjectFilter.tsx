import styles from './RecruitingProjectFilter.module.scss';
import { useMediaQuery } from 'react-responsive';

interface RecruitingFilterProps {
  onChange: (value: string) => void;
}

function RecruitingProjectFilter({ onChange }: RecruitingFilterProps) {
  const isMobile = useMediaQuery({ query: '(max-width:768px)' });

  return (
    <div
      className={
        !isMobile ? `${styles.container}` : `${styles.container} ${styles.mobileContainer}`
      }
    >
      <label id="recruiting-filter">
        <select onChange={(e) => onChange(e.target.value)}>
          <option value="all">{isMobile ? '전체' : '전체 모집 글 보기'}</option>
          <option value="true">{isMobile ? '모집 중' : '모집 중만 보기'}</option>
          <option value="false">{isMobile ? '모집 완료' : '모집 완료만 보기'}</option>
        </select>
      </label>
    </div>
  );
}

export default RecruitingProjectFilter;

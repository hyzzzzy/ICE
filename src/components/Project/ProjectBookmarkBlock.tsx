import React, { useState, useEffect, useRef } from 'react';
import * as Fetcher from '../../apis/Fetcher';
import * as Token from '../../apis/Token';
import { useNavigate, useLocation } from 'react-router-dom';

// 타입
import { TypeProjectBookmarks } from '../../interfaces/Project.interface';

// 스타일
import styles from './ProjectBookmarkBlock.module.scss';
import DefaultUser from '../../assets/DefaultUser.png';
import { RxTriangleDown, RxTriangleUp } from 'react-icons/rx';

// 상수
import { PROJECT_TYPE } from '../../constants/project';
import ROUTES from '../../constants/Routes';

const LEFT_POSITION = 10;

function BookmarkLogo({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <path
          d="M15.75 5H8.25C7.55964 5 7 5.58763 7 6.3125V19L12 15.5L17 19V6.3125C17 5.58763 16.4404 5 15.75 5Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </g>
    </svg>
  );
}

function BookmarkListModal({
  bookmarksData,
  isOn,
}: {
  bookmarksData: TypeProjectBookmarks;
  isOn: boolean;
}) {
  const navigate = useNavigate();
  const [isUpLogo, setIsUpLogo] = useState<boolean>(false);
  const [isDownLogo, setIsDownLogo] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (bookmarksData.project_bookmark_users.length <= 2) {
      setIsUpLogo(false);
      setIsDownLogo(false);
    } else if (event.currentTarget.scrollTop === 0) {
      setIsUpLogo(false);
      setIsDownLogo(true);
    } else if (
      event.currentTarget.scrollHeight - event.currentTarget.clientHeight <=
      event.currentTarget.scrollTop
    ) {
      setIsUpLogo(true);
      setIsDownLogo(false);
    } else {
      setIsUpLogo(true);
      setIsDownLogo(true);
    }
  };

  // 북마크한 유저 3명 이상이면 다운 스크롤 로고 활성화
  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.dispatchEvent(new Event('scroll'));
    }
  }, [modalRef, bookmarksData]);

  return (
    <div
      ref={modalRef}
      className={isOn ? styles.modalContainerOn : styles.modalContainerNot}
      onScroll={handleScroll}
    >
      <div className={styles.arrowContainer}>
        {isUpLogo && <RxTriangleUp className={styles.upLogo} />}
        {isDownLogo && <RxTriangleDown className={styles.downLogo} />}
      </div>
      {[...bookmarksData?.project_bookmark_users].reverse().map((user) => {
        return (
          <div
            key={user.user_id}
            className={styles.userContainer}
            onClick={() => {
              navigate(`${ROUTES.USER_PAGE}${user.user_id}`);
            }}
          >
            <img src={user.user_img ?? DefaultUser} alt={`${user.user_name}의 이미지`} />
            <span>{user.user_name}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function ProjectBookmarkBlock({
  bookmarksData,
  fetchData,
}: {
  bookmarksData: TypeProjectBookmarks | null;
  fetchData: () => void;
}) {
  const isLoading = useRef<boolean>(false);
  const [isBookmark, setIsBookmark] = useState<boolean>(false);
  const [bookmarksCount, setBookmarksCount] = useState<number>(0);
  const [userImages, setUserImages] = useState<string[]>([]);
  const [isBookmarkList, setIsBookmarkList] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const bookmarkType = location.pathname.split('/')[1];

  useEffect(() => {
    if (bookmarksData) {
      setBookmarksCount(bookmarksData.project_bookmark_count);
      setIsBookmark(bookmarksData.is_bookmarked);

      // 북마크한 유저 이미지 3개를 저장합니다.
      setUserImages(() => {
        const newUserImages = [];
        const bookmarkLength = bookmarksData.project_bookmark_count;

        for (let i = 0; i < 3; i++)
          if (!!bookmarksData.project_bookmark_users[bookmarkLength - 1 - i])
            newUserImages.push(
              bookmarksData.project_bookmark_users[bookmarkLength - 1 - i].user_img
            );
          else break;
        return [...newUserImages];
      });
    }

    // 클린업 코드로 isLoading 초기화
    return () => {
      isLoading.current = false;
    };
  }, [bookmarksData]);

  const handleBookmark = async () => {
    // 로그인 되어있는 유저인지 확인합니다.
    if (Token.getToken()) {
      // 로그인 되어있는 유저이면 API를 활용합니다. 단, Loading 중에는 참조하지 않습니다.
      if (!isLoading.current && bookmarksData) {
        // 로딩 중에는 handleBookmark하지 못하도록 isLoading를 true로 바꿉니다.
        isLoading.current = true;
        if (!isBookmark) {
          // 북마크가 되어있지 않으면 북마크 등록 요청을 합니다.
          try {
            if (bookmarkType === 'projects') {
              const response: { bookmark_id: number } = await Fetcher.postProjectBookmark(
                bookmarksData.project_id
              );
              // 응답 값과 현재 컴포넌트 id값을 비교하여 최종 확인합니다.
              if (!(response.bookmark_id === bookmarksData.project_id))
                new Error('예기치 못한 에러');
              fetchData();
            } else if (bookmarkType === 'portfolios') {
              const response: { bookmark_id: number } = await Fetcher.postPortfolioBookmark(
                bookmarksData.project_id
              );
              // 응답 값과 현재 컴포넌트 id값을 비교하여 최종 확인합니다.
              if (!(response.bookmark_id === bookmarksData.project_id))
                new Error('예기치 못한 에러');
              fetchData();
            }
          } catch (error) {
            alert(`${error} : 북마크 등록에 실패했습니다.`);
          }
        } else {
          try {
            if (bookmarkType === 'projects') {
              // 북마크가 되어있으면 북마크 취소 요청을 합니다.
              const response: { bookmark_id: number } = await Fetcher.deleteProjectBookmark(
                bookmarksData.project_id
              );

              // 응답 값과 현재 컴포넌트 id값을 비교하여 최종 확인합니다.
              if (!(response.bookmark_id === bookmarksData.project_id))
                new Error('예기치 못한 에러');
              fetchData();
            } else if (bookmarkType === 'portfolios') {
              // 북마크가 되어있으면 북마크 취소 요청을 합니다.
              const response: { bookmark_id: number } = await Fetcher.deletePortfolioBookmark(
                bookmarksData.project_id
              );

              // 응답 값과 현재 컴포넌트 id값을 비교하여 최종 확인합니다.
              if (!(response.bookmark_id === bookmarksData.project_id))
                new Error('예기치 못한 에러');
              fetchData();
            }
          } catch (error) {
            alert(`${error} : 북마크 취소에 실패했습니다.`);
          }
        }
      }
    } else {
      // 로그인 되어있지 않으면 alert을 띄워주고 로그인 페이지로 이동합니다.
      alert('로그인 후 사용 가능합니다.');
      navigate(ROUTES.LOGIN);
    }
  };

  if (!bookmarksData) return <></>;

  return (
    <div className={styles.container}>
      <button className={styles.bookmarkButton} onClick={handleBookmark}>
        {isBookmark ? (
          <>
            <BookmarkLogo className={styles.bookmarkYes} />
            <p className={styles.bookmarkName}>북마크 중</p>
          </>
        ) : (
          <>
            <BookmarkLogo className={styles.bookmarkNot} />
            <p className={styles.bookmarkName}>북마크</p>
          </>
        )}
      </button>
      {bookmarksData.project_bookmark_users.length > 0 && (
        <>
          <div
            className={styles.bookmarkUserBox}
            onClick={() => {
              setIsBookmarkList((prev) => !prev);
            }}
          >
            <div
              className={styles.bookmarkUserImages}
              style={{ width: (userImages.length + 1) * 10 }}
            >
              {userImages.map((image, index) => {
                return (
                  <div
                    className={styles.bookmarkUserImageCircle}
                    style={{ left: index * LEFT_POSITION, zIndex: 3 - index }}
                    key={index}
                  >
                    <img className={styles.bookmarkUserImage} src={image ? image : DefaultUser} />
                  </div>
                );
              })}
            </div>
            <p className={styles.bookmarkText}>
              {bookmarksCount > 0
                ? bookmarkType === 'projects'
                  ? `${bookmarksCount}명이 북마크한 ${PROJECT_TYPE[bookmarksData.project_type]}`
                  : `${bookmarksCount}명이 북마크한 포트폴리오`
                : ''}
            </p>
          </div>
          <BookmarkListModal bookmarksData={bookmarksData} isOn={isBookmarkList} />
        </>
      )}
    </div>
  );
}

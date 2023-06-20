import { loginAtom } from '../../recoil/loginState';
import getDateFormat from '../../utils/getDateFormat';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import styles from './Comment.module.scss';
import DefaultUserImg from '../../assets/DefaultUser.png';
import TextareaAutosize from 'react-textarea-autosize';

//@ts-ignore
export default function CommentItem({ comments, authorData }) {
  const LoginData = useRecoilState(loginAtom);
  const user = LoginData[0];
  return (
    <div>
      {comments.map((comment: any) => (
        <li key={comment.comment_id} className={styles.comment}>
          <div className={styles.header}>
            <Link
              to={
                comment.user_id === Number(user?.user_id)
                  ? '/user/mypage'
                  : `/user/${comment.user_id}`
              }
            >
              <img src={comment.user_img || DefaultUserImg} alt="profile" />
            </Link>
            <div className={styles.subHeader}>
              <Link
                to={
                  comment.user_id === Number(user?.user_id)
                    ? '/user/mypage'
                    : `/user/${comment.user_id}`
                }
              >
                <h3>{comment.user_name}</h3>
                {comment.user_id === authorData.user_id && <span>작성자</span>}
              </Link>
              <p>{getDateFormat(comment.comment_created_at)}</p>
            </div>
            <div className={styles.dotButton}>
              {/* <BsThreeDotsVertical
              onClick={() => {
                setSelectedCommentId(comment.comment_id);
                setModalOpen(true);
              }}
            /> */}
              {/* <CommentModal
                modalOpen={modalOpen && selectedCommentId === comment.comment_id}
                setModalOpen={setModalOpen}
                isMyComment={comment.user_id === Number(user?.user_id)}
                onClickEdit={handleEditButtonClick}
                onClickDelete={handleDeleteButtonClick}
                onClickCopy={handleCopyButtonClick}
              /> */}
            </div>
          </div>
          <TextareaAutosize
            readOnly
            className={styles.content}
            value={comment.isDeleted ? '삭제된 댓글입니다.' : comment.comment_content}
          />
          {/* 대댓글 렌더링 */}
          {comment.replies && comment.replies.length > 0 && (
            <CommentItem comments={comment.replies} authorData={authorData} />
          )}
        </li>
      ))}
    </div>
  );
}

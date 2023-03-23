import { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";
import { addComment, getPostDetail, replyComment } from '../../../redux/apiRequest';
import './PostDetail.css'
import avt from './avt.jpg'

export default function PostDetail(){
    const post = useSelector(state => state.post.postDetail.postInfo);
    const [comment, setComment] = useState('');
    const [postId, setPostId] = useState();
    const [answer, setAnswer] = useState(false);
    const [reply, setReply] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        setComment('');
        setPostId(null);
        setAnswer(false);
        setReply(false);
    }, [post]);

    const newComment = {
        post_id: postId,
        content: comment
    }
    const newSubComment = {
        content: comment,
        comment_id: postId
    }
    const handleAddComment = () => {
        addComment(newComment, dispatch);
        setAnswer(false);
        getPostDetail(post.post_id, dispatch, navigate);
    }

    const handleAddSubComment = () => {
        replyComment(newSubComment, dispatch);
        setReply(false);
        getPostDetail(post.post_id, dispatch, navigate);
    }
    return (
        post ? (
            <div className="post-detail">   
                        <div className='question-content-detail'>
                            <span>
                                <img src={post?.avatar ? post?.avatar : avt} alt="avatar" />
                                <h3 className='id-his'>{post.email}</h3>
                                <i className='time-post'>đã đăng vào {post.time}</i>
                            </span>
                            <p>Câu hỏi: <h4>{post.content}</h4></p>
                            <a href="#!" className='reply-post' onClick={() => setAnswer(!answer)}>Trả lời</a>
                        </div>
                        { answer ? (
                        <div className='rep-question'>
                            <input type="text" placeholder='Trả lời' onChange={e => {
                                setComment(e.target.value);
                                setPostId(post.post_id);
                            }}/>
                            <a href="#!" onClick={handleAddComment}>Gửi</a>
                        </div>
                        ) : Fragment
                        }
                        <ul className='list-comment'>
                            {post.comment?.map((comment, index) => {
                                return(
                                    <div key={index}>
                                        <dl className='comment-his' key={index}>
                                            <div className='comment'>
                                                <span>
                                                    <h5>{comment.email}</h5>
                                                    <i className='time-comment'>đã trả lời vào {comment.time}</i>
                                                </span>
                                                <p>{comment.content}</p>
                                            </div>
                                            <a href="#!" className='reply-comment' onClick={() => {
                                                setReply(!reply)
                                                setPostId(comment.comment_id);
                                            }}>Phản hồi</a>
                                            { (reply && (comment.comment_id === postId)) ? (
                                                <div className='rep-cmt'>
                                                    <input type="text" placeholder='Phản hồi' onChange={e => {
                                                        setComment(e.target.value);
                                                        setPostId(comment.comment_id);
                                                    }}/>
                                                    <a href="#!" onClick={handleAddSubComment}>Gửi</a>
                                                </div>
                                                    ) : Fragment
                                                    }
                                            <div className='sub-cmts'>
                                            {comment.sub_comment?.map((subcmt, index) => {
                                                return(
                                                <dt key={index}>
                                                    <div className='sub-cmt'>
                                                        <span>
                                                            <h5>{subcmt.email}</h5>
                                                            <i className='time-subcmt'>đã phản hồi vào {subcmt.time}</i>
                                                        </span>
                                                        <p>{subcmt.content}</p> 
                                                    </div>
                                                </dt>
                                                )
                                            })
                                            }
                                            </div>
                                        </dl>
                                    </div>
                                    )
                                })}
                        </ul>
        </div>
        ) : (Fragment)
    )
}
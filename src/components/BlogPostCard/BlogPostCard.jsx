import { useEffect, useState } from 'react';
import { starPost, unstarPost, getPostById } from '../../utilities/posts-api';
import greyStarIcon from '../../icons/greystar.png'
import starIcon from '../../icons/star.png'
export default function BlogPostCard({ post, loggedInUser, setPost }) {

    const handleStarPost = async (postId) => {
        try {
            await starPost(postId);
            const updatedPost = await getPostById(postId);
            setPost(updatedPost);
        } catch (err) {
            console.log(err);
        }
    };

    const handleUnstarPost = async (postId) => {
        try {
            await unstarPost(postId);
            const updatedPost = await getPostById(postId);
            setPost(updatedPost);
        } catch (err) {
            console.log(err);
        }
    };

    const [postIsStarred, setPostIsStarred] = useState(loggedInUser?._id && post.stars.includes(loggedInUser?._id));
    const [numStars, setNumStars] = useState(post.numStars);

    useEffect(() => {
        setPostIsStarred(loggedInUser?._id && post.stars.includes(loggedInUser?._id));
    }, [post, loggedInUser?._id]);

    useEffect(() => {
        setNumStars(post.numStars);
    }, [post]);


    return (
        <>
            <div key={post._id} className="info-card">
                <h2>
                    {post.title}
                </h2>
                
                <div className="post-info">
                    <h3>By: {post.author.name}</h3>
                    <p>Written on: {new Date(post.dateCreated).toLocaleDateString()}</p>
                    
                    <div className="star-info">
                        {loggedInUser && <img
                            src={!postIsStarred ? greyStarIcon : starIcon}
                            className="star-icon"
                            alt="Star"
                            onClick={!postIsStarred ? () => handleStarPost(post._id) : () => handleUnstarPost(post._id)}
                        />}
                        <span className="num-stars">{numStars} star{numStars !== 1 ? "s" : ""}</span>
                    </div>
                    <p>{post.article}</p>
                </div>
            </div>
        </>
    )
}
import { useState, useEffect, useContext } from "react";
import { TitleContext } from "../../components/TitleBar/TitleContext";
import { useParams } from "react-router-dom";
import AddCommentForm from '../../components/CommentSection/AddCommentForm';
import CommentDisplaySection from '../../components/CommentSection/CommentDisplaySection';
import { getCommentsOn } from "../../utilities/comments-api";
import { getSideEssay } from "../../utilities/essays-service";

export default function SideEssayDetailPage(){
    const [sideEssay, setSideEssay]= useState(null);
    const {essayId} = useParams();

    useEffect(() =>{
            async function fetchSideEssay(){
                try{
                const response = await getSideEssay(essayId);
                console.log("Response:", response);
                if(!response.error){
                    setSideEssay(response.data);
                }
                }catch(err){
                    console.log("Error fetching side essay: ", err);
                }
            }
            fetchSideEssay();
        }
    , [essayId]);

    const { setTitle } = useContext(TitleContext);
    useEffect(() => {
        if(sideEssay)setTitle(sideEssay.title);
    }, [setTitle, sideEssay]);

    const [comments, setComments] = useState([]);
    useEffect(() => {
        const fetchPostComments = async () => {
          try {
            if (sideEssay) {
              const tempComments = await getCommentsOn("Essay", sideEssay._id);
              if (tempComments) {
                setComments(tempComments);
              }
            }
          } catch (error) {
          }
        };
    
        fetchPostComments();
      }, [sideEssay]);
    
    const handleNewComment = (newComment) => {
        setComments(prevComments => [...prevComments, newComment]);
      };
    
    return (
        <>{sideEssay &&
            <>
            <div dangerouslySetInnerHTML={{__html: sideEssay.bodyHTML}}/>
            <CommentDisplaySection comments={comments} />
            <AddCommentForm entity={sideEssay} entityType='Essay' onNewComment={handleNewComment} />
            </>}
        </>
    );
}
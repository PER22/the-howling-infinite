import { useEffect, useState, useContext } from "react";
import { TitleContext } from "../../components/TitleBar/TitleContext";
import { getBlogPostPreviews } from "../../utilities/blog-service";
import { getMainEssayPreview } from "../../utilities/essays-service";
import { getSideEssayPreviews } from "../../utilities/essays-service";
import ContentPreviewCard from "../../components/ContentPreviewCard/ContentPreviewCard";
import FeedbackMessage from '../../components/FeedbackMessage/FeedbackMessage';



export default function HomePage() {
  const { setTitle } = useContext(TitleContext);
  useEffect(() => {
    setTitle('The-Howling-Infinite.com');
  }, [setTitle]);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [mainEssay, setMainEssay] = useState(null);
  useEffect(() => {
    async function fetchMainEssay() {
      try {
        const response = await getMainEssayPreview();
        console.log("recievedMainEssay: ", response);
        if (!response.error) { 
          setMainEssay(response.data); 
        }else{
          setError(response.error);
        }
      } catch (err) {
        console.log("Error fetching main essay: ", err);
      }
    }
    fetchMainEssay();
  }, []);

  const [sideEssays, setSideEssays] = useState([]);
  useEffect(() => {
    async function fetchSideEssays() {
      try {
        const response = await getSideEssayPreviews();
        if (!response.error) { 
          setSideEssays(response.data); 
        }
        else{
          setError(response.error);
        }
      } catch (err) {
        console.log("Error fetching side essays: ", err);
      }
    }
    fetchSideEssays();
  }, []);

  const [blogPosts, setBlogPosts] = useState([]);
  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        const response = await getBlogPostPreviews();
        if (!response.error) { setBlogPosts(response.data); }
        else{
          setError(response.error);
        }
      } catch (err) {
        console.log("Error fetching blog posts: ", err);
      }
    }
    fetchBlogPosts();
  }, []);


  return (<>
    <p id="intro-paragraph" className="content-card">
      Welcome to a unique exploration into the mind of Lee Oswald, set against the backdrop of one of the most pivotal moments in American history.
      Crafted with cinematic precision, this multimedia experience integrates film directions, images, and music, inviting you into a profound psychological narrative.
      Written by licensed clinical psychologist Dr. Gene Riddle, these pieces delve deep into Oswald's psyche, offering a nuanced understanding of the man behind the headlines.
      It's not a recounting of those events, but rather a journey into the complexities of Oswald's life, behavior, and motivations.
    </p>

    <p>If you're new here, begin with the main piece, titled “Lee Oswald’s Quest for a Howling Infinite”, to immerse yourself in the central narrative.
      For deeper insights into specific facets of the subject matter, the side essays provide further exploration.
      And for ongoing reflections and discussions, the blog offers a space for continued engagement. </p>

    <p>Feel free to leave comments, and "star" content you enjoyed.
      Thank you for joining us in this immersive experience, and for choosing to see history through a psychological lens.
    </p>
    <div id="card-container" className="content-card">
      {mainEssay && <ContentPreviewCard content={mainEssay} />}
      {sideEssays.map(essay => (
        <ContentPreviewCard key={essay._id} content={essay} type={"essay"} />
      ))}
      {blogPosts.map(post => (
        <ContentPreviewCard key={post._id} content={post} type={"blog"} />
      ))}

    </div>
    <FeedbackMessage error={error} message={message} />
  </>);
}

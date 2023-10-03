import { useEffect, useState, useContext } from "react";
import { TitleContext } from "../../components/TitleBar/TitleContext";
import sendRequest from "../../utilities/send-request";
import ContentPreviewCard from "../../components/ContentPreviewCard/ContentPreviewCard";

export default function SideEssaysIndexPage(){
    const [sideEssays, setSideEssays] = useState([]);
    
    useEffect(()=>{
      async function fetchSideEssays(){
        try {
          const recievedSideEssays = await sendRequest('/api/essays/sideEssayPreviews');
          if(recievedSideEssays){setSideEssays(recievedSideEssays);}
        } catch(err){
          console.log("Error fetching side essays: ", err);
        }
      }
      fetchSideEssays();
    }, []);
    
    const { setTitle } = useContext(TitleContext);
    useEffect(() => {
        setTitle('Side Essays');
    }, [setTitle]);

    return (<>
        <>  
            <section id="card-container">
              {(sideEssays.length > 0) && sideEssays.map(essay => (
              <ContentPreviewCard key={essay._id} content={essay} />
              ))}
            </section>
        </>
    </>);
}
import { useEffect, useState, useContext } from "react";
import { TitleContext } from "../../components/TitleBar/TitleContext";
import ContentPreviewCard from "../../components/ContentPreviewCard/ContentPreviewCard";
import { getSideEssayPreviews } from "../../utilities/essays-service";

export default function SideEssaysIndexPage(){
    const [sideEssays, setSideEssays] = useState([]);
    
    useEffect(()=>{
      async function fetchSideEssays(){
        try {
          const recievedSideEssays = await getSideEssayPreviews();
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
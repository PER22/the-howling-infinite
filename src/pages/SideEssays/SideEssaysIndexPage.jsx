import { useEffect, useState } from "react";
import sendRequest from "../../utilities/send-request";
import EssayPreviewCard from "../../components/EssayPreviewCard/EssayPreviewCard";
import TitleBar from "../../components/TitleBar/TitleBar";

export default function SideEssaysIndexPage(){
    const [sideEssays, setSideEssays] = useState([]);
    useEffect(()=>{
      async function fetchSideEssays(){
        try {
          const recievedSideEssays = await sendRequest('/api/essays/sideEssays');
          if(recievedSideEssays){setSideEssays(recievedSideEssays);}
        } catch(err){
          console.log("Error fetching side essays: ", err);
        }
      }
      fetchSideEssays();
    }, []);
  
    return (<>
        <>  
            <TitleBar title={"Side Essays"}/>
            <section id="main">
              {sideEssays.map(essay => (
              <EssayPreviewCard key={essay._id} essay={essay} />
              ))}
            </section>
        </>
    </>);
}
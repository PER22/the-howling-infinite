import { useEffect, useState } from "react";
import sendRequest from "../../utilities/send-request";
import EssayPreviewCard from "../../components/EssayPreviewCard/EssayPreviewCard";

export default function SideEssaysIndexPage(){
    const [sideEssays, setSideEssays] = useState([]);
    useEffect(()=>{
      async function fetchSideEssays(){
        try {
          const recievedSideEssays = await sendRequest('/api/essays/sideEssays');
          if(recievedSideEssays){setSideEssays(recievedSideEssays);}
          // console.log("Side Essays via HomePage.jsx:", recievedSideEssays);
        } catch(err){
          console.log("Error fetching side essays: ", err);
        }
      }
      fetchSideEssays();
    }, []);
  
    return (<>
        <div>
            {sideEssays.map(essay => (
            <EssayPreviewCard key={essay._id} essay={essay} />
            ))}
        </div>
    </>);
}
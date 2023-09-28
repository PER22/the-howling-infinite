import { useEffect, useState, useContext } from "react";
import { TitleContext } from "../../components/TitleBar/TitleContext";
import sendRequest from "../../utilities/send-request";
import EssayPreviewCard from "../../components/EssayPreviewCard/EssayPreviewCard";

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
    
    const { setTitle } = useContext(TitleContext);
    useEffect(() => {
        setTitle('Side Essays');
    }, [setTitle]);

    return (<>
        <>  
            <section id="main">
              {sideEssays.map(essay => (
              <EssayPreviewCard key={essay._id} essay={essay} />
              ))}
            </section>
        </>
    </>);
}
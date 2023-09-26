import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import sendRequest from "../../utilities/send-request";
import TitleBar from "../../components/TitleBar/TitleBar";
export default function SideEssayDetailPage(){
    const [sideEssay, setSideEssay]= useState(null);
    const {essayId} = useParams();

    useEffect(() =>{
            async function fetchSideEssay(){
                try{
                const response = await sendRequest(`/api/essays/${essayId}`);
                if(response){
                    setSideEssay(response);
                }
                }catch(err){
                    console.log("Error fetching side essay: ", err);
                }
            }
            fetchSideEssay();
        }
    , []);
    return (
        <>{sideEssay &&
            <>
             <TitleBar title={sideEssay.title}/>
            <div dangerouslySetInnerHTML={{__html: sideEssay.bodyText}}/>
            </>}
        </>
    );
}
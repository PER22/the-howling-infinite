import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import sendRequest from "../../utilities/send-request";
export default function SideEssayDetailPage(){
    const [sideEssay, setSideEssay]= useState(null);
    const {essayId} = useParams();

    useEffect(() =>{
            async function fetchSideEssay(){
                try{
                const response = await sendRequest(`/api/essays/${essayId}`);
                console.log(response);
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
            <h1>{sideEssay.title}</h1>
            <div dangerouslySetInnerHTML={{__html: sideEssay.bodyText}}/>
            </>}
        </>
    );
}
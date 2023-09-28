import { useState, useEffect, useContext } from "react";
import { TitleContext } from "../../components/TitleBar/TitleContext";
import { useParams } from "react-router-dom";
import sendRequest from "../../utilities/send-request";

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
    , [essayId]);
    const { setTitle } = useContext(TitleContext);
    useEffect(() => {
        if(sideEssay)setTitle(sideEssay.title);
    }, [setTitle, sideEssay]);
    
    return (
        <>{sideEssay &&
            <>
            <div dangerouslySetInnerHTML={{__html: sideEssay.bodyText}}/>
            </>}
        </>
    );
}
import React, {useState, useEffect, useContext} from 'react';
import { TitleContext } from '../../components/TitleBar/TitleContext';
import sendRequest from '../../utilities/send-request';
import "./ReadMainEssayPage.css"


export default function ReadMainEssayPage(){
    const { setTitle } = useContext(TitleContext);
    const [mainEssay, setMainEssay] = useState(null);
    
    const [error, setError] = useState('');

    useEffect(() => {
        if(mainEssay) { setTitle(mainEssay.title);}
    }, [setTitle, mainEssay]);

    useEffect(()=>{
        async function fetchMainEssay(){
            try{
                const mainEssay = await sendRequest(`/api/essays/mainEssay`);
                setMainEssay(mainEssay);
                if (mainEssay){
                    setError("");
                }else{
                    setError('Essay not found');
                }
            }catch(err){
                setError('Failed to fetch main essay.')
            }
        }
        fetchMainEssay();
    },[]);

    
    return (<>
        <div className='article-container'>
            {mainEssay ? (<>
                    <div dangerouslySetInnerHTML={{__html: mainEssay.bodyHTML}}></div>
                </>
            ) : (
                <p>Loading...</p>
            )}
            {error && <p className='error-message'>{error}</p>}
        </div>
    </>);
}
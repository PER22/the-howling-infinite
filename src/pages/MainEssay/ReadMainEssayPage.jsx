import React, {useState, useEffect, useContext} from 'react';
import { TitleContext } from '../../components/TitleBar/TitleContext';
import parse from'html-react-parser';
import sendRequest from '../../utilities/send-request';
import Footnote from '../../components/Footnote/Footnote';
import "./ReadMainEssayPage.css"

const options = {
    replace: ({ attribs }) => {
      if (attribs && attribs['data-footnote-content'] && attribs['data-footnote-number']) {
        return <Footnote content={attribs['data-footnote-content']} number={attribs['data-footnote-number']}/>;
      }
    }
  };


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

    
    return (
        <div className='article-container'>
            {mainEssay ? (
                <>
                    {parse(mainEssay.bodyHTML, options)}
                </>
            ) : (
                <p>Loading...</p>
            )}
            {error && <p className='error-message'>{error}</p>}
        </div>
    );
}
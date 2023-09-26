import React, {useState, useEffect} from 'react';
import sendRequest from '../../utilities/send-request';
import TitleBar from '../../components/TitleBar/TitleBar';

export default function ReadMainEssayPage(){
    const [essay, setMainEssay] = useState(null);
    const [error, setError] = useState('');

    useEffect(()=>{
        async function fetchMainEssay(){
            try{
                const mainEssay = await sendRequest('/api/essays/mainEssay');
                if (mainEssay && mainEssay.bodyText){
                    setMainEssay(mainEssay);
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
        <div>
            {essay ? (<>
                <TitleBar title={essay.title}/>
                <div>
                    {/* <p>By: {essay.author.name}</p>  Assuming the author object has a name property */}
                    <div className='article-container' dangerouslySetInnerHTML={{ __html: essay.bodyText }} />
                </div>
                </>
            ) : (
                <p>Loading...</p>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    </>);
}
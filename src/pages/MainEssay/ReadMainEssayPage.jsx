import React, {useState, useEffect} from 'react';
import sendRequest from '../../utilities/send-request';

export default function ReadMainEssayPage(){
    const [essay, setMainEssay] = useState(null);
    const [error, setError] = useState('');

    useEffect(()=>{
        async function fetchMainEssay(){
            try{
                const mainEssay = await sendRequest('/api/essays/mainEssay');
                console.log(mainEssay);
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
            {essay ? (
                <div>
                    <h2>{essay.title}</h2>
                    {/* <p>By: {essay.author.name}</p>  Assuming the author object has a name property */}
                    <div dangerouslySetInnerHTML={{ __html: essay.bodyText }} />
                </div>
            ) : (
                <p>Loading...</p>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    </>);
}
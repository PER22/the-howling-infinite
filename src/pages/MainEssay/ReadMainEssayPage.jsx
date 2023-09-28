import React, {useState, useEffect, useContext} from 'react';
import { TitleContext } from '../../components/TitleBar/TitleContext';
import sendRequest from '../../utilities/send-request';

export default function ReadMainEssayPage(){
    const { setTitle } = useContext(TitleContext);
    const [essay, setMainEssay] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if(essay) { setTitle(essay.title);}
    }, [setTitle, essay]);

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
import { useContext, useEffect } from 'react';
import { TitleContext } from '../../components/TitleBar/TitleContext';

export default function AboutPage() {
    const { setTitle } = useContext(TitleContext);
    useEffect(() => {
        setTitle('About Dr. Gene Riddle');
    }, [setTitle]);
    return (<>
        <>
            <p className='about-info'>Gene Riddle was in the fall term of his senior year at a county high school just outside Washington DC at the time of the deaths of John Kennedy, J. D. Tippit, and Lee Oswald.</p>
            <p className='about-info'>He is a licensed clinical psychologist in California, with a 1997 PhD from the San Francisco campus of the Professional School of Psychology, and has practiced in both inpatient and outpatient settings.</p>
            <p className='about-info'>Prior to entering the mental health profession, he attained BA and MA degrees in Political Science and was an instructor for some undergraduate courses in that field at the Denver campus of the University of Colorado.</p>
        </>
    </>);
}
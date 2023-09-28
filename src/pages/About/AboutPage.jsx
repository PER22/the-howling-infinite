import { useContext, useEffect } from 'react';
import { TitleContext } from '../../components/TitleBar/TitleContext';
import './AboutPage.css';

export default function AboutPage(){
    const { setTitle } = useContext(TitleContext);
    useEffect(() => {
        setTitle('About Dr. Gene Riddle');
    }, [setTitle]);
    return (<>
        <section className="main-content">
        <p>Gene Riddle is a cool dude, who likes psychology, cats, and the History Channel.</p>
        </section>
    </>);
}
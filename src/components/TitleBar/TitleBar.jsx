import { useContext } from 'react';
import { TitleContext } from './TitleContext';
import './TitleBar.css'

export default function TitleBar(){
    const { title } = useContext(TitleContext);
    return (
        <div id="title-bar">
            {title}
        </div>
    );
}
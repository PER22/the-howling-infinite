import { useEffect, useContext } from "react";
import { TitleContext } from "../../components/TitleBar/TitleContext";

export default function ContactPage(){
    const { setTitle } = useContext(TitleContext);
    useEffect(() => {
        setTitle('Contact Information');
    }, [setTitle]);
    return (
        <p className="contact-info">If you would like to, you may email me regarding these works at <em>OswaldPortrait@gmail.com </em></p>
    );
}
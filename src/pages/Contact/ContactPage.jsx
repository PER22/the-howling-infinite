import { useEffect, useContext } from "react";
import { TitleContext } from "../../components/TitleBar/TitleContext";
import ContactForm from "../../components/ContactForm/ContactForm";
import './ContactPage.css'

export default function ContactPage() {
    const { setTitle } = useContext(TitleContext);
    useEffect(() => {
        setTitle('Contact the Author');
    }, [setTitle]);
    return (
        <>
            <div className="contact-info">
                <p>If you would like to, you may email me regarding these works at <em>OswaldPortrait@gmail.com</em>, or send me an email from this form. Your account information will be attached to it.</p>
                <ContactForm />
            </div>
            
        </>
    );
}
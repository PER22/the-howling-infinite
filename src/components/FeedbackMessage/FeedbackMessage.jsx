export default function FeedbackMessage({error, message}){
return (<>
        {message && <p className='success-message'>{message}</p>}
        {error && <p className="error-message">{error}</p>}
    </>);
}
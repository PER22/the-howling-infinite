export default function ConfirmationModal({closeFunction, deleteFunction, confirmationText, contentId}){
    const handleDelete = async (id) => {
        await deleteFunction(id);
      };
    return (
        <div className="confirmation-modal-background">
            <div className="confirmation-modal-container">
                <div className="confirmation-modal-title">
                    <h1>Confirm Delete?</h1>
                </div>
                <div className="confirmation-modal-body">
                    <p>{confirmationText}</p>
                </div>
                <div className="confirmation-modal-footer">
                    <button className="modal-button cancel-button" onClick={closeFunction}>Cancel</button>
                    <button className="modal-button delete-button" onClick={()=> handleDelete(contentId)}>Delete</button>
                </div>
            </div>
        </div>
    );

}
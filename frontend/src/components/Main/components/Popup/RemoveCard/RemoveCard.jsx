import Popup from "../Popup";

function ConfirmDeletePopup({ isOpen, onClose, onConfirm }) {
  function handleSubmit(event) {
    event.preventDefault();
    onConfirm();
    onClose();
  }

  return (
    <Popup
      title="Tem certeza?"
      isOpen={isOpen}
      onClose={onClose}
      customOverlayClass="popupconfirmation__overlay"
    >
      <div className="popupconfirmation__content">
        <form onSubmit={handleSubmit} className="popupconfirmation__form">
          <button type="submit" className="popupconfirmation__button">
            Sim
          </button>
        </form>
      </div>
    </Popup>
  );
}

export default ConfirmDeletePopup;

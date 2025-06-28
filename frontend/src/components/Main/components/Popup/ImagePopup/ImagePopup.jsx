import { useEffect } from "react";
import closeIcon from "../../../../../images/CloseIcon.svg";

function ImagePopup({ card, onClose }) {
  const isOpen = Boolean(card);

  useEffect(() => {
    function handleEscClose(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscClose);
    }

    return () => {
      document.removeEventListener("keydown", handleEscClose);
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={`imagepopup ${isOpen ? "imagepopup_opened" : ""}`}
      role="dialog"
      aria-hidden={!isOpen}
    >
      <div className="imagepopup__overlay">
        <button
          className="imagepopup__close-button"
          onClick={onClose}
          aria-label="Fechar visualização da imagem"
        >
          <img
            className="imagepopup__close-icon"
            src={closeIcon}
            alt="ícone de fechar"
          />
        </button>
        {card && (
          <>
            <img
              className="imagepopup__image"
              src={card.link}
              alt={card.name || "Imagem ampliada"}
            />
            <p className="imagepopup__title">{card.name}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default ImagePopup;

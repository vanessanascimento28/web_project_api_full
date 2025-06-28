import closeIcon from "../../../images/CloseIcon.svg";
import sucessIcon from "../../../images/sucessicon.svg";
import errorIcon from "../../../images/erroricon.svg";

function InfoTooltip({ isOpen, onClose, isSuccess, message }) {

  return (
    <div className={`infotooltip ${isOpen ? "infotooltip_opened" : ""}`}>
      <div className="infotooltip__overlay">
      <button
          className="infotooltip__close-button"
          type="button"
          onClick={onClose}>
       <img
            className="infotooltip__close-icon"
            src={closeIcon}
            alt="ícone de fechar"
          />
        </button>
      <div className="infotooltip__container">
        <img
          className="infotooltip__icon"
          src={isSuccess ? sucessIcon : errorIcon}
          alt={isSuccess ? "Sucesso" : "Erro"}
        />
        <p className="infotooltip__message">{message}</p>
      </div>
      </div>
    </div>
  );
}

export default InfoTooltip;

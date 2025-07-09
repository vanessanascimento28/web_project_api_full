import { useState, useEffect } from "react";
import Popup from "../Popup/Popup";

function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");

  const [nameError, setNameError] = useState("");
  const [aboutError, setAboutError] = useState("");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName("");
      setAbout("");
      setNameError("");
      setAboutError("");
      setIsValid(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const nameValid = name.length >= 2 && name.length <= 40;
    const aboutValid = about.length >= 2 && about.length <= 200;

    setNameError(
      nameValid || name === "" ? "" : "O nome deve ter entre 2 e 40 caracteres."
    );
    setAboutError(
      aboutValid || about === ""
        ? ""
        : "A descrição deve ter entre 2 e 200 caracteres."
    );

    setIsValid(nameValid && aboutValid);
  }, [name, about]);

  function handleSubmit(event) {
    event.preventDefault();
    onUpdateUser({ name, about });
    onClose();
  }

  return (
    <Popup title="Editar Perfil" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="popup__form" name="popup-form">
        <div className="popup__target">
          <input
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength="40"
            minLength="2"
            className="popup__input popup__input-error"
            type="text"
            placeholder="Nome"
          />
          <span className="error__message" id="name-error">
            {nameError}
          </span>
        </div>
        <div className="popup__target">
          <input
            id="about"
            name="about"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            required
            maxLength="200"
            minLength="2"
            className="popup__input popup__input-error"
            type="text"
            placeholder="Sobre mim"
          />
          <span className="error__message" id="about-error">
            {aboutError}
          </span>
        </div>
        <button
          className={`popup__save-button ${!isValid ? "error__button" : ""}`}
          type="submit"
          disabled={!isValid}
        >
          Salvar
        </button>
      </form>
    </Popup>
  );
}

export default EditProfilePopup;

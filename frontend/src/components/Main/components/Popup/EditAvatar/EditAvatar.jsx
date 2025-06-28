import { useRef, useContext, useEffect, useState } from "react";
import closeIcon from "../../../../../images/CloseIcon.svg";
import CurrentUserContext from "../../../../../contexts/CurrentUserContext";

function EditAvatar({ isOpen, onClose }) {
  const { handleUpdateAvatar } = useContext(CurrentUserContext);
  const inputRef = useRef();

  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.value = "";
      setIsValid(false);
      setErrorMessage("");
    }
  }, [isOpen]);

  function handleChange() {
    const input = inputRef.current;

    if (input.validity.valid) {
      setIsValid(true);
      setErrorMessage("");
    } else {
      setIsValid(false);
      setErrorMessage("Insira um link de imagem válido.");
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    const avatarLink = inputRef.current.value;

    handleUpdateAvatar(avatarLink)
      .then(() => {
        onClose();
      })
      .catch((err) => console.error("Erro ao atualizar avatar:", err));
  }

  return (
    <div
      className={`popupprofilepicture ${
        isOpen ? "popupprofilepicture_opened" : ""
      }`}
    >
      <div className="popupprofilepicture__overlay">
        <button className="popupprofilepicture__close-button" onClick={onClose}>
          <img
            className="popupprofilepicture__icon"
            src={closeIcon}
            alt="duas retas cruzadas formando X"
          />
        </button>
        <div className="popupprofilepicture__content">
          <h5 className="popupprofilepicture__title">
            Alterar a foto do perfil
          </h5>
          <form
            id="popupprofilepicture-form"
            className="popupprofilepicture__form"
            name="popupprofilepicture-form"
            onSubmit={handleSubmit}
          >
            <div className="popupprofilepicture__target">
              <input
                ref={inputRef}
                id="linkprofile-picture"
                required
                className="popupprofilepicture__input popupprofilepicture__input-error"
                type="url"
                placeholder="Insira um link de imagem aqui"
                onChange={handleChange}
              />
              <span className="error__message" id="local-error">
                {errorMessage}
              </span>
            </div>
            <button
              className={`popupprofilepicture__save-button ${
                !isValid ? "error__button" : ""
              }`}
              type="submit"
              disabled={!isValid}
            >
              Salvar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditAvatar;

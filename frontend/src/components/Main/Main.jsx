import { useState, useContext } from "react";
import profileImage from "../../images/profileimage.jpg";
import editIcon from "../../images/IconeCanetaEditor.svg";
import buttonIcon from "../../images/IconeCanetaVector.svg";
import addButton from "../../images/IconeAddButton.svg";
import Card from "./components/Card/Card";
import NewCard from "./components/Popup/NewCard/NewCard";
import ImagePopup from "./components/Popup/ImagePopup/ImagePopup";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function Main({
  handleEditUserPopup,
  handleDeleteCard,
  handleOpenAddCard,
  handleCloseAddCard,
  isAddCardOpen,
  handleOpenEditAvatar,
  handleCardLike,
  cards,
  onAddPlaceSubmit,
}) {
  const { currentUser } = useContext(CurrentUserContext);
  const hasCards = cards && cards.length > 0;

  const [selectedCard, setSelectedCard] = useState(null);

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleCloseImagePopup() {
    setSelectedCard(null);
  }

  return (
    <main className="content">
      <div className="content__profile">
        <div className="content__profile-wrapper">
          <img
            className="content__profile-image"
            src={currentUser.avatar || profileImage}
            alt="Senhor de cabelos brancos sorrindo, ele veste um gorro vermelho e camiseta azul, ao fundo é possível ver o mar levemente desfocado"
          />
          <button className="content__editbtn" onClick={handleOpenEditAvatar}>
            <img
              className="content__edit-icon"
              src={editIcon}
              alt="ícone de edição"
            />
          </button>
        </div>
        <div className="content__text">
          <div className="content__text-square">
            <h1 className="content__text-name">{currentUser.name}</h1>
            <button className="content__button" onClick={handleEditUserPopup}>
              <img
                className="content__button-icon"
                src={buttonIcon}
                alt="lápis branco"
              />
            </button>
          </div>
          <p className="content__text-description">{currentUser.about}</p>
        </div>
        <button className="content__addbutton" onClick={handleOpenAddCard}>
          <img
            className="content__addbutton-icon"
            src={addButton}
            alt="sinal de mais"
          />
        </button>
        <NewCard
          isOpen={isAddCardOpen}
          onClose={handleCloseAddCard}
          onAddPlaceSubmit={onAddPlaceSubmit}
        />
      </div>

      {hasCards && (
        <ul className="cards-list">
          {cards.map((card) => (
            <Card
              key={card._id}
              card={card}
              handleDeleteCard={handleDeleteCard}
              handleCardLike={handleCardLike}
              onCardClick={handleCardClick}
            />
          ))}
        </ul>
      )}

      <ImagePopup card={selectedCard} onClose={handleCloseImagePopup} />
    </main>
  );
}

export default Main;

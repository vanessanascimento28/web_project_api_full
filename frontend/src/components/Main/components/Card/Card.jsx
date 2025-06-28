import { useContext } from "react";
import trashIcon from "../../../../images/Trash.svg";
import infoIcon from "../../../../images/Vectorheart.svg";
import blackHeartIcon from "../../../../images/BlackHeart.svg";
import CurrentUserContext from "../../../../contexts/CurrentUserContext";

function Card({ card, handleDeleteCard, handleCardLike, onCardClick }) {
  const currentUser = useContext(CurrentUserContext);

  const isOwn = card.owner?._id === currentUser._id;

  const isLiked = card.isLiked;

  const cardLikeButtonClassName = `card__like-button ${
    isLiked ? "card__like-button_is-active" : ""
  }`;

  function handleDeleteClick() {
    handleDeleteCard(card);
  }

  function handleLikeClick() {
    handleCardLike(card);
  }

  function handleImageClick() {
    onCardClick(card);
  }

  return (
    <li className="card__content">
      <img
        className="card__image"
        src={card.link}
        alt={card.name}
        onClick={handleImageClick}
      />
      {isOwn && (
        <img
          className="card__trash-icon"
          src={trashIcon}
          alt="ícone de lixeira"
          onClick={handleDeleteClick}
        />
      )}
      <div className="card__info">
        <p className="card__info-title">{card.name}</p>
        <button
          className={cardLikeButtonClassName}
          onClick={handleLikeClick}
          type="button"
          aria-label="Curtir"
        >
          <img
            className="card__info-icon"
            src={isLiked ? blackHeartIcon : infoIcon}
            alt="ícone de curtir"
          />
        </button>
      </div>
    </li>
  );
}

export default Card;

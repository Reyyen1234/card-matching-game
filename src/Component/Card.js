import React from 'react';
import './style.css';

function Card({ card, handleChoice, flipped, removing, disabled }) {
 // Kart tıklama olayını yönet
  const handleClick = () => {
    if (!disabled) { // Oyun devre dışı değilse seçimi işleyin
      handleChoice(card); // Uygulamadan HandleChoice işlevini çağırın
    }
  };

  // Render the card
  return (
    <div className={`card ${flipped ? 'flipped' : ''} ${removing ? 'removing' : ''}`}>
      <div className="card-inner">
        <img className="front" src={card.src} alt="card front" />
        <img
          className="back"
          src="/images/cover.jpg"
          onClick={handleClick} // Tıklama olayı işleyicisini ekleyin
          alt="card back"
        />
      </div>
    </div>
  );
}

export default Card;

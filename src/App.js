import React, { useEffect, useState } from 'react'; 
import './App.css'; 
import Card from './Component/Card'; 

// Kart görüntüleri dizisi. Her kartın bir kaynağı ve eşleşen durumu vardır.
const cardImages = [
  { "src": "/images/bardak.png", matched: false },
  { "src": "/images/pencere.png", matched: false },
  { "src": "/images/simit.png", matched: false },
  { "src": "/images/airplane.jpg", matched: false },
  { "src": "/images/bear.jpg", matched: false },
  { "src": "/images/toy.jpg", matched: false },
  { "src": "/images/baby.jpg", matched: false },
  { "src": "/images/yellow_toy.jpg", matched: false }
];

const App = () => {
  // Oyun durumunu yönetmek için durum değişkenleri
  const [cards, setCards] = useState([]); // Mevcut kartları tutar
  const [turns, setTurns] = useState(0); // Alınan dönüş sayısını sayar
  const [choiceOne, setChoiceOne] = useState(null); // İlk kart seçildi
  const [choiceTwo, setChoiceTwo] = useState(null); // İkinci kart seçildi
  const [disabled, setDisabled] = useState(false); // Karşılaştırma sırasında kart tıklamalarını devre dışı bırakır
  const [congratulations, setCongratulations] = useState(false); // Oyuncunun kazanıp kazanmadığını belirtir
  const [score, setScore] = useState(0); // Sıralara göre puan

  // Kartları karıştır ve oyun durumunu sıfırla
  const shuffleCards = () => {
    // Karıştırılmış kartlar dizisi oluştur
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5) // Kartları rastgele karıştır
      .map((card) => ({ ...card, id: Math.random(), removing: false })); // Benzersiz bir unique ID ve varsayılan kaldırma durumu atayın

    // Seçimleri ve durumları sıfırla
    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setTurns(0);
    setCongratulations(false);
    setScore(0); // Puanı sıfırla
  };

  // Kart seçimini yönet
  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

// Seçilen iki kartı karşılaştır
useEffect(() => {
  if (choiceOne && choiceTwo) {
      setDisabled(true); // Diğer kart seçimlerini devre dışı bırakın
      if (choiceOne.src === choiceTwo.src) {
          // Kartlar eşleşirse eşleşme durumunu ayarlayın
          setCards(prevCards =>
              prevCards.map(card =>
                  card.src === choiceOne.src ? { ...card, removing: true } : card // Eşleşen kartları kaldırılmak üzere işaretle
              )
          );

          // Eşleşen kartları bir gecikmeden sonra kaldır
          setTimeout(() => {
              setCards(prevCards => {
                  const newCards = prevCards.filter(card => !card.removing); // Eşleşen kartları diziden kaldır
                  if (newCards.length === 0) {
                      setCongratulations(true); //Tebrik mesajını göster
                      setScore(turns); // Mevcut dönüşlere göre skoru ayarla
                  }
                  return newCards; // Güncellenmiş kart dizisini döndür
              });
          }, 2000); // Patlama efektinin gösterilmesine izin veren gecikme

          resetTurn(); // Dönüşü sıfırla
      } else {
          // Kartlar eşleşmiyorsa bir süre sonra sıfırlayın
          setTimeout(() => resetTurn(), 1000);
      }
  }
}, [choiceOne, choiceTwo]);

  // İlk oluşturmada otomatik olarak yeni bir oyun başlat
  useEffect(() => {
    shuffleCards();
  }, []);

// Seçimleri sıfırla ve dönüşü arttır
const resetTurn = () => {
  setChoiceOne(null);
  setChoiceTwo(null);
  setTurns(prevTurns => prevTurns + 1); // Dönüş sayısını arttır
  setDisabled(false); // Kart seçimlerini yeniden etkinleştir
};

  // Oyunun tekrar oynatılmasını sağlayan fonksiyon
  const handleReplay = () => {
    shuffleCards(); // Oyunu sıfırla
  };

  return (
    <div className="game-container">
      <h1>Kart Eşleştirme Oyunu</h1>
      <button onClick={shuffleCards}>Kartları Karıştır</button>
      <p>Dönüşler: {turns}</p>
      {congratulations && (
        <div className="overlay">
          <div className="congratulations-message">
            Tebrikler! Puanınız: {turns}
          </div>
          <button onClick={handleReplay}>Yeniden Oyna</button> {/* Tekrar oynat düğmesi */}
        </div>
      )}
      <div className="card-grid">
        {cards.map(card => (
          <Card
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
            removing={card.removing} //Kaldırma durumunu Kart bileşenine iletin
            disabled={disabled} // Devre dışı durumunu Kart bileşenine aktarın
          />
        ))}
      </div>
    </div>
  );
};

export default App;

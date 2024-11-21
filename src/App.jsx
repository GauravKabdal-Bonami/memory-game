import { useState, useEffect } from "react";
import "./App.css";

const initialData = [
  { id: 1, name: "H", pic: "A" },
  { id: 2, name: "H", pic: "B" },
  { id: 3, name: "H", pic: "C" },
  { id: 4, name: "H", pic: "D" },
  { id: 5, name: "H", pic: "E" },
  { id: 6, name: "H", pic: "F" },
  { id: 7, name: "H", pic: "A" },
  { id: 8, name: "H", pic: "B" },
  { id: 9, name: "H", pic: "C" },
  { id: 10, name: "H", pic: "D" },
  { id: 11, name: "H", pic: "E" },
  { id: 12, name: "H", pic: "F" },
];

function shuffleData(card) {
  let shuffled = [...card];
  for (let i = shuffled.length - 1; i >= 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function App() {
  const [cards, setCards] = useState(initialData);
  const [moves, setMoves] = useState(0);
  const [misses, setMisses] = useState(0);
  const [revealedCards, setRevealedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [flag, setFlag] = useState(false);
  const getLeastMoves = localStorage.getItem("moves", JSON.stringify(moves));

  useEffect(() => {
    // shuffle array elements on hard refresh
    const shuffleCards = shuffleData(initialData);
    setCards(shuffleCards);
  }, []);

  useEffect(() => {
    if (cards.length === matchedCards.length) {
      if (getLeastMoves > moves) {
        localStorage.setItem("moves", JSON.stringify(moves));
      }
      localStorage.setItem("moves", JSON.stringify(moves));
      setFlag(true);
    }
  }, [moves]);

  // Check for matches when two cards are revealed
  useEffect(() => {
    if (revealedCards.length === 2) {
      const [firstCard, secondCard] = revealedCards;

      if (firstCard.pic === secondCard.pic) {
        // If the cards match, add them to matchedCards
        setTimeout(() => {
          setMatchedCards((prev) => [...prev, firstCard.id, secondCard.id]);
          setMoves((prev) => prev + 1);
        }, 1000);
      } else {
        // If the cards do not match, hide them after a delay
        setTimeout(() => {
          setRevealedCards([]);
        }, 1000);

        // Increment moves and misses
        setMoves((prev) => prev + 1);
        setMisses((prev) => prev + 1);
      }

      // Reset revealed cards after processing
      setTimeout(() => setRevealedCards([]), 1000);
    }
  }, [revealedCards]);

  function matchPic(cardData) {
    // Prevent clicking the same card twice or clicking already matched cards

    if (
      revealedCards.length < 2 &&
      !revealedCards.some((card) => card.id === cardData.id) &&
      !matchedCards.includes(cardData.id)
    ) {
      setRevealedCards((prev) => [...prev, cardData]);
    }
  }

  function restartGame() {
    //shuffle data on re-start
    const shuffleCards = shuffleData(initialData);
    setCards(shuffleCards);
    //clearing all moves, misses and revealCard, matched cards
    setMoves(0);
    setMisses(0);
    setRevealedCards([]);
    setMatchedCards([]);
  }

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Memory Game</h1>
      <div
        style={{
          border: "2px solid blue",
          width: 1000,
          margin: "0 auto",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 10,
          justifyContent: "space-around",
          pointerEvents: moves === 20 && "none",
        }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            style={{
              flexBasis: 230,
              height: 150,
              background: matchedCards.includes(card.id)
                ? "gray"
                : revealedCards.some((c) => c.id === card.id)
                ? "blue"
                : "black",
              border: "2px solid green",
              cursor: "pointer",
              pointerEvents: matchedCards.includes(card.id) && "none",
            }}
            onClick={() => matchPic(card)}
          >
            <h2
              style={{
                color: "white",
                fontSize: 25,
                margin: "50px auto",
                textAlign: "center",
              }}
            >
              {matchedCards.includes(card.id)
                ? "" // Do not show pic or name for matched cards
                : revealedCards.some((c) => c.id === card.id)
                ? card.pic
                : card.name}
            </h2>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, textAlign: "center" }}>
        <h4
          style={{
            display: "inline-block",
            padding: 20,
            border: "1px solid black",
          }}
        >
          Moves: {moves}
        </h4>
        <h4
          style={{
            display: "inline-block",
            padding: 20,
            border: "1px solid black",
            marginLeft: 20,
          }}
        >
          Misses: {misses}
        </h4>
        <h4>least move {getLeastMoves}</h4>
      </div>
      {moves === 20 && (
        <div style={{ marginLeft: 700 }}>
          <h1 style={{ color: "red" }}>
            you have no moves you lost TRY AGAIN!
          </h1>
          <button
            style={{ padding: 20, marginLeft: 190, cursor: "pointer" }}
            onClick={restartGame}
          >
            re-start
          </button>
        </div>
      )}
      {cards.length === matchedCards.length && (
        <h1 style={{ textAlign: "center", color: "green", marginTop: 20 }}>
          Congratulations! You have completed the first level.
        </h1>
      )}
    </>
  );
}

export default App;

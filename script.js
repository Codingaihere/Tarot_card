
/* script.js */

// Tarot deck array with sample cards.
// Ensure your images are in the "cards" folder with correct names.
const tarotDeck = [
  { name: "The Fool", image: "cards/the_fool.jpeg", description: "New beginnings, spontaneity, and a leap of faith." },
  { name: "The Magician", image: "cards/the_magician.jpeg", description: "Manifestation, resourcefulness, and power." },
  { name: "The High Priestess", image: "cards/the_high_priestess.jpeg", description: "Mystery, intuition, and inner wisdom." },
  { name: "The Empress", image: "cards/the_empress.jpeg", description: "Nurturing, abundance, and creativity." },
  { name: "The Emperor", image: "cards/the_emperor.jpeg", description: "Authority, structure, and control." },
  { name: "The Hierophant", image: "cards/the_hierophant.jpeg", description: "Tradition, spirituality, and guidance." },
  { name: "The Lovers", image: "cards/the_lovers.jpeg", description: "Love, harmony, and choices." },
  { name: "The Chariot", image: "cards/the_chariot.jpeg", description: "Willpower, victory, and determination." },
  { name: "Strength", image: "cards/strength.jpeg", description: "Courage, inner strength, and resilience." },
  { name: "The Hermit", image: "cards/the_hermit.jpeg", description: "Introspection, solitude, and wisdom." }
];

document.getElementById('tarot-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const question = document.getElementById('question').value.trim();
  if (!question) return;

  // Hide the form
  document.getElementById('tarot-form-container').classList.add('hidden');

  // Select 3 random cards
  const selectedCards = getRandomCards(3);
  displayCards(selectedCards);

  // After a short delay to allow the animation, call the Gemini Flash 2.0 API for an interpretation
  setTimeout(() => {
    getTarotReading(question, selectedCards);
  }, 1500);
});

// Randomly selects n cards from the tarot deck (without duplicates)
function getRandomCards(n) {
  let deckCopy = [...tarotDeck];
  let cards = [];
  for (let i = 0; i < n; i++) {
    const randomIndex = Math.floor(Math.random() * deckCopy.length);
    cards.push(deckCopy.splice(randomIndex, 1)[0]);
  }
  return cards;
}

// Displays the selected tarot cards with animation
function displayCards(cards) {
  const cardContainer = document.getElementById('card-container');
  cardContainer.innerHTML = ''; // Clear previous cards if any
  cards.forEach((card, index) => {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');
    // Stagger animation for each card
    cardDiv.style.animationDelay = `${index * 0.3}s`;
    const img = document.createElement('img');
    img.src = card.image;
    img.alt = card.name;
    cardDiv.appendChild(img);
    cardContainer.appendChild(cardDiv);
  });
  cardContainer.classList.remove('hidden');
}

// Combines the user's question and the drawn cards into a prompt,
// then calls the Gemini Flash 2.0 API to generate an insightful, mystical interpretation.
function getTarotReading(question, cards, retryCount = 0) {
  const cardNames = cards.map(card => card.name).join(', ');
  const prompt = `You are a mystical tarot reader. A user asked: "${question}". The tarot cards drawn are: ${cardNames}. Provide an insightful, mystical interpretation that connects these cards to the question.`;

  const resultDiv = document.getElementById('result');
  resultDiv.innerText = "The mystical energies are converging... Please wait.";
  resultDiv.classList.remove('hidden');

  fetch("https://api-inference.huggingface.co/models/google/gemini-flash-2.0", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer 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"
    },
    body: JSON.stringify({ inputs: prompt })
  })
  .then(response => {
    if (response.status === 503 && retryCount < 3) {
      // Retry if service is temporarily unavailable
      setTimeout(() => getTarotReading(question, cards, retryCount + 1), 3000);
      return;
    }
    return response.json();
  })
  .then(data => {
    if (!data) return;
    console.log("API Response:", data);
    let generatedText = "";
    if (Array.isArray(data) && data[0] && data[0].generated_text) {
      generatedText = data[0].generated_text;
    } else if (data.error) {
      generatedText = `Error: ${data.error}`;
    } else {
      generatedText = "The mystical energies are quiet today. Try again later.";
    }
    resultDiv.innerText = generatedText;
  })
  .catch(error => {
    console.error(error);
    resultDiv.innerText = "An error occurred while consulting the mystical forces.";
  });
}


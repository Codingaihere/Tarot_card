// Sample tarot deck data (simplified)
// Each card has a name and a basic meaning
const tarotDeck = [
  { name: "The Fool", meaning: "New beginnings, spontaneity, a leap of faith" },
  { name: "The Magician", meaning: "Power, skill, concentration, resourcefulness" },
  { name: "The High Priestess", meaning: "Intuition, mystery, subconscious mind" },
  { name: "The Empress", meaning: "Femininity, beauty, nature, nurturing" },
  { name: "The Emperor", meaning: "Authority, structure, control, fatherhood" },
  { name: "The Hierophant", meaning: "Tradition, conformity, morality" },
  { name: "The Lovers", meaning: "Relationships, love, values alignment" },
  { name: "The Chariot", meaning: "Control, willpower, determination" },
  { name: "Strength", meaning: "Courage, persuasion, influence, compassion" },
  { name: "The Hermit", meaning: "Soul-searching, introspection, being alone" }
  // ... You can add more cards to simulate a fuller deck.
];

// Function to shuffle the deck and pick three cards for a spread.
function drawCards() {
  // Make a copy of the deck
  const deck = [...tarotDeck];
  const drawnCards = [];
  for (let i = 0; i < 3; i++) {
    const randIndex = Math.floor(Math.random() * deck.length);
    drawnCards.push(deck.splice(randIndex, 1)[0]);
  }
  return drawnCards;
}

// Simulate an LLM-generated response using the drawn cards and user's question.
function generateReading(question, cards) {
  // Here you might integrate with an LLM API.
  // For now, we simulate a response:
  let response = `You asked: "${question}".\n\n`;
  response += `The cards reveal insights as follows:\n\n`;
  response += `1. **Past:** ${cards[0].name} - ${cards[0].meaning}.\n`;
  response += `2. **Present:** ${cards[1].name} - ${cards[1].meaning}.\n`;
  response += `3. **Future:** ${cards[2].name} - ${cards[2].meaning}.\n\n`;
  response += `Reflect on these symbols and consider how these energies may be influencing your situation. The tarot invites you to explore your inner truth and make empowered choices.`;
  return response;
}

// Function to create a card element with flip animation
function createCardElement(cardData, delay) {
  const cardElem = document.createElement("div");
  cardElem.classList.add("card");
  cardElem.style.animationDelay = delay + "s";

  // Front face (card back design)
  const frontFace = document.createElement("div");
  frontFace.classList.add("front");
  frontFace.textContent = "Tarot Card";
  cardElem.appendChild(frontFace);

  // Back face (card details)
  const backFace = document.createElement("div");
  backFace.classList.add("back");
  backFace.innerHTML = `<strong>${cardData.name}</strong><br>${cardData.meaning}`;
  cardElem.appendChild(backFace);

  // Add flip animation on click (optional)
  cardElem.addEventListener("click", () => {
    cardElem.classList.toggle("flip");
  });

  return cardElem;
}

// Main function to handle the reading process
function handleReading() {
  const questionInput = document.getElementById("questionInput");
  const question = questionInput.value.trim();
  const readingOutput = document.getElementById("readingOutput");
  const cardContainer = document.getElementById("cardContainer");

  if (!question) {
    alert("Please enter a question.");
    return;
  }

  // Clear previous results
  readingOutput.innerText = "";
  cardContainer.innerHTML = "";

  // Draw three cards
  const cards = drawCards();

  // Create card elements with a slight delay for animation
  cards.forEach((card, index) => {
    const cardElem = createCardElement(card, index * 0.2);
    cardContainer.appendChild(cardElem);
  });

  // Simulate a delay to mimic shuffling/reading before showing the response
  setTimeout(() => {
    const reading = generateReading(question, cards);
    readingOutput.innerHTML = reading.replace(/\n/g, "<br>");
  }, 1200);
}

// Attach event listener to the button
document.getElementById("submitBtn").addEventListener("click", handleReading);

/* ═══════════════════════════════════
   QUOTE WIDGET
════════════════════════════════════ */

const quotes = [
  {
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle",
  },

  {
    text: "First forget inspiration. Habit is more dependable.",
    author: "Octavia Butler",
  },

  {
    text: "Successful people are simply those with successful habits.",
    author: "Brian Tracy",
  },

  {
    text: "Chains of habit are too weak to be felt until they are too strong to be broken.",
    author: "Samuel Johnson",
  },

  {
    text: "Motivation is what gets you started. Habit is what keeps you going.",
    author: "Jim Ryun",
  },

  {
    text: "Small disciplines repeated with consistency every day lead to great achievements.",
    author: "John C. Maxwell",
  },

  {
    text: "The secret of your future is hidden in your daily routine.",
    author: "Mike Murdock",
  },

  {
    text: "Your habits will determine your future.",
    author: "Jack Canfield",
  },

  {
    text: "People do not decide their futures, they decide their habits and their habits decide their futures.",
    author: "F. M. Alexander",
  },

  {
    text: "Discipline is choosing between what you want now and what you want most.",
    author: "Abraham Lincoln",
  },

  {
    text: "The difference between who you are and who you want to be is what you do daily.",
    author: "Unknown",
  },

  {
    text: "Great things are not done by impulse, but by a series of small things brought together.",
    author: "Vincent van Gogh",
  },

  {
    text: "Consistency is harder when no one is clapping for you. You must clap for yourself.",
    author: "Unknown",
  },

  {
    text: "It is never too late to be what you might have been.",
    author: "George Eliot",
  },

  {
    text: "How we spend our days is, of course, how we spend our lives.",
    author: "Annie Dillard",
  },
];

const quoteText = document.getElementById("quote-text");
const quoteRefresh = document.getElementById("quote-refresh");

function generateQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);

  const randomQuote = quotes[randomIndex];

  quoteText.innerHTML = `
    "${randomQuote.text}"
    <span class="quote-author">
      — ${randomQuote.author}
    </span>
  `;
}

quoteRefresh.addEventListener("click", generateQuote);
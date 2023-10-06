const quotes = [
  {
    word: `"All things must pass, only God remains." `,
    author: "- St. Teresa of Avila",
  },
  {
    word: `"Let us love God with all our heart, with all our soul, with all our strength and all our mind."`,
    author: "- St. Luke",
  },
  {
    word: `"The Lord does not delay His promise, as some regard 'delay,' but He is patient with you, not wishing that any should perish but that all should come to repentance." `,
    author: "- St. Peter",
  },
  {
    word: `"Do small things with great love."`,
    author: "- St. Therese of Lisieux",
  },
  {
    word: `"He who is obedient will flourish in the land, and he who is pure will be fed from the hand of the king."`,
    author: "- St. John Chrysostom",
  },
  {
    word: `"The most powerful weapon to conquer the devil is humility. For, as he does not know at all how to employ it, neither does he know how to defend himself from it."`,
    author: "- St. Vincent de Paul",
  },
  {
    word: `"Prayer is the raising of one's mind and heart to God or the requesting of good things from God."`,
    author: "- St. John Damascene",
  },
  {
    word: `"Do not be afraid of anything. You will do marvelous work with the help of God."`,
    author: "- St. John Bosco",
  },
  {
    word: `"We must pray without ceasing and work without tiring, for the bread of the future is the seed of today."`,
    author: "- St. John Bosco",
  },
  {
    word: `"To one who has faith, no explanation is necessary. To one without faith, no explanation is possible."`,
    author: "- St. Thomas Aquinas",
  },
];

// function for quotes randomizer
function quoteRandomizer(quotes) {
  const randomNumber = Math.floor(Math.random() * 10);
  document.getElementById("quotes").innerHTML = quotes[randomNumber].word;
  document.getElementById("author").innerHTML = quotes[randomNumber].author;
}

quoteRandomizer(quotes);

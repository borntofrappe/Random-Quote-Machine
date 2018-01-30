/*
document jquery function to contain three of many things
  - a call to immediately give a quote
  - a click event on the first span to fade out the headers and subsequently get a new quote
  - a click event on the second span to share the quote

all these functions declared subsequently
*/


$(document).ready(function() {
  // once the page has done loading get a new quote immediately
  getQuote();

  // upon clicking on **random**, or its related icon, get a new quote
  // get quote following a slow fade out on the content (getQuote set as a callback function)
  $("#getQuote").on("click", function(){
    $(".content").fadeOut("slow", getQuote);
  });

  // upon clicking on **quote**, or its related icon, give the possibility to share the quote displayed on screen
  // on twitter
  $("#shareQuote").on("click", shareQuote);
});


/*
getQuote function
*/
function getQuote() {
  // create two variables to contain quote text and quote author
  var quoteText, quoteAuthor;

  // use get JSON to call upon the api from the provided url and return the quote in jsonp format
  $.getJSON("https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?", function(jsonp) {
    // console.log(jsonp);
    // store in the declared variables the text and the author of the returned quote
    // this information is found under the object jsonp, in the properties of quoteText and quoteAuthor
    quoteText = jsonp.quoteText;
    quoteAuthor = jsonp.quoteAuthor;

    // check the length of the quote, and get a new quote if this is larger than a specified amount (which cannot be shared according to twitter character limit)
    checkCharLength(quoteText);
    // check the size of the screen, and get a new quote if the quote is too long for the screen size itself
    checkScreenSize(quoteText);
    // set quote, changing the text of the headers with the quote text and author
    setQuote(quoteText, quoteAuthor);
    // fade in quote, which does pretty much what it says
    fadeInQuote();
  });
}


// for quotes longer than 250 get a new quote
function checkCharLength(text) {
  if(text.length >= 250) {
    getQuote();
  }
}
// for screens smaller than 700px and quotes longer than 120 characters get a new quote
function checkScreenSize(text) {
  var screenSize = $(window).width();
  if(screenSize <= 700 && text.length >=  120) {
    getQuote();
  }
}

// set quote text and author according to the values obtained through the api call (and add "Unknown" if the author is missing)
function setQuote(text, author) {
  $(".content h3").text(text);
  if(author == "") {
    author = 'Unknown';
  }
  $(".content h4").text(' - ' + author);
}

// fade in the content and subsequently invoke a function to (possibly) change the color palette of the page
function fadeInQuote() {
  $(".content").fadeIn("slow", changeColorPalette);
}


/*
shareQuote function, to open a new window on the url prompting you to share the quote + author
*/
function shareQuote() {
  var text = "'" + $(".content h3").text() + "'" + $(".content h4").text();
  var url = "https://twitter.com/intent/tweet?hashtags=GiveMeAQuote&text=" + text;
  window.open(url);
}

// change color palette function to apply a color to the 1. fill of svg 2. color of text 3 text shadow of text (color chosen among a set of given possibilities)
function changeColorPalette(){
  // store in an array a number of hard-coded color possibilities
  var brushes = ["#8800AA", "#F44336", "#E91E63", "#673AB7", "#3F51B5", "#009688", "#FF6D00", "#795548", "#546E7A"];
  // store in a variable a random number from 0 up to the length of the array, to consider one of the possible colors (arrays are zero-based indexed)
  var random = Math.floor(Math.random()*brushes.length);
  // console.log(random);
  // store in a variable the array item at the index given by the random number
  var chosenBrush = brushes[random];
  // set the fill property of the svg background to the chosen color
  $(".header svg").css("fill", chosenBrush);
  // set the color and text shadow of the headers to the chocen color
  $(".content").css({
    "color": chosenBrush,
    "text-shadow": "1px 0 " + chosenBrush
  });
}

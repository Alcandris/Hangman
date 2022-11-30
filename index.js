//****************VARIABLES ET CONSTANTES ****************/

const alphabet = [
  "a",
  "z",
  "e",
  "r",
  "t",
  "y",
  "u",
  "i",
  "o",
  "p",
  "q",
  "s",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  "m",
  "w",
  "x",
  "c",
  "v",
  "b",
  "n",
];

let wordArray = [];
let gameArray = [];
let spanArray = [];
// let spanArrayAccent = [];
let mysteryWord = "";
let countTiret = 0;
let countGoodAnswer = 0;
let countWrongAnswer = 8;

//----------------POO-------------
const utils = {
  fetchWords: async function () {
    await fetch("./bdd.json")
      .then((res) => res.json())
      .then((data) => {
        wordArray = data;
      });
  },
  pageContent: function (content, btn) {
    document.querySelector(".app").innerHTML = content;
    document.querySelector(".btn-container").innerHTML = btn;
  },
  isVictory: function (test, test2) {
    //if (toutes les lettres sont trouvées)
    if (countGoodAnswer <= spanArray.length && countWrongAnswer !== 0) {
      //Si ce n'est pas une victoire, ni une défaire, on continue
      if (spanArray.includes(test)) {
        //si on clique sur un lettre du mot : afficher la lettre, griser le btn, baisser le compteur de lettre dispo
        document.querySelectorAll(`.${test}`).forEach((tiret) => {
          tiret.textContent = tiret.classList[0]; //affiche la premiere class, donc accent s'il y a
          countGoodAnswer++;
        });
        test2.setAttribute("disabled", "");
        if (countGoodAnswer == spanArray.length) {
          // si toutes les réponses sont trouvées, c'est gagné
          page.end("VICTOIRE", "Félicitations, vous avez sauvé le condamné");
          console.log("VICTOIRE");
          document.getElementById("head").classList.add("hidden");
          document.getElementById("body").classList.add("hidden");
          document.getElementById("armleft").classList.add("hidden");
          document.getElementById("armright").classList.add("hidden");
          document.getElementById("legleft").classList.add("hidden");
          document.getElementById("legright").classList.add("hidden");
        }
      } else {
        //si on clqiue sur une mauvaie lettre, c'est une erreur : griser le btn + compteur erreur baisse
        test2.setAttribute("disabled", "");
        countWrongAnswer--;
        console.log(countWrongAnswer);

        switch (
          countWrongAnswer //affichage du pendu en fonction du nombre d'erreur
        ) {
          case 7:
            document.getElementById("head").classList.remove("hidden");
            break;
          case 6:
            document.getElementById("body").classList.remove("hidden");
            break;
          case 5:
            document.getElementById("armleft").classList.remove("hidden");
            break;
          case 4:
            document.getElementById("armright").classList.remove("hidden");
            break;
          case 3:
            document.getElementById("legleft").classList.remove("hidden");
            break;
          case 2:
            document.getElementById("legright").classList.remove("hidden");
            break;
          case 1:
            document.getElementById("eyeleft").classList.remove("hidden");
            document.getElementById("eyeright").classList.remove("hidden");
            document.getElementById("mouth").classList.remove("hidden");
            break;

          default:
            break;
        }
        if (countWrongAnswer == 0) {
          //Si toutes les reponses ne sont pas trouvée et que le compteur d'erreru arriave a 0, c'est perdu
          page.end(
            "DEFAITE",
            "Ho non!!!! Vous n'avez pas réussi à sauvé le condamné !!"
          );
        }
      }
    }
  },
  keyboard: function () {
    //afficher le clavier
    for (i = 0; i < alphabet.length; i++) {
      document.querySelector("#clavier").innerHTML += `
      <button class='btn btn-clavier'id=${alphabet[i]}>${alphabet[i]}</button>
       `;
    }
  },
  filterArray: function () {
    //filtrer le tableau en gardant les mots avec le nombre de lettres spécifiées

    gameArray = wordArray.filter((word) => {
      return word.numberOfLetters == Number(numberOfLetters.value);
    });
  },
  //choisir un mot et le découper
  picWord: function () {
    mysteryWord = gameArray[Math.floor(Math.random() * gameArray.length)].word;
    spanArray = mysteryWord.split("");
    spanArrayAccent = spanArray;
    console.log(spanArray);
  },
  displayWord: function () {
    word = document.querySelector(".word");
    word.textContent = ""; //initialise l'affichage si reload
    for (let i = 0; i < spanArray.length; i++) {
      //affiche les span
      let tiret = document.createElement("span");
      if (spanArray[i] == " ") {
        tiret.classList.add("space");
      } else {
        let str = spanArray[i].normalize("NFD").replace(/[\u0300-\u036f]/g, ""); //supprime les accents
        // let str = spanArray[i].normalize("NFD").replace(/\p{Diacritic}/gu, ""); //supprime les accents
        tiret.classList.add(spanArray[i]); //1ere classe = accent = sera affiché
        tiret.classList.add(`${str}`); //2nd class = pour la recherche dans le tableau
        spanArray[i] = str;
        word.appendChild(tiret);
        tiret.textContent = `_`;
      }
      if (spanArray[i] == "-" || spanArray[i] == "'" || spanArray[i] == " ") {
        tiret.textContent = spanArray[i];
        countGoodAnswer++;
      }
    }
  },
  store: function () {
    localStorage.wordLength = numberOfLetters.value;
  },
  getnumber: function () {
    if (localStorage.wordLength) {
      numberOfLetters.value = localStorage.wordLength;
    } else {
      numberOfLetters.value = 6;
    }
  },
};

const page = {
  loby: function () {
    utils.pageContent(
      "<h1>LE PENDU</h1><div class='regles'><p>Le but du jeu est simple : deviner toute les lettres qui composent un mot, avec un nombre limité de tentatives. A chaque fois que le joueur devine une lettre, celle-ci est affichée. Dans le cas contraire, le dessin d’un pendu se met à apparaître…</p><img src='./img/hangman.png' alt='image de la potence'></div>",
      "<button id='reload'>Commencer</button>"
    );
    utils.fetchWords();
    reload.addEventListener("click", () => this.game());
  },
  game: function () {
    utils.pageContent(
      //affiche la page
      "<h1>LE PENDU</h1><label for='numberOfLetters'>Nombre de lettres max : </label> <select name='letterNumber' id='numberOfLetters'><option value='6'>6</option> <option value='7'>7</option> <option value='8'>8</option> <option value='9'>9</option> <option value='10'>10</option> <option value='11'>11</option> <option value='12'>12</option>  <option value='13'>13</option>  <option value='14'>14</option><option value='15'>15</option> <option value='16'>16</option> <option value='17'>17</option> <option value='18'>18</option> <option value='19'>19</option> <option value='20'>20</option><option value='21'>21</option><option value='22'>22</option> <option value='23'>23</option> <option value='24'>24</option><option value='25'>25</option></select><div id='pendu'><img src='./img/hangman.png' alt='image de la potence'><div id='head' class='head hidden'><div id='eyeleft' class='eye eyeleft hidden'></div><div id='eyeright' class='eye eyeright hidden'></div>      <div id='mouth' class='mouth hidden'></div>    </div>    <div id='body' class='body hidden'></div>    <div id='armleft' class='arm armleft hidden'></div>    <div id='armright' class='arm armright hidden'></div>    <div id='legleft' class='leg legleft hidden'></div>    <div id='legright' class='leg legright hidden'></div></div><div class='word'></div><div class='' id='clavier-container'><div id='clavier'></div></div>",
      "<button id='reload'>Recommencer</button>"
    );
    utils.keyboard(); //affiche le clavier
    utils.getnumber();

    utils.filterArray(); //tri le tableau
    utils.picWord(); //selectionne un mot
    utils.displayWord(); //affiche le mot

    const btnClavier = document.querySelectorAll(".btn-clavier");
    btnClavier.forEach((letter) => {
      letter.addEventListener("click", (e) => {
        utils.isVictory(e.target.id, e.target);
      });
    });

    numberOfLetters.addEventListener("change", (e) => {
      e.preventDefault();
      utils.store();
      page.game();
    });

    reload.addEventListener("click", () => {
      this.game();
      countGoodAnswer = 0;
      countWrongAnswer = 8;
    }); //relance la partie
  },
  end: function (result, text) {
    utils.pageContent(
      `<h1>LE PENDU</h1><div id='pendu'><img src='./img/hangman.png' alt='image de la potence'><div id='head' class='head '><div id='eyeleft' class='deadeye eyeleft '></div><div id='eyeright' class='deadeye eyeright '></div>      <div id='mouth' class='deadmouth '></div>    </div>    <div id='body' class='body '></div>    <div id='armleft' class='arm armleft '></div>    <div id='armright' class='arm armright '></div>    <div id='legleft' class='leg legleft '></div>    <div id='legright' class='leg legright '></div></div><div class='${result}'><h3>${result}</h3><p>${text}</p><p>Il fallait trouver le mot <span class='answer'>${mysteryWord}</span></div>`,

      "<button id='reload'>Recommencer</button>"
    );
    reload.addEventListener("click", () => {
      this.game();
      countGoodAnswer = 0;
      countWrongAnswer = 8;
    });
  },
};

window.addEventListener("load", () => {
  utils.fetchWords();
  page.loby();
});

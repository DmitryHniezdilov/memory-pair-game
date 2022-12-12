import { data } from "./data.js";
import { shuffle } from "./utils.js";

const CLASS_CONTENT = ".js-content";
const CLASS_IS_ACTIVE = "is-active";
const CLASS_IS_POPUP_ACTIVE = "is-popup-active";
const CLASS_IS_HIDE = "is-hide";
const CLASS_HONEYCOMB_FRONT = "js-honeycomb-front";
const CLASS_HONEYCOMB_CONTAINER = ".js-honeycomb-container";
const CLASS_POPUP = ".js-popup";
const CLASS_POPUP_BTN = ".js-popup-btn";
const LOCAL_STORAGE_KEY = "memory-game-best-result";
const ANIMATION_DELAY = 600;
const elemContent = document.querySelector(CLASS_CONTENT);
const elemPopup = document.querySelector(CLASS_POPUP);
const listOfCards = [];
const numOfPair = data.length;
let counterOfPair = 0;
let counterOfClick = 0;
let bestResultOfClick = localStorage.getItem(LOCAL_STORAGE_KEY) || "";

const createInitialMarkup = (data) => {
  const listOfHoneyCombs = shuffle([...data, ...data.reverse()]).reduce(
    (acc, { id, iconId }) => {
      return (acc += `
        <li class="honeycomb__item">
          <div class="honeycomb__flip-container js-honeycomb-container" data-id="${id}">
              <div class="honeycomb__flipper">
                <div class="honeycomb__front js-honeycomb-front"></div>
                <div class="honeycomb__back">
                  <div class="honeycomb__icon-wrap">
                  <svg class="honeycomb__icon" aria-hidden="true">
                    <use xlink:href="${iconId}"></use>
                  </svg>
                  </div>
                </div>
              </div>
          </div>
        </li>
      `);
    },
    ""
  );

  const contentMarkup = `<ul class="honeycomb">${listOfHoneyCombs}</ul>`;
  return contentMarkup;
};

const createContent = () => {
  elemContent.innerHTML = "";
  elemContent.innerHTML = createInitialMarkup(data);
};

const createPopupMarkup = (counterOfClick, bestResultOfClick) => {
  const popupMarkup = `
      <div class="popup__inner">
        <h2 class="popup__inner-title">You won in ${counterOfClick} clicks !</h2>
        <p class="popup__inner-subtitle">
          ${
            counterOfClick < bestResultOfClick || !bestResultOfClick
              ? `Congratulations! That's the best result ever!`
              : `Best result ${bestResultOfClick} clicks.`
          }
        </p>
        <button class="popup__inner-btn js-popup-btn">Restart game</button>
      </div>
    `;
  elemPopup.innerHTML = "";
  elemPopup.innerHTML = popupMarkup;
};

const openPopup = (counterOfClick, bestResultOfClick) => {
  createPopupMarkup(counterOfClick, bestResultOfClick);
  elemPopup.classList.toggle(CLASS_IS_POPUP_ACTIVE);
};

const addItem = (currentCard) =>
  listOfCards.push({ id: currentCard.dataset.id, elem: currentCard });

const addActiveClass = (currentCard) =>
  currentCard.classList.toggle(CLASS_IS_ACTIVE);

const addActiveCard = (currentCard) => {
  addItem(currentCard);
  addActiveClass(currentCard);
};

const setResult = () => localStorage.setItem(LOCAL_STORAGE_KEY, counterOfClick);

const restartGame = () => {
  const elemPopupBtn = document.querySelector(CLASS_POPUP_BTN);
  elemPopupBtn.addEventListener("click", (event) => {
    event.preventDefault();
    if (counterOfClick < bestResultOfClick || !bestResultOfClick) {
      bestResultOfClick = counterOfClick;
      setResult();
    }
    createContent();
    counterOfClick = 0;
    counterOfPair = 0;
    elemPopup.classList.toggle(CLASS_IS_POPUP_ACTIVE);
  });
};

const flipPair = (pair) => {
  pair.forEach((item) => item.elem.classList.toggle(CLASS_IS_ACTIVE));
};

const checkPair = (pair) => {
  pair.forEach((item) => item.elem.classList.add(CLASS_IS_HIDE));
};

const initGame = () => {
  createContent();

  elemContent.addEventListener("click", (event) => {
    const isClickActive = event.target.classList.contains(
      CLASS_HONEYCOMB_FRONT
    );
    if (!isClickActive) return;

    counterOfClick++;
    const currentCard = event.target.closest(CLASS_HONEYCOMB_CONTAINER);

    const initScene = () => {
      if (listOfCards.length === 0) {
        addActiveCard(currentCard);
      } else if (
        listOfCards.length === 1 &&
        listOfCards[0].id === currentCard.dataset.id
      ) {
        addActiveCard(currentCard);
        const pairCheck = listOfCards.splice(0, 2);
        counterOfPair++;

        setTimeout(() => {
          checkPair(pairCheck);

          if (counterOfPair === numOfPair) {
            setTimeout(() => {
              openPopup(counterOfClick, bestResultOfClick);
              restartGame();
            }, ANIMATION_DELAY);
          }
        }, ANIMATION_DELAY);
      } else if (listOfCards.length === 1) {
        addActiveCard(currentCard);
        const pairFlip = listOfCards.splice(0, 2);

        setTimeout(() => {
          flipPair(pairFlip);
        }, ANIMATION_DELAY);
      }
    };

    initScene();
  });
};

initGame();

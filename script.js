/**
 * @fileoverview 타로 카드 선택 애플리케이션의 메인 자바스크립트 파일
 * @author Your Name
 */

/**
 * @type {HTMLElement} 카드 컨테이너 요소
 */
const cardContainer = document.getElementById('card-container');

/**
 * @type {HTMLElement} 선택된 카드 컨테이너 요소
 */
const selectedCardsContainer = document.getElementById('selected-cards');

/**
 * @type {HTMLElement} 카드 펼치기 버튼 요소
 */
const fanOutButton = document.getElementById('fanOutButton');

/**
 * @type {string[]} 카드 이미지 경로 배열
 */
const cards = Array.from({ length: 78 }, (_, i) => {
    const cardNumber = i.toString().padStart(2, '0');
    return `images/card_${cardNumber}.jpg`;
});

/**
 * 배열을 무작위로 섞는 함수
 * @param {Array} array - 섞을 배열
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * 카드 요소를 생성하는 함수
 * @param {string} src - 카드 이미지 경로
 * @param {number} index - 카드 인덱스
 * @param {number} total - 전체 카드 수
 * @returns {HTMLElement} 생성된 카드 요소
 */
function createCard(src, index, total) {
    const card = document.createElement('div');
    card.className = 'card';
    
    const angle = (index - (total - 1) / 2) * 2.25;
    card.style.setProperty('--angle', `${angle}deg`);
    
    const cardInner = document.createElement('div');
    cardInner.className = 'card-inner';
    
    const cardFront = document.createElement('div');
    cardFront.className = 'card-front';
    const img = document.createElement('img');
    img.src = src;
    cardFront.appendChild(img);
    
    const cardBack = document.createElement('div');
    cardBack.className = 'card-back';
    
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);
    
    return card;
}

/**
 * 카드를 펼치는 함수
 */
function fanOutCards() {
    fanOutButton.style.display = 'none';
    cardContainer.innerHTML = '';
    selectedCardsContainer.innerHTML = '';
    
    // 메시지 숨기기
    const messageElement = document.getElementById('selection-message');
    messageElement.style.display = 'none'; // 메시지를 숨김

    shuffleArray(cards);
    cards.forEach((cardSrc, index) => {
        const card = createCard(cardSrc, index, cards.length);
        card.addEventListener('click', () => selectCard(card));
        cardContainer.appendChild(card);
        
        setTimeout(() => {
            card.style.animation = `fanOut 1.5s ease-out forwards ${index * 22}ms`;
        }, 100);
    });
    
    const lastCardDelay = cards.length * 22 + 1500;
    setTimeout(() => {
        fanOutButton.textContent = '새롭게 카드 펼치기';
        fanOutButton.style.display = 'block';
    }, lastCardDelay);
}

/**
 * 카드를 선택하는 함수
 * @param {HTMLElement} card - 선택된 카드 요소
 */
function selectCard(card) {
    card.removeEventListener('click', () => selectCard(card));
    cardContainer.removeChild(card);
    card.style.animation = 'none';
    card.style.transform = 'none';
    
    // 현재 선택된 카드의 수를 계산하여 번호 부여
    const currentNumber = selectedCardsContainer.children.length + 1;
    
    // 메시지 표시
    const messageElement = document.getElementById('selection-message');
    messageElement.innerHTML = `
        <span style="font-weight: bold; font-size: 32px; color: #333;">${currentNumber}</span>장을 선택했습니다.
        <button id="close-message" class="close-button" style="margin-left: 5px; background: none; border: 2px solid #333; color: #333; font-size: 20px; cursor: pointer; padding: 0 5px; border-radius: 5px;">X</button>
    `; // 숫자 부분을 굵고 크게 설정
    
    messageElement.style.display = 'flex'; // 메시지를 보이도록 설정
    
    // X 버튼 클릭 이벤트 추가
    document.getElementById('close-message').addEventListener('click', () => {
        messageElement.style.display = 'none'; // 메시지를 숨김
    });
    
    // 번호를 표시할 요소 생성
    const numberElement = document.createElement('div');
    numberElement.className = 'card-number';
    numberElement.textContent = currentNumber;
    
    // 번호 요소를 카드의 맨 앞에 추가
    card.insertBefore(numberElement, card.firstChild);
    
    // 선택된 카드 컨테이너에 카드 추가
    selectedCardsContainer.appendChild(card);
    
    // 카드 클릭 시 뒤집기 기능 추가
    card.addEventListener('click', () => flipCard(card));
}

/**
 * 카드를 뒤집는 함수
 * @param {HTMLElement} card - 뒤집을 카드 요소
 */
function flipCard(card) {
    card.classList.toggle('flipped'); // 카드의 flipped 클래스를 토글하여 앞면과 뒷면을 전환
}

// 이벤트 리스너 등록
fanOutButton.addEventListener('click', fanOutCards);
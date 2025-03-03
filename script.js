/**
 * 타로클릭 - 타로 카드 선택 웹앱
 * 바닐라 자바스크립트로 구현된 타로 카드 선택 및 공유 웹앱
 */

/**
 * 전역 변수 및 상태
 */
const state = {
  /** @type {string} 선택된 덱 (RW: 라이더 웨이트, MS: 마르세유) */
  selectedDeck: 'RW',
  
  /** @type {number[]} 선택된 카드 ID 배열 */
  selectedCards: [],
  
  /** @type {number} 최대 선택 가능한 카드 수 - 제한 없음 */
  maxCards: 78
};

/**
 * 초기화 함수
 */
function init() {
  // 이벤트 리스너 등록
  document.getElementById('rider-waite').addEventListener('change', handleDeckChange);
  document.getElementById('marseille').addEventListener('change', handleDeckChange);
  document.getElementById('initialClick').addEventListener('click', handleInitialClick);
  document.getElementById('newShuffle').addEventListener('click', handleNewShuffle);
  document.getElementById('shareButton').addEventListener('click', handleShareClick);
  
  // 초기 덱 설정
  state.selectedDeck = document.querySelector('input[name="deck"]:checked').value;
  
  // 초기 화면 설정 - 항상 초기 화면으로 시작
  resetToInitialState();
}

/**
 * 덱 변경 핸들러
 * @param {Event} event - 라디오 버튼 변경 이벤트
 */
function handleDeckChange(event) {
  state.selectedDeck = event.target.value;
  
  // 덱 변경 시 항상 초기 화면으로 리셋
  resetToInitialState();
}

/**
 * 초기 상태로 리셋
 */
function resetToInitialState() {
  // 선택된 카드 초기화
  state.selectedCards = [];
  
  // 카드 컨테이너 숨기기
  document.getElementById('cardsContainer').classList.add('hidden');
  
  // 카드 펼치기 이미지 표시
  document.getElementById('initialClickContainer').classList.remove('hidden');
  
  // 다시 섞기 버튼 숨기기
  document.getElementById('shuffleContainer').classList.add('hidden');
  
  // 선택된 카드 목록 비우기
  updateSelectedCardsDisplay();
}

/**
 * 초기 카드 클릭 핸들러
 */
function handleInitialClick() {
  document.getElementById('initialClickContainer').classList.add('hidden');
  document.getElementById('shuffleContainer').classList.remove('hidden');
  document.getElementById('cardsContainer').classList.remove('hidden');
  
  displayCards();
}

/**
 * 카드 다시 펼치기 핸들러
 */
function handleNewShuffle() {
  // 선택된 카드 초기화
  state.selectedCards = [];
  updateSelectedCardsDisplay();
  
  // 카드 다시 펼치기
  displayCards();
}

/**
 * 카드 클릭 핸들러
 * @param {number} cardId - 선택된 카드 ID
 * @param {HTMLElement} cardElement - 클릭된 카드 요소
 */
function handleCardClick(cardId, cardElement) {
  // 선택 개수 제한 없음 (0-78장)
  
  // 카드 ID 저장
  state.selectedCards.push(cardId);
  
  // 선택된 카드 번호 표시
  const cardNumber = document.createElement('div');
  cardNumber.className = 'card-number';
  cardNumber.textContent = state.selectedCards.length;
  
  // 카드 이미지 숨기기
  cardElement.querySelector('img').style.display = 'none';
  cardElement.appendChild(cardNumber);
  
  // 선택된 카드 목록 업데이트
  updateSelectedCardsDisplay();
}

/**
 * 배열 무작위 섞기
 * @param {Array} array - 섞을 배열
 * @returns {Array} 섞인 배열
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * 카드 펼치기
 */
function displayCards() {
  const cardsContainer = document.getElementById('cardsContainer');
  cardsContainer.innerHTML = '';
  
  // 0-77까지의 카드 ID 배열 생성
  const cardIds = Array.from({ length: 78 }, (_, i) => i);
  
  // 카드 배열 무작위로 섞기
  const shuffledCardIds = shuffleArray(cardIds);
  
  // 무작위로 섞인 카드 78장 생성
  shuffledCardIds.forEach(i => {
    // 이미 선택한 카드는 표시하지 않음
    if (state.selectedCards.includes(i)) {
      const cardItem = document.createElement('div');
      cardItem.className = 'card-item';
      const cardNumber = document.createElement('div');
      cardNumber.className = 'card-number';
      cardNumber.textContent = state.selectedCards.indexOf(i) + 1;
      cardItem.appendChild(cardNumber);
      cardsContainer.appendChild(cardItem);
      return;
    }
    
    const cardItem = document.createElement('div');
    cardItem.className = 'card-item';
    
    const cardImg = document.createElement('img');
    // 카드 뒷면 이미지 사용
    cardImg.src = `${state.selectedDeck}_images/card_back.jpg`;
    cardImg.alt = `타로 카드 뒷면`;
    cardImg.dataset.cardId = i; // 나중에 앞면 이미지를 보여줄 때 사용할 카드 ID 저장
    
    cardImg.addEventListener('click', () => {
      handleCardClick(i, cardItem);
    });
    
    cardItem.appendChild(cardImg);
    cardsContainer.appendChild(cardItem);
  });
}

/**
 * 선택된 카드 목록 업데이트
 */
function updateSelectedCardsDisplay() {
  const selectedCardsContainer = document.getElementById('selectedCardsContainer');
  selectedCardsContainer.innerHTML = '';
  
  if (state.selectedCards.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = '선택된 카드가 없습니다.';
    selectedCardsContainer.appendChild(emptyMessage);
    return;
  }
  
  state.selectedCards.forEach((cardId, index) => {
    const cardContainer = document.createElement('div');
    cardContainer.className = 'selected-card';
    
    const cardImg = document.createElement('img');
    const paddedIndex = cardId.toString().padStart(2, '0');
    cardImg.src = `${state.selectedDeck}_images/card_${paddedIndex}.jpg`;
    cardImg.alt = `선택된 카드 ${index + 1}`;
    
    const cardPosition = document.createElement('div');
    cardPosition.className = 'card-position';
    cardPosition.textContent = index + 1;
    
    cardContainer.appendChild(cardImg);
    cardContainer.appendChild(cardPosition);
    selectedCardsContainer.appendChild(cardContainer);
  });
}

/**
 * 공유 버튼 클릭 핸들러
 */
function handleShareClick() {
  if (state.selectedCards.length === 0) {
    alert('선택된 카드가 없습니다.');
    return;
  }
  
  // URL 생성 (예: ?deck=RW&cards=01,15,27)
  const baseUrl = window.location.href.split('?')[0];
  const deck = state.selectedDeck;
  const cards = state.selectedCards.map(id => id.toString().padStart(2, '0')).join(',');
  const url = `${baseUrl}?deck=${deck}&cards=${cards}`;
  
  // bit.ly API를 이용한 단축 URL 생성은 실제 API 키가 필요하므로
  // 여기서는 원본 URL을 클립보드에 복사하는 것으로 대체
  
  // 클립보드에 복사
  copyToClipboard(url);
  
  // 사용자에게 알림
  alert('선택된 카드 정보가 복사되었습니다. 원하는 곳에 붙여넣기 하세요.');
}

/**
 * 클립보드에 텍스트 복사
 * @param {string} text - 복사할 텍스트
 */
function copyToClipboard(text) {
  // 임시 textarea 생성
  const tempTextArea = document.createElement('textarea');
  tempTextArea.value = text;
  tempTextArea.style.position = 'fixed';  // A
  document.body.appendChild(tempTextArea);
  
  // 선택 및 복사
  tempTextArea.select();
  document.execCommand('copy');
  
  // 임시 요소 제거
  document.body.removeChild(tempTextArea);
}

/**
 * URL 파라미터에서 공유된 카드 정보 로드
 */
function loadSharedCards() {
  const urlParams = new URLSearchParams(window.location.search);
  const deck = urlParams.get('deck');
  const cards = urlParams.get('cards');
  
  if (deck && cards) {
    // 덱 설정
    state.selectedDeck = deck;
    document.getElementById(deck === 'RW' ? 'rider-waite' : 'marseille').checked = true;
    
    // 카드 ID 설정
    state.selectedCards = cards.split(',').map(card => parseInt(card, 10));
    
    // 카드 화면 업데이트
    handleInitialClick();
    updateSelectedCardsDisplay();
    
    // 자동 스크롤
    document.querySelector('.selected-cards').scrollIntoView({ behavior: 'smooth' });
  }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
  init();
  loadSharedCards();
}); 
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
  maxCards: 78,
  
  /** @type {number} 현재 뒤집힌 카드 수 */
  flippedCards: 0
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
  
  // URL 파라미터 확인 및 공유 카드 로드
  loadSharedCards();
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
  state.flippedCards = 0;
  
  // 카드 컨테이너 숨기기
  document.getElementById('cardsContainer').classList.add('hidden');
  
  // 카드 펼치기 이미지 표시 (display 속성도 초기화)
  const initialClickContainer = document.getElementById('initialClickContainer');
  initialClickContainer.style.display = '';
  initialClickContainer.classList.remove('hidden');
  
  // 다시 섞기 버튼 숨기기
  document.getElementById('shuffleContainer').classList.add('hidden');
  
  // 공유 버튼 숨기기
  document.getElementById('shareButton').classList.add('hidden');
  document.getElementById('shareButton').classList.remove('blinking');
  
  // 선택된 카드 목록 비우기
  updateSelectedCardsDisplay();
}

/**
 * 초기 카드 클릭 핸들러
 */
function handleInitialClick() {
  // 초기 카드 이미지 컨테이너를 완전히 숨김 (display: none 적용)
  const initialClickContainer = document.getElementById('initialClickContainer');
  initialClickContainer.style.display = 'none';
  initialClickContainer.classList.add('hidden');
  
  // 다시 섞기 버튼을 표시
  document.getElementById('shuffleContainer').classList.remove('hidden');
  
  // 카드 컨테이너를 표시 (카드는 아직 생성되지 않음)
  document.getElementById('cardsContainer').classList.remove('hidden');
  
  // '카드 선택하기' 섹션 위치로 이동 (모바일 및 데스크탑 환경 모두 고려)
  const cardSelectionSection = document.querySelector('.card-selection');
  
  // 위치 계산 (상단에서 5px 여백을 둠)
  const sectionPosition = cardSelectionSection.getBoundingClientRect().top + window.pageYOffset - 5;
  
  // 즉시 스크롤 이동
  window.scrollTo({
    top: sectionPosition,
    behavior: 'auto' // 즉시 이동
  });
  
  // 약간의 지연 후 카드 표시 (iOS/Android 모두 호환)
  setTimeout(() => {
    // 위치 재확인 (스크롤이 제대로 됐는지)
    const finalPosition = cardSelectionSection.getBoundingClientRect().top + window.pageYOffset - 5;
    
    // 필요시 위치 재조정
    if (Math.abs(finalPosition - sectionPosition) > 10) {
      window.scrollTo({
        top: finalPosition,
        behavior: 'auto'
      });
    }
    
    // 카드 펼치기
    displayCards();
  }, 150); // 모바일에서도 충분한 시간
}

/**
 * 카드 다시 펼치기 핸들러
 */
function handleNewShuffle() {
  // 선택된 카드 초기화
  state.selectedCards = [];
  state.flippedCards = 0;
  updateSelectedCardsDisplay();
  
  // 공유 버튼 숨기기
  document.getElementById('shareButton').classList.add('hidden');
  document.getElementById('shareButton').classList.remove('blinking');
  
  // '카드 선택하기' 섹션 위치로 이동 (모바일 및 데스크탑 환경 모두 고려)
  const cardSelectionSection = document.querySelector('.card-selection');
  
  // 위치 계산 (상단에서 5px 여백을 둠)
  const sectionPosition = cardSelectionSection.getBoundingClientRect().top + window.pageYOffset - 5;
  
  // 즉시 스크롤 이동
  window.scrollTo({
    top: sectionPosition,
    behavior: 'auto' // 즉시 이동
  });
  
  // 약간의 지연 후 카드 표시 (iOS/Android 모두 호환)
  setTimeout(() => {
    // 위치 재확인 (스크롤이 제대로 됐는지)
    const finalPosition = cardSelectionSection.getBoundingClientRect().top + window.pageYOffset - 5;
    
    // 필요시 위치 재조정
    if (Math.abs(finalPosition - sectionPosition) > 10) {
      window.scrollTo({
        top: finalPosition,
        behavior: 'auto'
      });
    }
    
    // 카드 다시 펼치기
    displayCards();
  }, 150); // 모바일에서도 충분한 시간
}

/**
 * 카드 클릭 핸들러
 * @param {number} cardId - 선택된 카드 ID
 * @param {HTMLElement} cardElement - 클릭된 카드 요소
 */
function handleCardClick(cardId, cardElement) {
  // 카드 ID 저장
  state.selectedCards.push(cardId);
  
  // 선택된 카드 번호 표시
  const cardNumber = document.createElement('div');
  cardNumber.className = 'card-number';
  cardNumber.textContent = state.selectedCards.length;
  
  // 카드 이미지 숨기기
  cardElement.querySelector('img').style.display = 'none';
  cardElement.appendChild(cardNumber);
  
  // 선택된 카드 목록 업데이트 - 애니메이션 적용
  updateSelectedCardsDisplay(true);
}

/**
 * 선택한 카드 뒤집기 핸들러
 * @param {HTMLElement} cardElement - 뒤집을 카드 요소
 */
function handleCardFlip(cardElement) {
  if (!cardElement.classList.contains('flipped')) {
    cardElement.classList.add('flipped');
    state.flippedCards++;
    
    // 모든 카드가 뒤집혔는지 확인
    if (state.flippedCards === state.selectedCards.length && state.selectedCards.length > 0) {
      // 공유 버튼 표시 및 깜빡임 효과 추가
      const shareButton = document.getElementById('shareButton');
      shareButton.classList.remove('hidden');
      shareButton.classList.add('blinking');
    }
  }
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
  
  // 애니메이션 딜레이 설정 (각 카드마다 0.05초씩 증가)
  const delayIncrement = 0.05; // 카드마다 0.05초씩 증가
  
  // 무작위로 섞인 카드를 하나씩 순차적으로 추가
  shuffledCardIds.forEach((i, index) => {
    // 이미 선택한 카드는 표시하지 않음
    if (state.selectedCards.includes(i)) {
      setTimeout(() => {
        const cardItem = document.createElement('div');
        cardItem.className = 'card-item';
        const cardNumber = document.createElement('div');
        cardNumber.className = 'card-number';
        cardNumber.textContent = state.selectedCards.indexOf(i) + 1;
        cardItem.appendChild(cardNumber);
        cardsContainer.appendChild(cardItem);
      }, index * delayIncrement * 1000); // 밀리초 단위로 변환
      return;
    }
    
    // 각 카드를 일정 시간 간격으로 추가
    setTimeout(() => {
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
    }, index * delayIncrement * 1000); // 밀리초 단위로 변환
  });
}

/**
 * 선택된 카드 목록 업데이트
 * @param {boolean} withAnimation - 애니메이션 적용 여부
 */
function updateSelectedCardsDisplay(withAnimation = false) {
  const selectedCardsContainer = document.getElementById('selectedCardsContainer');
  selectedCardsContainer.innerHTML = '';
  
  if (state.selectedCards.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.className = 'empty-selection-message';
    emptyMessage.textContent = '아래 \'카드 선택하기\'에서 이미지를 클릭하여 카드를 펼치고 선택하세요. 선택한 카드는 이곳에 나열됩니다.';
    selectedCardsContainer.appendChild(emptyMessage);
    return;
  }
  
  // 기존 애니메이션 딜레이를 위한 카운터
  let delay = 0;
  
  state.selectedCards.forEach((cardId, index) => {
    const cardContainer = document.createElement('div');
    cardContainer.className = 'selected-card';
    
    if (withAnimation) {
      // 행과 열을 기준으로 애니메이션 딜레이 설정 (카드 선택하기와 일관성 유지)
      const row = Math.floor(index / 6);
      const col = index % 6;
      delay = row * 0.2 + col * 0.05; // 행간 0.2초, 열간 0.05초 딜레이
      cardContainer.style.animationDelay = `${delay}s`;
      cardContainer.style.animation = 'fadeIn 0.3s ease-out backwards';
    }
    
    // 카드 앞면 (처음에는 안 보임)
    const cardFront = document.createElement('div');
    cardFront.className = 'card-front';
    const frontImg = document.createElement('img');
    const paddedIndex = cardId.toString().padStart(2, '0');
    frontImg.src = `${state.selectedDeck}_images/card_${paddedIndex}.jpg`;
    frontImg.alt = `선택한 카드 ${index + 1}`;
    cardFront.appendChild(frontImg);
    
    // 카드 뒷면 (처음에 보임)
    const cardBack = document.createElement('div');
    cardBack.className = 'card-back';
    const backImg = document.createElement('img');
    backImg.src = `${state.selectedDeck}_images/card_back.jpg`;
    backImg.alt = `선택한 카드 뒷면 ${index + 1}`;
    cardBack.appendChild(backImg);
    
    // 카드 위치 표시
    const cardPosition = document.createElement('div');
    cardPosition.className = 'card-position';
    cardPosition.textContent = index + 1;
    
    // 뒤집기 이벤트 리스너 추가
    cardContainer.addEventListener('click', () => {
      handleCardFlip(cardContainer);
    });
    
    cardContainer.appendChild(cardFront);
    cardContainer.appendChild(cardBack);
    cardContainer.appendChild(cardPosition);
    selectedCardsContainer.appendChild(cardContainer);
  });
}

/**
 * 커스텀 알림창 표시
 * @param {string} message - 표시할 메시지
 * @param {Function} callback - 확인 버튼 클릭 시 실행할 콜백 함수
 */
function showCustomAlert(message, callback) {
  // 오버레이 생성
  const overlay = document.createElement('div');
  overlay.className = 'custom-alert-overlay';
  
  // 알림창 컨테이너 생성
  const alertBox = document.createElement('div');
  alertBox.className = 'custom-alert';
  
  // 메시지 생성
  const alertMessage = document.createElement('div');
  alertMessage.className = 'custom-alert-message';
  alertMessage.textContent = message;
  
  // 확인 버튼 생성
  const alertButton = document.createElement('button');
  alertButton.className = 'custom-alert-button';
  alertButton.textContent = '확인';
  alertButton.addEventListener('click', () => {
    // 알림창 닫기
    document.body.removeChild(overlay);
    document.body.removeChild(alertBox);
    
    // 콜백 실행
    if (typeof callback === 'function') {
      callback();
    }
  });
  
  // 알림창 구성
  alertBox.appendChild(alertMessage);
  alertBox.appendChild(alertButton);
  
  // DOM에 추가
  document.body.appendChild(overlay);
  document.body.appendChild(alertBox);
  
  // 버튼에 포커스
  alertButton.focus();
}

/**
 * 공유 버튼 클릭 핸들러
 */
function handleShareClick() {
  if (state.selectedCards.length === 0) {
    showCustomAlert('선택한 카드가 없습니다.');
    return;
  }
  
  // URL 생성 (예: ?deck=RW&cards=01,15,27)
  const baseUrl = window.location.href.split('?')[0];
  const deck = state.selectedDeck;
  const cards = state.selectedCards.map(id => id.toString().padStart(2, '0')).join(',');
  const url = `${baseUrl}?deck=${deck}&cards=${cards}`;
  
  // 클립보드에 복사
  copyToClipboard(url);
  
  // 사용자에게 알림
  showCustomAlert('선택한 카드 정보가 복사되었습니다. 원하는 곳에 붙여넣기 하세요.');
}

/**
 * 클립보드에 텍스트 복사
 * @param {string} text - 복사할 텍스트
 */
function copyToClipboard(text) {
  // 임시 textarea 생성
  const tempTextArea = document.createElement('textarea');
  tempTextArea.value = text;
  tempTextArea.style.position = 'fixed';
  document.body.appendChild(tempTextArea);
  
  // 선택 및 복사
  tempTextArea.select();
  document.execCommand('copy');
  
  // 임시 요소 제거
  document.body.removeChild(tempTextArea);
}

/**
 * URL 파라미터로부터 공유된 카드 로드
 */
function loadSharedCards() {
  const urlParams = new URLSearchParams(window.location.search);
  const deck = urlParams.get('deck');
  const cards = urlParams.get('cards');
  
  if (deck && cards) {
    // 덱 설정
    state.selectedDeck = deck;
    document.querySelector(`input[value="${deck}"]`).checked = true;
    
    // 카드 선택
    const cardIds = cards.split(',').map(id => parseInt(id, 10));
    state.selectedCards = cardIds;
    
    // 공유된 카드는 이미 모두 뒤집힌 상태로 표시
    state.flippedCards = cardIds.length;
    
    // 카드 표시 업데이트
    document.getElementById('initialClickContainer').classList.add('hidden');
    document.getElementById('shuffleContainer').classList.remove('hidden');
    
    // 선택된 카드 업데이트
    updateSelectedCardsDisplay();
    
    // 이미 뒤집힌 상태로 만들기
    setTimeout(() => {
      const selectedCards = document.querySelectorAll('.selected-card');
      selectedCards.forEach(card => {
        card.classList.add('flipped');
      });
      
      // 공유 버튼 표시
      if (state.selectedCards.length > 0) {
        document.getElementById('shareButton').classList.remove('hidden');
      }
    }, 500);
    
    // 카드 펼치기
    displayCards();
    document.getElementById('cardsContainer').classList.remove('hidden');
  }
}

// 페이지 로드 시 초기화
window.addEventListener('DOMContentLoaded', init); 
// 제공해주신 이미지 경로 목록
const dummyImagePaths = [
  '/wishImgs/0257430036.jpg',
  '/wishImgs/0265069025.jpg',
  '/wishImgs/0270375004.jpg',
  '/wishImgs/0276540021.jpg',
  '/wishImgs/0283236028.jpg',
  '/wishImgs/0184121021.jpg',
  '/wishImgs/0188183023.jpg',
];

// 이미지 경로를 무작위로 선택하는 함수
const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * dummyImagePaths.length);
  return dummyImagePaths[randomIndex];
};


const orderListDummy = [
  // --- 2025-06-20 (총 2개 아이템, 1개 주문) ---
  {
    "orderInfo": { "orderid": "ORD00011", "orderdate": "2025-06-20", "total": 77000, "orderstatus": "주문완료" },
    "items": [
      { "optionid": "OP127", "quantity": 1, "price": 45000, "name": "니트 가디건", "option": "소라 / Free", "imageUrl": getRandomImage() },
      { "optionid": "OP124", "quantity": 1, "price": 32000, "name": "코튼 셔츠", "option": "화이트 / L", "imageUrl": getRandomImage() }
    ]
  },

  // --- 2025-06-18 (총 2개 아이템, 2개 주문) ---
  {
    "orderInfo": { "orderid": "ORD00003", "orderdate": "2025-06-18", "total": 26000, "orderstatus": "배송완료" },
    "items": [
      { "optionid": "OP125", "quantity": 1, "price": 26000, "name": "에코 크로스백", "option": "블랙 / Free", "imageUrl": getRandomImage() }
    ]
  },
  {
    "orderInfo": { "orderid": "ORD00004", "orderdate": "2025-06-18", "total": 27000, "orderstatus": "배송완료" },
    "items": [
      { "optionid": "OP126", "quantity": 1, "price": 27000, "name": "캔버스 토트백", "option": "아이보리 / M", "imageUrl": getRandomImage() }
    ]
  },
  
  // --- 2025-06-15 (총 3개 아이템, 2개 주문) ---
  {
    "orderInfo": { "orderid": "ORD00006", "orderdate": "2025-06-15", "total": 35000, "orderstatus": "환불완료" },
    "items": [
      { "optionid": "OP128", "quantity": 1, "price": 35000, "name": "플로럴 블라우스", "option": "핑크 / S", "imageUrl": getRandomImage() }
    ]
  },
  {
    "orderInfo": { "orderid": "ORD00012", "orderdate": "2025-06-15", "total": 108000, "orderstatus": "배송중" },
    "items": [
      { "optionid": "OP132", "quantity": 1, "price": 27000, "name": "라탄 버킷햇", "option": "내추럴 / Free", "imageUrl": getRandomImage() },
      { "optionid": "OP131", "quantity": 1, "price": 27000, "name": "비치 플레어 스커트", "option": "살몬핑크 / M", "imageUrl": getRandomImage() }
    ]
  },

  // --- 슬라이드 없는 단일 아이템들 ---
  {
    "orderInfo": { "orderid": "ORD00007", "orderdate": "2025-06-14", "total": 33000, "orderstatus": "배송완료" },
    "items": [
      { "optionid": "OP129", "quantity": 1, "price": 33000, "name": "리조트 셔츠", "option": "네이비 / XL", "imageUrl": getRandomImage() }
    ]
  },
  {
    "orderInfo": { "orderid": "ORD00008", "orderdate": "2025-06-13", "total": 27000, "orderstatus": "취소완료" },
    "items": [
      { "optionid": "OP130", "quantity": 1, "price": 27000, "name": "슬리브리스 니트탑", "option": "크림 / S", "imageUrl": getRandomImage() }
    ]
  },
  // --- 2025-06-20 (단일 주문) ---
  {
    "orderInfo": { "orderid": "ORD00001", "orderdate": "2025-06-20", "total": 27000, "orderstatus": "주문완료" },
    "items": [
      { "optionid": "OP123", "quantity": 1, "price": 27000, "name": "린넨 브이넥 원피스", "option": "베이지 / M", "imageUrl": getRandomImage() }
    ]
  },
  // --- 오래된 날짜 데이터 (필터링 테스트용) ---
  {
    "orderInfo": { "orderid": "ORD00013", "orderdate": "2025-04-10", "total": 35000, "orderstatus": "배송완료" },
    "items": [
        { "optionid": "OP133", "quantity": 1, "price": 35000, "name": "스프링 트렌치 코트", "option": "베이지 / M", "imageUrl": getRandomImage() }
    ]
  },
  {
    "orderInfo": { "orderid": "ORD00014", "orderdate": "2024-12-25", "total": 78000, "orderstatus": "배송완료" },
    "items": [
        { "optionid": "OP134", "quantity": 1, "price": 78000, "name": "캐시미어 머플러", "option": "그레이 / Free", "imageUrl": getRandomImage() }
    ]
  }
];

// 나머지 주문 정보 필드는 생략했지만, 실제 코드에서는 그대로 사용하시면 됩니다.
// 설명을 위해 주석으로만 표시했습니다.
orderListDummy.forEach(order => {
    if (!order.orderInfo.zip) {
        order.orderInfo.zip = "12345";
        order.orderInfo.address1 = "주소 정보";
        order.orderInfo.address2 = "상세주소";
        order.orderInfo.phone = "010-0000-0000";
        order.orderInfo.payment = "카드";
    }
});


export default orderListDummy;
// src/data/qnaData.js
export const qnaData = [
    {
        qnaId: 1,
        username: 'KalaniLover',
        question: '이 셔츠, 혹시 다른 색상도 재입고 될 계획이 있나요? 아이보리 색상이 있으면 바로 사고 싶어요!',
        answer: '안녕하세요 고객님! 문의주신 코튼 셔츠는 다음 시즌 아이보리 색상 출시를 긍정적으로 검토 중입니다. 조금만 기다려주세요!',
        createdAt: '2023-10-28',
        answeredAt: '2023-10-29',
        answerUsername: 'Kalani MD',
        productName: '코튼 셔츠',
        productImageUrl: '/imgs/shirt.png',
        imgname: '12345678',
    },
    {
        qnaId: 2,
        username: 'KalaniLover',
        question: '키 160cm인데 S 사이즈가 너무 길지 않을까요? 상세 사이즈가 궁금합니다.',
        answer: '고객님, 해당 상품의 S사이즈 총장은 105cm입니다. 160cm 신 경우 밑단을 살짝 수선하시거나 힐과 매치하시는 것을 추천드립니다.',
        createdAt: '2023-10-27',
        answeredAt: '2023-10-27',
        answerUsername: 'Kalani MD',
        productName: '린넨 와이드 팬츠',
        productImageUrl: '/imgs/pants.png',
        imgname: '98765432',
    },
    {
        qnaId: 3,
        username: 'KalaniLover',
        question: '어제 주문했는데 배송은 언제쯤 시작되나요?',
        answer: null, // 답변이 없는 경우
        createdAt: '2023-10-26',
        answeredAt: null,
        answerUsername: null,
        productName: '실크 블라우스',
        productImageUrl: '/imgs/blouse.png',
        imgname: '11223344',
    }
];

export default qnaData;
// src/data/reviewData.js

const reviewData = [
    // === 작성 완료된 리뷰들 ===
    {
        orderId: "ORD1001",
        username: "KalaniLover",
        productName: "하와이안 브라 탑",
        imageUrl: "/wishImgs/0184121021.jpg",
        imgname: "12345678",
        optionId: "OP124",
        reviewtext: "정말 부드럽고 핏이 예뻐요. 다른 색상도 구매하고 싶을 정도입니다. 여름에 입기 딱 좋은 두께감이고, 세탁 후에도 변형이 없어서 만족스럽습니다. 강력 추천합니다!",
        rating: 5,
        createdAt: "2023-10-26",
        complete: true
    },
    {
        orderId: "ORD1003",
        username: "KalaniLover",
        productName: "스카이 블루 비키니",
        imageUrl: "/wishImgs/0188183023.jpg",
        imgname: "11223344",
        optionId: "OP305",
        reviewtext: "고급스럽고 예뻐요. 특별한 날 입으려고 샀는데 만족합니다. 다만 구김이 잘 가는 소재라 관리가 조금 필요해요.",
        rating: 4,
        createdAt: "2023-09-15",
        complete: true
    },

    // === 작성해야 할 리뷰들 ===
    {
        orderId: "ORD1001",
        username: "KalaniLover",
        productName: "니트 나시",
        imageUrl: "/wishImgs/0257430036.jpg",
        imgname: "43654747",
        optionId: "OP127",
        reviewtext: null,
        rating: null,
        createdAt: "2023-10-26",
        complete: false
    },
    {
        orderId: "ORD1002",
        username: "KalaniLover",
        productName: "줄무늬 나시",
        imageUrl: "/wishImgs/0257430036.jpg",
        imgname: "98765432",
        optionId: "OP201",
        reviewtext: null,
        rating: null,
        createdAt: "2023-10-20",
        complete: false
    },
    {
        orderId: "ORD1003",
        username: "KalaniLover",
        productName: "여름 셔츠 반팔",
        imageUrl: "/wishImgs/0283236028.jpg",
        imgname: "55667788",
        optionId: "OP308",
        reviewtext: null,
        rating: null,
        createdAt: "2023-09-15",
        complete: false
    },
];

export default reviewData;
export interface QRCodeData {
    status: 'success' | 'error';
    error: string;
    data: {
        id: number;
        reportId: number;
        createdDate: string;
        shopId: number;
        employeeId: number;
        reportDate: string;
        shiftId: number;
        orderCode: string;
        content: string;
        shopName: string;
        campaignId: string;
    };
}

export interface LuckyGiftData {
    giftName: string;
    giftWinImage: string;
    id: number;
    sellId: number;
    giftId: number;
    quantity: number;
    planId: number;
    giftCode: string;
    luckyId: null;
    createdDate?: string;
    productId: null;
}

export interface Product {
    productId: number;
    campaignId: number;
    productCode: string;
    productName: string;
    productDesc: string | null;
    categoryId: number;
    subCateId: number | null;
    brandId: number;
    productSize: string;
    photo: string;
    barCode: string | null;
    barCode2: string | null;
    barCode3: string | null;
    unit: string | null;
    isNew: boolean | null;
    quantity: number;
}

export interface Gift {
    rowNumber: number | null;
    giftId: number;
    giftIndex: number | null;
    giftName: string;
    giftMessage: string;
    giftBackgroundColor: string;
    giftIcon: string;
    giftWinImage: string;
    giftBackground: string;
    topupValue: number | null;
    productName: string;
    quantity: number;
}

export interface Invoice {
    billCode: string | null;
    photos: string[];
}

export interface ReportContent {
    products: Product[];
    gifts: Gift[];
    invoice: Invoice;
    accessToken: string;
}

export interface Confirm {
    phoneNumber: string;
    phoneNumberOther: string;
    fullName: string;
    fullNameOther: string;
    orderCode: string;
    gifts: any;
    isOnlyUserInfo: boolean;
}

export interface GiftItem {
    id: number;
    giftId: number;
    campaignId: number;
    giftName: string;
    giftMessage: string;
    giftIcon: string;
    giftBackground: string;
    giftWinImage: string;
    giftBackgroundColor: string;
    defaultRate: number;
    totalQuantity: number;
    quantity: number;
    totalUsed: number | null;
    giftIndex: number | null;
    isWin: boolean;
    createdDate: string;
    provinceApply: string | null;
    productApply: string | null;
    channelApply: string | null;
    isLuckyDraw: boolean;
    isTakeGift: boolean;
    isValid: boolean;
}

interface RecommendOption {
    title: string;
    hint: string;
    maxGift: number;
    listGiftMapped: GiftItem[];
}

interface ProductRecommendResult {
    'option-1': RecommendOption[];
    'option-2': RecommendOption[];
    'option-3': RecommendOption[];
}

interface ProductRecommend {
    productId: number;
    productName: string;
    productQuantity: number;
    productRecommendResult: ProductRecommendResult;
}

export interface DataSchemeGift {
    campaignId: number;
    limitGift: number;
    arrayRecommend: ProductRecommend[];
}

export interface ResponseSchemeGift {
    status: string;
    data: DataSchemeGift;
    error: string;
}

export interface ResponseLuckyGift {
    status: string;
    data: LuckyGiftData[];
    error: string;
}

export interface HistoryItem {
    rowIndex: null;
    id: number;
    uniqueId: string;
    campaignId: number;
    giftId: number;
    dailyWorkingId: number;
    orderCode: string;
    point: number;
    createdDate: string;
    content: string;
}

export interface ResponseLoyalty {
    status: string;
    data: HistoryItem[];
    error: string | null;
}

export interface ResponseLoyaltyTotal {
    status: string;
    data: Campaign[];
    error: null;
}

export interface Campaign {
    campaignId: number;
    campaignName: string;
    totalPoint: number;
}

export interface RewardItemData {
    quantity: number | null;
    id: number;
    giftId: number;
    campaignId: number;
    giftName: string;
    giftMessage: string;
    giftIcon: string;
    giftBackground: string;
    giftWinImage: string;
    giftBackgroundColor: string;
    defaultRate: number;
    totalQuantity: number;
    totalUsed: number;
    giftIndex: number | null;
    isWin: boolean;
    createdDate: string;
    provinceApply: string | null;
    productApply: string | null;
    channelApply: string | null;
    isLuckyDraw: boolean;
    isTakeGift: boolean;
}

export interface ResponseReward {
    status: string;
    data: RewardItemData[];
    error: any | null;
}

export interface CreateRedeem {
    campaignId: number;
    userUniqueId: string;
    giftId: number;
    point: number;
}

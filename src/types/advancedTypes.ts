export interface SellOutResponse {
    address: null;
    customerAddress: null;
    customerAge: null;
    customerBirthday: null;
    customerDistrict: null;
    customerGender: null;
    customerIdCardPhoto1: null;
    customerIdCardPhoto2: null;
    customerMobile: string;
    customerName: string;
    customerProvince: null;
    customerWard: null;
    details: null;
    deviceId: null;
    employeeId: null;
    gameName: null;
    gamePoint: null;
    giftName: string;
    id: number;
    invoiceNo: string;
    maxNumofNoOTP: null;
    orderCode: string;
    photos: null;
    place: null;
    quantity: null;
    reportDate: null;
    reportId: number;
    result: null;
    selloutType: number;
    shopCode: null;
    shopId: null;
    shopName: null;
    totalBill: null;
    totalOrder: null;
}

export interface ProductResponse {
    barCode: string | null;
    barCode2: string | null;
    barCode3: string | null;
    brandId: number;
    campaignId: number;
    categoryId: number;
    isNew: boolean | null;
    photo: string;
    productCode: string;
    productDesc: string | null;
    productId: number;
    productName: string;
    productSize: string;
    subCateId: number | null;
    unit: string | null;
    quantity: number;
}

export interface GiftResponse {
    giftBackground: string;
    giftBackgroundColor: string;
    giftIcon: string;
    giftId: number;
    giftIndex: number | null;
    giftMessage: string;
    giftName: string;
    giftWinImage: string;
    rowNumber: number | null;
    topupValue: number | null;
    quantity: number;
}

import { TYPE } from '../constant';
import { GiftResponse, ProductResponse } from './advancedTypes';

interface UserInfo {
    active: any; // Type as 'any' since it's null and the type isn't specified
    administrator: any; // Same as above
    birthDay: any; // Same as above
    campaignId: number;
    campaignName: any; // Same as above
    campaignType: any; // Same as above
    clientId: any; // Same as above
    clientName: any; // Same as above
    createdate: any; // Same as above
    domicile: any; // Same as above
    email: string;
    employeeCode: string;
    employeeId: number;
    employeeName: string;
    idDate: any; // Same as above
    idNumber: any; // Same as above
    idPlace: any; // Same as above
    mobile: any; // Same as above
    nameFilter: any; // Same as above
    parentId: any; // Same as above
    password: any; // Same as above
    permanentResidense: any; // Same as above
    photo: any; // Same as above
    positionId: any; // Same as above
    positionName: any; // Same as above
    roleId: any; // Same as above
    roleName: any; // Same as above
    roleType: any; // Same as above
    sex: any; // Same as above
    shortName: any; // Same as above
    userName: string;
}

export interface LoginResponse {
    message: string; // Type as 'any' since it's null
    token: string;
    userInfo: UserInfo;
}

export interface LoginRequest {
    userName: string;
    password: string;
}

interface Photo {
    data: string;
}

export interface CreateQRCodeZaloRequest {
    shopId: number;
    employeeId: number;
    reportDate: string;
    shiftId: number;
    content: string;
    type: TYPE;
    products: ProductResponse[];
    gifts: GiftResponse[];
    photos: Photo[];
    billCode: string | null;
}

export interface ConfirmDataZaloRequest extends CreateQRCodeZaloRequest {
    prizePhotos: Photo[];
    fullName: string;
    phoneNumber: string;
    phoneNumberOther: string;
    fullNameOther: string;
}

export interface ResponseNetwork<T> {
    error: { code: string; message: string };
    status: 'success' | 'error';
    data: T;
}

export interface SelloutImagesResponse {
    accuracy: number | null;
    appVersion: string | null;
    employeeId: number | null;
    id: number;
    isDelete: boolean | null;
    latitude: number;
    longitude: number;
    mocked: boolean | null;
    orderCode: string | null;
    photoByte: string | null;
    photoCode: string | null;
    photoS3: string | null;
    photoTime: string;
    photoType: number;
    photoUrl: string;
    platform: string | null;
    reportDate: string | null;
    sellId: number;
    shiftId: number | null;
    shopId: number | null;
}

export interface SellOutImageTypeResponse {
    campaignId: number;
    photoTypeCode: string;
    photoTypeName: string;
    typeId: number;
}

export interface CampaignsResponse {
    id: number;
    campaignName: string;
    campaignDesc: string;
    campaignType: string;
    newOutlet: null;
    checkStatusOutlet: null;
    checkIsInstall: null;
    enableGoogleDrive: null;
    enableFaceDetect: null;
    faceDetectProvinceId: null;
    googleDrivePrivateKeyFile: null;
    googleDriveFolderPath: null;
    googleDriveRootFolderId: null;
    startDate: string;
    endDate: null;
}

export interface OutletsResponse extends Response {
    shopId: number;
    campaignId: number;
    subCampaignId: null | number;
    shopCode: string;
    shopName: string;
    address: string;
    shopTypeId: number;
    regionId: number;
    regionCode: null | string;
    areaId: null | number;
    provinceId: number;
    districtId: number;
    accountId: null | number;
    channelId: number;
    latitude: number;
    longitude: number;
    photo: string;
    supervisor: string;
    contactMobile: string;
    numOfHouse: string;
    street: string;
    wardId: null | number;
    noPoster: number;
    asm: null | any;
    createdDate: null | Date;
    routePlanId: number;
    employeeId: number;
    workingDate: Date;
    shiftId: number;
    employeeCode: string;
    employeeName: string;
    roleName: string;
    positionName: null | string;
    positionCode: null | string;
    provinceName: string;
    districtName: string;
    accountName: null | string;
    channelName: null | string;
    isCheckOut: number;
    isCheckIn: number;
    approved: boolean;
    status: number;
    remark: string;
    shiftName: string;
    campaignName: string;
    shopTypeName: null | string;
    wardName: null | string;
}

export interface SellOutTypesResponse {
    sellOutTypeName: string;
    id: number;
    name: string;
    campaignId: null;
    uniqueMobile: boolean;
    requirePhoto: boolean;
    isCapturePhoto: boolean;
    note: string;
    isSelectGift: null;
    selectGiftType: null;
    isInputProduct: null;
    isInputBillNumber: null;
    active: null;
    orderBy: null;
    rules: string;
}

export interface ProfileResponse {
    password: string | null;
    roleName: string;
    clientId: string | null;
    clientName: string | null;
    campaignName: string | null;
    positionName: string | null;
    campaignType: string | null;
    roleType: string;
    employeeId: number;
    campaignId: number;
    parentId: number;
    employeeCode: string;
    employeeName: string;
    shortName: string | null;
    nameFilter: string | null;
    roleId: number;
    positionId: number;
    sex: boolean;
    birthDay: string | null;
    idNumber: string;
    idDate: string | null;
    idPlace: string;
    domicile: string | null;
    permanentResidense: string | null;
    mobile: string;
    email: string;
    userName: string;
    photo: string;
    active: number;
    administrator: string | null;
    createdate: string;
}

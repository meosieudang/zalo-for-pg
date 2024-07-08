import { TYPE } from '../constant';

export type StateExchangeGiftStep1 = {
    campaignId: number;
    reportDate: string;
    selloutType?: string; // Optional property
    shopId: number;
    giftType: TYPE;
    provinceId: number;
};

// import { formatCurrency } from '@coingecko/cryptoformat';
// import faker, { Faker } from '@faker-js/faker';
// import i18n from '@i18n';
// import numeral from 'numeral';

import _, { LoDashStatic } from "lodash";
import moment from "moment";
import Swal from "sweetalert2/dist/sweetalert2.js";

declare global {
  interface Window {
    _: LoDashStatic;
    moment: {};
    Swal: {};
    // faker: Faker;
    // numeral: any;
    // getDaysInMonth: (currentMoment?: moment.MomentInput) => moment.Moment[];
    // clients: any;
    // appInfo: {
    //   version: string;
    // };
    // formatCurrency: any;
    // i18n: any;
    // t: (key: string, value?: undefined | null | object) => string;
  }
}

window._ = _;
window.moment = moment;
window.Swal = Swal;

// window.appInfo = {
//   version: "1.0.0",
// };

// window.numeral = numeral;
// window.formatCurrency = formatCurrency;
// window.faker = faker;
// window.i18n = i18n;
// window.t = i18n['t'];
// window.getDaysInMonth = (currentMoment?: moment.MomentInput) => {
//   const daysInMonth: moment.Moment[] = [];
//   const monthDate = moment(currentMoment).startOf("month");

//   for (let i = 0; i < monthDate.daysInMonth(); i + 1) {
//     const newDay = monthDate.clone().add(i, "days");
//     daysInMonth.push(newDay);
//   }

//   return daysInMonth;
// };

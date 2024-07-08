// import { formatCurrency } from '@coingecko/cryptoformat';
// import faker, { Faker } from '@faker-js/faker';
// import i18n from '@i18n';
// import numeral from 'numeral';

import _, { LoDashStatic } from 'lodash';
import moment from 'moment';
import Swal, { SweetAlertResult } from 'sweetalert2';

declare global {
    interface Window {
        _: LoDashStatic;
        moment: {};
        Swal: {};
        SwalConfirm: ({
            title,
            text,
            confirmButtonText
        }: {
            title?: string;
            text?: string;
            confirmButtonText?: string;
        }) => Promise<SweetAlertResult<any>>;
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
window.SwalConfirm = ({ title = 'Bạn có chắc chắn?', text = `Dữ liệu thông tin sẽ mất!`, confirmButtonText = 'Có' }) =>
    Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText,
        cancelButtonText: 'Không',
        customClass: {
            container: 'my-swal'
        }
    });

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

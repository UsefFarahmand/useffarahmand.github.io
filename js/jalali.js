/* ================================================
   jalali.js  —  Gregorian → Jalali (Persian) date
   Lightweight, dependency-free converter.
================================================ */

(function (global) {
    const PERSIAN_MONTHS = [
        'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
        'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
    ];

    const PERSIAN_DIGITS = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];

    function toPersianDigits(str) {
        return String(str).replace(/[0-9]/g, d => PERSIAN_DIGITS[d]);
    }

    function div(a, b) { return Math.trunc(a / b); }

    // Algorithm: convert Gregorian date to Jalali (Hijri Shamsi)
    function gregorianToJalali(gy, gm, gd) {
        const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        let jy;
        if (gy > 1600) { jy = 979; gy -= 1600; }
        else { jy = 0; gy -= 621; }

        const gy2 = (gm > 2) ? (gy + 1) : gy;
        let days = (365 * gy) + div(gy2 + 3, 4) - div(gy2 + 99, 100) +
                   div(gy2 + 399, 400) - 80 + gd + g_d_m[gm - 1];

        jy += 33 * div(days, 12053);
        days %= 12053;

        jy += 4 * div(days, 1461);
        days %= 1461;

        if (days > 365) {
            jy += div(days - 1, 365);
            days = (days - 1) % 365;
        }

        let jm, jd;
        if (days < 186) {
            jm = 1 + div(days, 31);
            jd = 1 + (days % 31);
        } else {
            jm = 7 + div(days - 186, 30);
            jd = 1 + ((days - 186) % 30);
        }

        return [jy, jm, jd];
    }

    /**
     * Format a JS Date (or date string) as a Persian (Jalali) date string.
     * @param {Date|string} dateInput
     * @param {object} opts  { day: bool (default true) }
     * @returns {string} e.g. "۱۲ دی ۱۴۰۲" or "دی ۱۴۰۲" if day=false
     */
    function formatJalali(dateInput, opts) {
        opts = opts || {};
        const showDay = opts.day !== false;

        const date = (dateInput instanceof Date) ? dateInput : new Date(dateInput);
        if (isNaN(date.getTime())) return '';

        const gy = date.getFullYear();
        const gm = date.getMonth() + 1;
        const gd = date.getDate();

        const [jy, jm, jd] = gregorianToJalali(gy, gm, gd);
        const monthName = PERSIAN_MONTHS[jm - 1];

        if (showDay) {
            return `${toPersianDigits(jd)} ${monthName} ${toPersianDigits(jy)}`;
        }
        return `${monthName} ${toPersianDigits(jy)}`;
    }

    global.toJalali = formatJalali;
    global.toPersianDigits = toPersianDigits;
})(window);

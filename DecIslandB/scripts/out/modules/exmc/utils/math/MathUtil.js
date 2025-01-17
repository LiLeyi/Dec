export default class MathUtil {
    static clamp(num, low, high) {
        if (low > high) {
            return MathUtil.clamp(num, high, low);
        }
        return Math.max(low, Math.min(high, num));
    }
    static IEEEremainder(dividend, divisor) {
        return dividend - (divisor * Math.round(dividend / divisor));
    }
    static remainder(dividend, divisor) {
        return dividend - (divisor * Math.floor(dividend / divisor));
    }
    static isNumber(val) {
        var regPos = /^\d+(\.\d+)?$/; //非负浮点数
        var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/;
        return regPos.test(val) && regNeg.test(val);
    }
    static zeroIfNaN(num) {
        if (typeof num === "string")
            num = parseFloat(num);
        if (num === undefined)
            return 0;
        return isNaN(num) ? 0 : num;
    }
    static randomInteger(min, max) {
        let length = Math.floor(Math.random() * (max - min + 1));
        return min + length;
    }
    static round(x, n) {
        return Math.round(x * (Math.pow(10, n))) / (Math.pow(10, n));
    }
}
//# sourceMappingURL=MathUtil.js.map
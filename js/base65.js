(function (window, undefined) {
    var simbols = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_~';

    var Base65 = {
        isNumeric: /^[0-9]+$/,
        encode: function(number) {
            var ret = '', module, base = simbols.length;
            if (!this.isNumeric.test(number)) {
                console.log(number);
                console.error("received instead number: ", number);
                return;
            }
            number = bigInt(number);
            while (!number.equals(0)) {
                dm = number.divmod(base);
                if (number.equals(dm.remainder)) {
                    number = bigInt(0);
                } else {
                    number = dm.quotient;
                }
                ret += simbols[dm.remainder.toJSNumber()];
            };
            return ret
        },
        decode: function(data) {
            var dl = data.length, ret = bigInt(0), base = bigInt(simbols.length),
                number;
            for (var i=0; i<dl; i++) {
                number = simbols.indexOf(data[i]);
                if (number === -1) {
                    throw new Error('Character: "' + data[i] + '" not allowed');
                }
                ret = ret.plus(bigInt(number).multiply(base.pow(i)));
            }
            console.log(ret.toString());
            return ret.toString();
        }
    }
    window.Base65 = Base65;

})(window);

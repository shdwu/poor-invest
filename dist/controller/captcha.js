"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const captcha = require("svg-captcha");
exports.getCaptcha = (req, res) => {
    const svgCaptcha = captcha.create();
    req.session.captcha = svgCaptcha.text;
    res.type("svg");
    res.status(200).send(svgCaptcha.data);
};
//# sourceMappingURL=captcha.js.map
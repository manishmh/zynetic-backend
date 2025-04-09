"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenAuthorization = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tokenAuthorization = (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            res.status(401).json({ message: "no access token" });
        }
        const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_ACCESS_SECRET);
        console.log('decoded', decoded);
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error(error);
        res.status(403).json({ message: "invalid access token" });
    }
};
exports.tokenAuthorization = tokenAuthorization;

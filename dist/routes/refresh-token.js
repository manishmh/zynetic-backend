"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../src/prisma"));
dotenv_1.default.config();
const RefreshRouter = (0, express_1.Router)();
RefreshRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            res.status(401).json({ message: "no refresh token" });
        }
        const refreshCompare = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = yield prisma_1.default.user.findUnique({
            where: { id: refreshCompare.userId },
        });
        if ((user === null || user === void 0 ? void 0 : user.refreshToken) !== token) {
            res.status(403).json({ message: "invalid refresh token" });
        }
        const newAccessToken = jsonwebtoken_1.default.sign({ userId: user === null || user === void 0 ? void 0 : user.id, email: user === null || user === void 0 ? void 0 : user.email }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
        res.cookie("accessToken", newAccessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 });
        res.status(200).json({ message: "access token generated" });
    }
    catch (err) {
        res.status(403).json({ message: "Server error, Invalid refresh token" });
    }
}));
exports.default = RefreshRouter;

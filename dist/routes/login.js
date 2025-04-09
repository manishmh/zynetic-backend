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
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../src/prisma"));
const constant_1 = require("../src/constant");
dotenv_1.default.config();
const LoginRouter = (0, express_1.Router)();
LoginRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "email and password are required" });
        }
        else {
            const user = yield prisma_1.default.user.findUnique({ where: { email } });
            if (!user) {
                res.status(400).json({ message: "user with this credentials does not exist" });
            }
            else {
                const isValidPassword = yield bcrypt_1.default.compare(password, user.password);
                if (!isValidPassword) {
                    res.status(401).json({ message: "incorrect credentials" });
                }
                else {
                    const accessToken = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
                    const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
                    yield prisma_1.default.user.update({
                        where: { id: user.id },
                        data: { refreshToken }
                    });
                    const existingProducts = yield prisma_1.default.product.findFirst({
                        where: { userId: user.id }
                    });
                    if (!existingProducts) {
                        const products = (0, constant_1.generateDummyProducts)(user.id);
                        yield prisma_1.default.product.createMany({ data: products });
                    }
                    res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 });
                    res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
                    res.status(200).json({
                        message: "login successful",
                        user: {
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            role: user.role,
                        }
                    });
                }
            }
        }
    }
    catch (error) {
        console.error(error);
        res.status(401).json({ message: "something went wrong." });
    }
}));
exports.default = LoginRouter;

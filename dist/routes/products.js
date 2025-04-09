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
const express_1 = require("express");
const prisma_1 = __importDefault(require("../src/prisma"));
const authorization_1 = require("../middleware/authorization");
const ProductsRouter = (0, express_1.Router)();
ProductsRouter.post('/', authorization_1.tokenAuthorization, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, category, price, rating } = req.body;
        const product = yield prisma_1.default.product.create({
            data: {
                name,
                description,
                category,
                price,
                rating,
                userId: req.user.userId,
            },
        });
        res.status(201).json(product);
    }
    catch (error) {
        res.status(500).json({ message: 'Unable to create product.' });
    }
}));
ProductsRouter.get('/', authorization_1.tokenAuthorization, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield prisma_1.default.product.findMany({
            where: {
                userId: req.user.userId
            }
        });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Unable to fetch products.' });
    }
}));
ProductsRouter.put('/:id', authorization_1.tokenAuthorization, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const data = req.body;
        const updated = yield prisma_1.default.product.update({
            where: { id },
            data,
        });
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ message: 'Unable to update product.' });
    }
}));
ProductsRouter.delete('/:id', authorization_1.tokenAuthorization, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma_1.default.product.delete({
            where: { id },
        });
        res.json({ message: 'Product deleted.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Unable to delete product.' });
    }
}));
exports.default = ProductsRouter;

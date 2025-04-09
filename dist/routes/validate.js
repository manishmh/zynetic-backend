"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authorization_1 = require("../middleware/authorization");
const validateRouter = (0, express_1.Router)();
validateRouter.get('/', authorization_1.tokenAuthorization, (req, res) => {
    res.status(200).json({ user: req.user });
});
exports.default = validateRouter;

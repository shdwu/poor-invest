"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const villageSchema = new mongoose.Schema({
    name: String,
    detailName: String
}, { timestamps: true });
const Village = mongoose.model("Village", villageSchema);
exports.default = Village;
//# sourceMappingURL=village.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const poorCellSchema = new mongoose.Schema({
    name: String,
    userCode: { type: String, unique: true },
    phone: String,
    cell: {
        cellCode: String,
        relationship: String,
    },
    helpPerson: {
        name: String,
        position: String,
        phone: String
    }
}, { timestamps: true });
const PoorCell = mongoose.model("PoorCell", poorCellSchema);
exports.default = PoorCell;
//# sourceMappingURL=poor-cell.js.map
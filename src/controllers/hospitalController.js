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
Object.defineProperty(exports, "__esModule", { value: true });
const requestService_1 = require("../services/requestService");
class hospitalController extends requestService_1.RequestService {
    constructor() {
        super(...arguments);
        this.acceptCase = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.acceptUserCase(req, res, next);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        this.rejectCase = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.rejectUserCase(req, res, next);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
}
exports.default = hospitalController;

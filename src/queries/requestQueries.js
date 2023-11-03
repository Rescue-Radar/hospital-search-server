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
exports.fetchTicketIssue = exports.insertIntoTicketIssue = exports.fetchHospitals = exports.isExistingHospital = exports.isExistingPatient = void 0;
const db_config_1 = __importDefault(require("../configs/db.config"));
const isExistingPatient = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const checkUserIdQuery = "SELECT * FROM public.patient WHERE id = $1";
    const result = yield db_config_1.default.query(checkUserIdQuery, [userId]);
    return result;
});
exports.isExistingPatient = isExistingPatient;
const isExistingHospital = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const checkUserIdQuery = "SELECT * FROM public.hospital WHERE id = $1";
    const result = yield db_config_1.default.query(checkUserIdQuery, [userId]);
    return result;
});
exports.isExistingHospital = isExistingHospital;
const fetchHospitals = () => __awaiter(void 0, void 0, void 0, function* () {
    const getHospitals = "SELECT id,name,latitude,longitude FROM public.hospital";
    const result = yield db_config_1.default.query(getHospitals);
    return result;
});
exports.fetchHospitals = fetchHospitals;
const insertIntoTicketIssue = (id, name, phoneNumber, hospitalId, userId, status, timeStampe, latitude, longitude, acceptCase, rejectCase) => __awaiter(void 0, void 0, void 0, function* () {
    const insertIntoTicketIssueQuery = `INSERT INTO public.ticket_issued (id,name,"phoneNumber","hospitalId","patientId",status,"createdAt",latitude,longitude,"acceptCase","rejectCase") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) on conflict ("hospitalId","patientId") 
	do nothing RETURNING *;`;
    const result = yield db_config_1.default.query(insertIntoTicketIssueQuery, [id, name, phoneNumber, hospitalId, userId, status, timeStampe, latitude, longitude, acceptCase, rejectCase]);
    return result;
});
exports.insertIntoTicketIssue = insertIntoTicketIssue;
const fetchTicketIssue = () => __awaiter(void 0, void 0, void 0, function* () {
    const getTicketIssueQuery = `SELECT * FROM public.ticket_issued WHERE status = false`;
    const result = yield db_config_1.default.query(getTicketIssueQuery);
    return result;
});
exports.fetchTicketIssue = fetchTicketIssue;

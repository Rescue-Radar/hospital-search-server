"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.RequestService = void 0;
const requestQueries_1 = require("../queries/requestQueries");
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: `${__dirname}/.env` });
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
            Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
}
function deg2rad(deg) {
    return deg * (Math.PI / 180);
}
class RequestService {
    constructor() {
        this.searchHospitals = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { name, phoneNumber, latitude, longitude } = req.body;
            const maxRadius = 100;
            let radius = 5; // Starting search radius in kilometers
            let filteredHospitals;
            if (!latitude || !longitude || !maxRadius) {
                return res.status(400).json({ error: "Missing required parameters" });
            }
            const findHospitals = () => __awaiter(this, void 0, void 0, function* () {
                const hospitals = yield (0, requestQueries_1.fetchHospitals)();
                console.log(hospitals);
                //   filteredHospitals = hospitals.filter((hospital) => {
                //     const distance = calculateDistance(
                //       latitude,
                //       longitude,
                //       hospital.lat,
                //       hospital.lng
                //     );
                //     return distance <= radius;
                //   });
                //   if (filteredHospitals.length === 0 && radius < maxRadius) {
                //     // If no hospitals found and radius is less than max, increase radius
                //     radius += 10; // You can adjust the increment value as needed
                //     setTimeout(findHospitals, 30000); // Retry after a timeout
                //   } else {
                //     res.json({ hospitals: filteredHospitals });
                //   }
            });
            findHospitals();
        });
        this.acceptUserCase = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (!req.body || !req.body.hospitalId || !req.body.userId) {
                return res.status(400).json({
                    error: '"UserId" and "HospitalId" are required!',
                });
            }
            try {
                const hospitalId = req.body.hospitalId;
                const userId = req.body.userId;
                // Call your function to fetch the case from the database
                const caseData = JSON.parse(JSON.stringify(yield (0, requestQueries_1.fetchCase)(hospitalId, userId)));
                if (caseData) {
                    if (caseData.status) {
                        return res.status(404).json({
                            error: "Case already accepted",
                        });
                    }
                    yield (0, requestQueries_1.setStatus)(userId);
                    yield (0, requestQueries_1.setAccepted)(hospitalId, userId);
                    res.status(200).json({
                        message: "case accepted",
                        caseDetails: caseData,
                    });
                }
                else {
                    return res.status(404).json({ error: "Case not found" });
                }
            }
            catch (error) {
                console.error("Error accepting user case:", error);
                return res.status(500).json({ error: "Internal server error" });
            }
        });
        this.rejectUserCase = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (!req.body || !req.body.hospitalId || !req.body.userId) {
                return res.status(400).json({
                    error: '"UserId" and "HospitalId" are required!',
                });
            }
            try {
                const hospitalId = req.body.hospitalId;
                const userId = req.body.userId;
                // Call your function to fetch the case from the database
                const caseData = JSON.parse(JSON.stringify(yield (0, requestQueries_1.fetchCase)(hospitalId, userId)));
                if (caseData) {
                    yield (0, requestQueries_1.setRejected)(hospitalId, userId);
                    res.status(200).json({
                        message: "case rejected",
                    });
                }
                else {
                    return res.status(404).json({ error: "Case not found" });
                }
            }
            catch (error) {
                console.error("Error accepting user case:", error);
                return res.status(500).json({ error: "Internal server error" });
            }
        });
    }
}
exports.RequestService = RequestService;

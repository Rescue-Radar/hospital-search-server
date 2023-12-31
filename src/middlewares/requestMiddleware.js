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
exports.authenticateHospital = exports.protect = exports.findAndAddUser = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const requestQueries_1 = require("../queries/requestQueries");
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: `${__dirname}/.env` });
function findAndAddUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authorizationHeader = req.headers.authorization;
            if (authorizationHeader) {
                const token = authorizationHeader.split(" ")[1];
                const secret = process.env.JWT_SECRET || "";
                if (!secret) {
                    throw new Error("JWT_SECRET is not defined");
                }
                else {
                    try {
                        const payload = jwt.verify(token, secret);
                        if (payload) {
                            const id = payload.userId;
                            const result = yield (0, requestQueries_1.isExistingPatient)(id);
                            const user = result.rows[0];
                            if (user) {
                                req.body.userId = id;
                                next();
                            }
                            else {
                                res.status(401).json("unauthorized");
                            }
                        }
                    }
                    catch (error) {
                        console.log(error);
                        if (error.name === "TokenExpiredError") {
                            // Handle the expired JWT error
                            res.status(401).json({ error: "JWT token has expired" });
                        }
                        else {
                            // Handle other JWT verification errors
                            res.status(401).json({ error: "JWT verification failed" });
                        }
                    }
                }
            }
            else {
                res.status(401).json({ error: "LogIn to access" });
            }
        }
        catch (error) {
            // Handle other errors
            res.status(401).json({ error: "Internal server Error" });
        }
    });
}
exports.findAndAddUser = findAndAddUser;
function protect(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authorizationHeader = req.headers.authorization;
            if (authorizationHeader) {
                const token = authorizationHeader.split(" ")[1];
                const secret = process.env.JWT_SECRET || "";
                if (!secret) {
                    throw new Error("JWT_SECRET is not defined");
                }
                else {
                    try {
                        const payload = jwt.verify(token, secret);
                        if (payload) {
                            next();
                        }
                    }
                    catch (error) {
                        console.log(error);
                        if (error.name === "TokenExpiredError") {
                            // Handle the expired JWT error
                            res.status(401).json({ error: "JWT token has expired" });
                        }
                        else {
                            // Handle other JWT verification errors
                            res.status(401).json({ error: "JWT verification failed" });
                        }
                    }
                }
            }
            else {
                res.status(401).json({ error: "LogIn to access" });
            }
        }
        catch (error) {
            // Handle other errors
            res.status(401).json({ error: "Internal server Error" });
        }
    });
}
exports.protect = protect;
function authenticateHospital(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authorizationHeader = req.headers.authorization;
            if (authorizationHeader) {
                const token = authorizationHeader.split(" ")[1];
                const secret = process.env.JWT_SECRET || "";
                if (!secret) {
                    throw new Error("JWT_SECRET is not defined");
                }
                else {
                    const payload = jwt.verify(token, secret);
                    console.log("hospital payload->", payload);
                    if (payload) {
                        const id = payload.userId;
                        console.log(id);
                        const result = yield (0, requestQueries_1.isExistingHospital)(id);
                        const user = result.rows[0];
                        if (user) {
                            req.body.userId = id;
                            next();
                        }
                        else {
                            res.status(401).json("user Does not Exist");
                        }
                    }
                    else {
                        res.status(401).json("unauthorized");
                    }
                }
            }
            else {
                res.status(401).json({ error: "LogIn to access" });
            }
        }
        catch (error) {
            // Handle the error and return a response
            res
                .status(401)
                .json({ error: "Internal server Error", errors: error.message });
        }
    });
}
exports.authenticateHospital = authenticateHospital;

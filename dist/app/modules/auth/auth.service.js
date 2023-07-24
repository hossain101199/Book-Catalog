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
exports.authService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const user_model_1 = require("../user/user.model");
const createUserInDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const createdUser = yield user_model_1.User.create(payload);
    return createdUser;
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const isUserExist = yield user_model_1.User.findOne({ email }, { name: 1, email: 1, password: 1 });
    // const isUserExist = await User.isUserExist(id);
    if (isUserExist) {
        // if (await User.isPasswordMatched(password, isUserExist.password)) {
        if (yield bcrypt_1.default.compare(password, isUserExist.password)) {
            const { id, name, email } = isUserExist;
            const accessToken = jsonwebtoken_1.default.sign({
                id,
                name,
                email,
            }, config_1.default.jwt.secret, { expiresIn: config_1.default.jwt.expires_in });
            return {
                accessToken,
            };
        }
        else {
            throw new ApiError_1.default(401, 'Password is incorrect');
        }
    }
    else {
        throw new ApiError_1.default(404, 'User does not exist');
    }
});
exports.authService = {
    createUserInDB,
    loginUser,
};

// prisma/seed.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { PrismaClient } from "@prisma/client";
import { Argon2id } from "oslo/password";
var prisma = new PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        function hashPasswords() {
            return __awaiter(this, void 0, void 0, function () {
                var argon2id, _i, nUsers_1, user, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            argon2id = new Argon2id();
                            _i = 0, nUsers_1 = nUsers;
                            _b.label = 1;
                        case 1:
                            if (!(_i < nUsers_1.length)) return [3 /*break*/, 4];
                            user = nUsers_1[_i];
                            _a = user;
                            return [4 /*yield*/, argon2id.hash(user.hashedPassword)];
                        case 2:
                            _a.hashedPassword = _b.sent();
                            _b.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
        function hashAPasswords() {
            return __awaiter(this, void 0, void 0, function () {
                var argon2id, _i, agencyUsers_1, user, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            argon2id = new Argon2id();
                            _i = 0, agencyUsers_1 = agencyUsers;
                            _b.label = 1;
                        case 1:
                            if (!(_i < agencyUsers_1.length)) return [3 /*break*/, 4];
                            user = agencyUsers_1[_i];
                            _a = user;
                            return [4 /*yield*/, argon2id.hash(user.hashedPassword)];
                        case 2:
                            _a.hashedPassword = _b.sent();
                            _b.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
        var nUsers, agencies, agenciesPromises, normalUserPromises, agencyUsers, agenciyUsersPromises;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nUsers = [
                        {
                            id: "a112c3d4-e5f6-7890-abcd-ef12345678901",
                            email: "user1@example.com",
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            role: "USER",
                            firstName: "John",
                            lastName: "Doe",
                            hashedPassword: "password1",
                            // hashedPassword: await new Argon2id().hash("user" + "1"),
                            picture: "",
                            agencyId: null,
                            emailVerified: new Date(),
                            phone: "022 123 4567",
                            phoneVerified: new Date(),
                        },
                        {
                            id: "a122c3d4-e5f6-7890-abcd-ef12345678901",
                            email: "user2@example.com",
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            role: "USER",
                            firstName: "Jane",
                            lastName: "Smith",
                            hashedPassword: "password2",
                            picture: "",
                            agencyId: null,
                            emailVerified: new Date(),
                            phone: "022 123 4567",
                            phoneVerified: new Date(),
                        },
                        {
                            id: "a132c3d4-e5f6-7890-abcd-ef12345678901",
                            email: "user3@example.com",
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            role: "USER",
                            firstName: "Michael",
                            lastName: "Johnson",
                            hashedPassword: "password3",
                            picture: "",
                            agencyId: null,
                            emailVerified: new Date(),
                            phone: "022 123 4567",
                            phoneVerified: new Date(),
                        },
                        {
                            id: "a142c3d4-e5f6-7890-abcd-ef12345678901",
                            email: "user4@example.com",
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            role: "USER",
                            firstName: "Emily",
                            lastName: "Brown",
                            hashedPassword: "password4",
                            picture: "",
                            agencyId: null,
                            emailVerified: new Date(),
                            phone: "022 123 4567",
                            phoneVerified: new Date(),
                        },
                        {
                            id: "a152c3d4-e5f6-7890-abcd-ef12345678901",
                            email: "user5@example.com",
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            role: "USER",
                            firstName: "David",
                            lastName: "Wilson",
                            hashedPassword: "password5",
                            picture: "",
                            agencyId: null,
                            emailVerified: new Date(),
                            phone: "022 123 4567",
                            phoneVerified: new Date(),
                        },
                    ];
                    agencies = [
                        {
                            id: "agency1",
                            name: "Agency 1",
                            slug: "agency-1",
                            address: "123 Main Street, Anytown, USA",
                            website: "https://www.agency1.com",
                            phone: "+1234567890",
                            logoUrl: "https://m1.spitogatos.gr/94825956_100x50.jpg",
                            contactPersonFullName: "John Doe",
                            contactPersonEmail: "johndoe@example.com",
                            contactPersonPhone: "+1234567890",
                            workHours: "9:00 AM - 5:00 PM",
                            gpsLocation: "40.7128, -74.0060",
                            description: "BINSWANGER BINIARIS Company represents exclusively in Greece the International Group BINSWANGER AMERICA LLC (www.binswanger.com), leader in the international real estate market, with clients 2/3 of the companies of FORTUNE 500, providing complete solutions to multinational companies related to their needs in the real estate sector.\n    Our Company, in addition to the activity of its residential sector, with the support of the specialized in-house departments of our engineering and legal consultants, provides additional integrated solutions in special real estate issues, such as the relocation of multinational companies, the renegotiation of rents, the appraisal of the property, the preparation of studies, the full consulting coverage of our clients, etc.",
                            shortDescription: "A brief description of Agency 1.",
                            branding: "",
                        },
                        {
                            id: "agency2",
                            name: "Agency 2",
                            slug: "agency-2",
                            address: "123 Main Street, Anytown, USA",
                            website: "https://www.agency2.com",
                            phone: "+1234567890",
                            logoUrl: "https://m1.spitogatos.gr/256486380_100x50.jpg",
                            contactPersonFullName: "Sasko Saskovski",
                            contactPersonEmail: "sasko@example.com",
                            contactPersonPhone: "+1234567890",
                            workHours: "9:00 AM - 5:00 PM",
                            gpsLocation: "40.7128, -74.0060",
                            description: "Who we are\n    At Real Estate One, we provide high quality services in the field of Property Management through many years of professional knowledge and expertise.\n    \n    At our offices, our specialized Consultants, with integrity and professionalism will help you find the property you really want through our portfolio of more than 30,000 properties.\n    \n    Our Knowledge & Expertise are always at your service!\n    ",
                            shortDescription: "A brief description of Agency 2.",
                            branding: "",
                        },
                        {
                            id: "agency3",
                            name: "Agency 3",
                            slug: "agency-3",
                            address: "123 Main Street, Anytown, USA",
                            website: "https://www.agency3.com",
                            phone: "+1234567890",
                            logoUrl: "https://m1.spitogatos.gr/242517570_100x50.jpg",
                            contactPersonFullName: "Petko Petkovski",
                            contactPersonEmail: "petko@example.com",
                            contactPersonPhone: "+1234567890",
                            workHours: "9:00 AM - 5:00 PM",
                            gpsLocation: "40.7128, -74.0060",
                            description: "The real estate agency Keller Williams Athens Riviera operates in Attica, especially in the area of the southern suburbs of Athens. Our experience in the real estate industry begins in 1977 as a construction company in Neo Kosmos.\n    \n    Our main concern is to be a quality choice in the provision of real estate services, offering vertically integrated services to the entire range of the real estate market. Our team consists of trained real estate consultants to Keller Williams standards and is complemented by an engineer, architect, decorator, mechanical engineer, REV/MRICS real estate appraiser, attorney and notary public\n    ",
                            shortDescription: "A brief description of Agency 3.",
                            branding: "",
                        },
                        {
                            id: "agency4",
                            name: "Agency 4",
                            slug: "agency-4",
                            address: "123 Main Street, Anytown, USA",
                            website: "https://www.agency4.com",
                            phone: "+1234567890",
                            logoUrl: "https://m1.spitogatos.gr/1658724_100x50.jpg",
                            contactPersonFullName: "Papp Pappev",
                            contactPersonEmail: "papp@example.com",
                            contactPersonPhone: "+1234567890",
                            workHours: "9:00 AM - 5:00 PM",
                            gpsLocation: "40.7128, -74.0060",
                            description: "",
                            shortDescription: "A brief description of Agency 4.",
                            branding: "",
                        },
                        {
                            id: "agency5",
                            name: "Agency 5",
                            slug: "agency-5",
                            address: "123 Main Street, Anytown, USA",
                            website: "https://www.agency5.com",
                            phone: "+1234567890",
                            logoUrl: "https://m1.spitogatos.gr/210921582_100x50.jpg",
                            contactPersonFullName: "Boriz Borizov",
                            contactPersonEmail: "boriz@example.com",
                            contactPersonPhone: "+1234567890",
                            workHours: "9:00 AM - 5:00 PM",
                            gpsLocation: "40.7128, -74.0060",
                            description: "The real estate market is one of its most demanding and competitive industries\n    economy, as it is directly linked to all productive sectors.\n    \n    BlueBrick and its partners, with responsibility, knowledge and reliability, making use of it\n    their many years of experience, excellent training, new technologies and modern developments\n    in the real estate industry, provides comprehensive and high-level consulting\n    services, in the field of research and information about the real estate market, the\n    investment opportunities in the industry as well as finding properties at very affordable prices",
                            shortDescription: "A brief description of Agency 5.",
                            branding: "",
                        },
                    ];
                    agenciesPromises = agencies.map(function (agency) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, prisma.agency.upsert({
                                        where: { id: agency.id },
                                        update: {},
                                        create: agency,
                                    })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.all(agenciesPromises)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, hashPasswords()];
                case 2:
                    _a.sent();
                    normalUserPromises = nUsers.map(function (user) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, prisma.user.upsert({
                                        where: { id: user.id },
                                        update: {},
                                        create: user,
                                    })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    agencyUsers = [
                        {
                            id: "g112c3d4-e5f6-7890-abcd-ef12345678901",
                            email: "agency1@example.com",
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            role: "AGENCY",
                            firstName: "Agency1",
                            lastName: "Owner1",
                            hashedPassword: "password1",
                            picture: "",
                            agencyId: "agency1",
                            emailVerified: new Date(),
                            phone: "044 123 4567",
                            phoneVerified: new Date(),
                        },
                        {
                            id: "g122c3d4-e5f6-7890-abcd-ef12345678901",
                            email: "agency2@example.com",
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            role: "AGENCY",
                            firstName: "Agency2",
                            lastName: "Owner2",
                            hashedPassword: "password2",
                            picture: "",
                            agencyId: "agency2",
                            emailVerified: new Date(),
                            phone: "044 123 4567",
                            phoneVerified: new Date(),
                        },
                        {
                            id: "g132c3d4-e5f6-7890-abcd-ef12345678901",
                            email: "agency3@example.com",
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            role: "AGENCY",
                            firstName: "Agency3",
                            lastName: "Owner3",
                            hashedPassword: "password3",
                            picture: "",
                            agencyId: "agency3",
                            emailVerified: new Date(),
                            phone: "044 123 4567",
                            phoneVerified: new Date(),
                        },
                        {
                            id: "g142c3d4-e5f6-7890-abcd-ef12345678901",
                            email: "agency4@example.com",
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            role: "AGENCY",
                            firstName: "Agency4",
                            lastName: "Owner4",
                            hashedPassword: "password4",
                            picture: "",
                            agencyId: "agency4",
                            emailVerified: new Date(),
                            phone: "044 123 4567",
                            phoneVerified: new Date(),
                        },
                        {
                            id: "g152c3d4-e5f6-7890-abcd-ef12345678901",
                            email: "agency5@example.com",
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            role: "AGENCY",
                            firstName: "Agency5",
                            lastName: "Owner5",
                            hashedPassword: "password5",
                            picture: "",
                            agencyId: "agency5",
                            emailVerified: new Date(),
                            phone: "044 123 4567",
                            phoneVerified: new Date(),
                        },
                    ];
                    return [4 /*yield*/, hashAPasswords()];
                case 3:
                    _a.sent();
                    agenciyUsersPromises = agencyUsers.map(function (user) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: 
                                // const existing = await prisma.user.findFirst({
                                //   where: { id: user.id },
                                // });
                                // if (!existing) {
                                return [4 /*yield*/, prisma.user.upsert({
                                        where: { id: user.id },
                                        update: {},
                                        create: user,
                                    })];
                                case 1:
                                    // const existing = await prisma.user.findFirst({
                                    //   where: { id: user.id },
                                    // });
                                    // if (!existing) {
                                    _a.sent();
                                    console.log("added user", user.id);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.all(agenciyUsersPromises)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, Promise.all(normalUserPromises)];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .then(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })
    .catch(function (e) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.error(e);
                return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                process.exit(1);
                return [2 /*return*/];
        }
    });
}); });

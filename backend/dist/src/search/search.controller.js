"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const search_service_1 = require("./search.service");
const search_dto_1 = require("./dto/search.dto");
const public_decorator_1 = require("../auth/decorators/public.decorator");
let SearchController = class SearchController {
    searchService;
    constructor(searchService) {
        this.searchService = searchService;
    }
    async searchVehicles(query) {
        const { items, meta } = await this.searchService.searchVehicles(query);
        return {
            success: true,
            message: 'Vehicles fetched successfully',
            data: {
                items,
                ...meta,
            },
        };
    }
    async getFilters() {
        const data = await this.searchService.getFilters();
        return {
            message: 'Filters fetched successfully',
            data,
        };
    }
    async searchHosts(query) {
        const data = await this.searchService.searchHosts(query || '');
        return {
            message: 'Hosts fetched successfully',
            data,
        };
    }
    async autocomplete(query) {
        const data = await this.searchService.autocomplete(query || '');
        return {
            message: 'Suggestions fetched successfully',
            data,
        };
    }
};
exports.SearchController = SearchController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('vehicles'),
    (0, swagger_1.ApiOperation)({ summary: 'Search for vehicles' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_dto_1.SearchVehiclesDto]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "searchVehicles", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('filters'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available search filters' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "getFilters", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('hosts'),
    (0, swagger_1.ApiOperation)({ summary: 'Search for hosts/businesses' }),
    __param(0, (0, common_1.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "searchHosts", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('autocomplete'),
    (0, swagger_1.ApiOperation)({ summary: 'Search autocomplete suggestions' }),
    __param(0, (0, common_1.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "autocomplete", null);
exports.SearchController = SearchController = __decorate([
    (0, swagger_1.ApiTags)('Search'),
    (0, common_1.Controller)('search'),
    __metadata("design:paramtypes", [search_service_1.SearchService])
], SearchController);
//# sourceMappingURL=search.controller.js.map
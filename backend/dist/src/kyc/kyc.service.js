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
Object.defineProperty(exports, "__esModule", { value: true });
exports.KycService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const audit_log_service_1 = require("../audit-log/audit-log.service");
let KycService = class KycService {
    prisma;
    auditLogService;
    constructor(prisma, auditLogService) {
        this.prisma = prisma;
        this.auditLogService = auditLogService;
    }
    async submitRenterKyc(userId, dto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.kycStatus === client_1.KycStatus.verified || user.kycStatus === client_1.KycStatus.pending) {
            throw new common_1.BadRequestException(`KYC is already ${user.kycStatus}`);
        }
        try {
            return await this.prisma.$transaction(async (tx) => {
                await tx.renterProfile.upsert({
                    where: { userId },
                    update: {
                        licenseNumber: dto.licenseNumber,
                        licenseExpiry: dto.licenseExpiry ? new Date(dto.licenseExpiry) : undefined,
                        licenseDocumentUrl: dto.licenseDocumentUrl,
                        selfieUrl: dto.selfieUrl,
                        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
                        state: dto.state,
                        city: dto.city,
                        address: dto.address,
                        emergencyContactName: dto.emergencyContactName,
                        emergencyContactPhone: dto.emergencyContactPhone,
                        drivingChoice: dto.drivingChoice,
                        identificationType: dto.identificationType,
                        identificationDocumentUrl: dto.identificationDocumentUrl,
                        preferredCarType: dto.preferredCarType,
                        primaryRentalPurpose: dto.primaryRentalPurpose,
                        usageFrequency: dto.usageFrequency,
                        typicalTripType: dto.typicalTripType,
                        vehiclePreference: dto.vehiclePreference,
                    },
                    create: {
                        userId,
                        licenseNumber: dto.licenseNumber,
                        licenseExpiry: dto.licenseExpiry ? new Date(dto.licenseExpiry) : undefined,
                        licenseDocumentUrl: dto.licenseDocumentUrl,
                        selfieUrl: dto.selfieUrl,
                        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
                        state: dto.state,
                        city: dto.city,
                        address: dto.address,
                        emergencyContactName: dto.emergencyContactName,
                        emergencyContactPhone: dto.emergencyContactPhone,
                        drivingChoice: dto.drivingChoice,
                        identificationType: dto.identificationType,
                        identificationDocumentUrl: dto.identificationDocumentUrl,
                        preferredCarType: dto.preferredCarType,
                        primaryRentalPurpose: dto.primaryRentalPurpose,
                        usageFrequency: dto.usageFrequency,
                        typicalTripType: dto.typicalTripType,
                        vehiclePreference: dto.vehiclePreference,
                    },
                });
                const submission = await tx.kycSubmission.create({
                    data: {
                        userId,
                        type: client_1.KycType.renter,
                        status: client_1.KycStatus.pending,
                        submittedDataJson: dto,
                    },
                });
                await tx.user.update({
                    where: { id: userId },
                    data: { kycStatus: client_1.KycStatus.pending },
                });
                await this.auditLogService.logAction({
                    actorId: userId,
                    action: 'KYC_RENTER_SUBMITTED',
                    entityType: 'KycSubmission',
                    entityId: submission.id,
                });
                return submission;
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new common_1.BadRequestException('This license number is already registered.');
            }
            throw error;
        }
    }
    async submitHostKyc(userId, dto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.kycStatus === client_1.KycStatus.verified || user.kycStatus === client_1.KycStatus.pending) {
            throw new common_1.BadRequestException(`KYC is already ${user.kycStatus}`);
        }
        try {
            return await this.prisma.$transaction(async (tx) => {
                await tx.hostProfile.upsert({
                    where: { userId },
                    update: {
                        businessName: dto.businessName,
                        cacNumber: dto.cacNumber,
                        taxId: dto.taxId,
                        cacDocumentUrl: dto.cacDocumentUrl,
                        bankName: dto.bankName,
                        accountName: dto.accountName,
                        accountNumber: dto.accountNumber,
                        legalBusinessName: dto.legalBusinessName,
                        tradingName: dto.tradingName,
                        businessType: dto.businessType,
                        rcNumber: dto.rcNumber,
                        dateOfIncorporation: dto.dateOfIncorporation ? new Date(dto.dateOfIncorporation) : undefined,
                        businessState: dto.businessState,
                        businessCity: dto.businessCity,
                        businessAddress: dto.businessAddress,
                        businessPhone: dto.businessPhone,
                        businessEmail: dto.businessEmail,
                        tin: dto.tin,
                        vatStatus: dto.vatStatus,
                        frscFleetStatus: dto.frscFleetStatus,
                        stateTransportPermit: dto.stateTransportPermit,
                        ownerName: dto.ownerName,
                        ownerPhone: dto.ownerPhone,
                        ownerNIN: dto.ownerNIN,
                        ownerDOB: dto.ownerDOB ? new Date(dto.ownerDOB) : undefined,
                        ownerEmail: dto.ownerEmail,
                        ownershipPercentage: dto.ownershipPercentage,
                        cacCertificateUrl: dto.cacCertificate,
                        cacStatusReportUrl: dto.cacStatusReport,
                        utilityBillUrl: dto.utilityBill,
                        taxClearanceCertificateUrl: dto.taxClearanceCertificate,
                    },
                    create: {
                        userId,
                        businessName: dto.businessName,
                        cacNumber: dto.cacNumber,
                        taxId: dto.taxId,
                        cacDocumentUrl: dto.cacDocumentUrl,
                        bankName: dto.bankName,
                        accountName: dto.accountName,
                        accountNumber: dto.accountNumber,
                        legalBusinessName: dto.legalBusinessName,
                        tradingName: dto.tradingName,
                        businessType: dto.businessType,
                        rcNumber: dto.rcNumber,
                        dateOfIncorporation: dto.dateOfIncorporation ? new Date(dto.dateOfIncorporation) : undefined,
                        businessState: dto.businessState,
                        businessCity: dto.businessCity,
                        businessAddress: dto.businessAddress,
                        businessPhone: dto.businessPhone,
                        businessEmail: dto.businessEmail,
                        tin: dto.tin,
                        vatStatus: dto.vatStatus,
                        frscFleetStatus: dto.frscFleetStatus,
                        stateTransportPermit: dto.stateTransportPermit,
                        ownerName: dto.ownerName,
                        ownerPhone: dto.ownerPhone,
                        ownerNIN: dto.ownerNIN,
                        ownerDOB: dto.ownerDOB ? new Date(dto.ownerDOB) : undefined,
                        ownerEmail: dto.ownerEmail,
                        ownershipPercentage: dto.ownershipPercentage,
                        cacCertificateUrl: dto.cacCertificate,
                        cacStatusReportUrl: dto.cacStatusReport,
                        utilityBillUrl: dto.utilityBill,
                        taxClearanceCertificateUrl: dto.taxClearanceCertificate,
                    },
                });
                const submission = await tx.kycSubmission.create({
                    data: {
                        userId,
                        type: client_1.KycType.host,
                        status: client_1.KycStatus.pending,
                        submittedDataJson: dto,
                    },
                });
                await tx.user.update({
                    where: { id: userId },
                    data: { kycStatus: client_1.KycStatus.pending },
                });
                await this.auditLogService.logAction({
                    actorId: userId,
                    action: 'KYC_HOST_SUBMITTED',
                    entityType: 'KycSubmission',
                    entityId: submission.id,
                });
                return submission;
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new common_1.BadRequestException('This CAC number is already registered.');
            }
            throw error;
        }
    }
    async getMyKyc(userId) {
        return this.prisma.kycSubmission.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getKycById(id) {
        const submission = await this.prisma.kycSubmission.findUnique({
            where: { id },
            include: {
                user: {
                    select: { id: true, email: true, firstName: true, lastName: true, role: true },
                },
            },
        });
        if (!submission)
            throw new common_1.NotFoundException('KYC submission not found');
        return submission;
    }
    async approveKyc(id, adminId, dto) {
        const submission = await this.getKycById(id);
        if (submission.status !== client_1.KycStatus.pending) {
            throw new common_1.BadRequestException(`Cannot approve KYC that is ${submission.status}`);
        }
        return this.prisma.$transaction(async (tx) => {
            const updatedSubmission = await tx.kycSubmission.update({
                where: { id },
                data: {
                    status: client_1.KycStatus.verified,
                    reviewedBy: adminId,
                    reviewNotes: dto.reviewNotes,
                    reviewedAt: new Date(),
                },
            });
            await tx.user.update({
                where: { id: submission.userId },
                data: { kycStatus: client_1.KycStatus.verified },
            });
            await this.auditLogService.logAction({
                actorId: adminId,
                action: 'KYC_APPROVED',
                entityType: 'KycSubmission',
                entityId: id,
            });
            return updatedSubmission;
        });
    }
    async rejectKyc(id, adminId, dto) {
        const submission = await this.getKycById(id);
        if (submission.status !== client_1.KycStatus.pending) {
            throw new common_1.BadRequestException(`Cannot reject KYC that is ${submission.status}`);
        }
        return this.prisma.$transaction(async (tx) => {
            const updatedSubmission = await tx.kycSubmission.update({
                where: { id },
                data: {
                    status: client_1.KycStatus.rejected,
                    reviewedBy: adminId,
                    reviewNotes: dto.reviewNotes,
                    reviewedAt: new Date(),
                },
            });
            await tx.user.update({
                where: { id: submission.userId },
                data: { kycStatus: client_1.KycStatus.rejected },
            });
            await this.auditLogService.logAction({
                actorId: adminId,
                action: 'KYC_REJECTED',
                entityType: 'KycSubmission',
                entityId: id,
            });
            return updatedSubmission;
        });
    }
};
exports.KycService = KycService;
exports.KycService = KycService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_log_service_1.AuditLogService])
], KycService);
//# sourceMappingURL=kyc.service.js.map
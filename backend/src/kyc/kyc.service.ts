import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitRenterKycDto, SubmitHostKycDto, ReviewKycDto } from './dto/kyc.dto';
import { KycStatus, KycType, Prisma } from '@prisma/client';
import { AuditLogService } from '../audit-log/audit-log.service';

@Injectable()
export class KycService {
  constructor(
    private prisma: PrismaService,
    private auditLogService: AuditLogService,
  ) {}

  async submitRenterKyc(userId: string, dto: SubmitRenterKycDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (user.kycStatus === KycStatus.verified || user.kycStatus === KycStatus.pending) {
      throw new BadRequestException(`KYC is already ${user.kycStatus}`);
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        // 1. Update or create RenterProfile
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

        // 2. Create KYC submission record
        const submission = await tx.kycSubmission.create({
          data: {
            userId,
            type: KycType.renter,
            status: KycStatus.pending,
            submittedDataJson: dto as unknown as Prisma.InputJsonValue,
          },
        });

        // 3. Update user KYC status
        await tx.user.update({
          where: { id: userId },
          data: { kycStatus: KycStatus.pending },
        });

        await this.auditLogService.logAction({
          actorId: userId,
          action: 'KYC_RENTER_SUBMITTED',
          entityType: 'KycSubmission',
          entityId: submission.id,
        });

        return submission;
      });
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException('This license number is already registered.');
      }
      throw error;
    }
  }

  async submitHostKyc(userId: string, dto: SubmitHostKycDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (user.kycStatus === KycStatus.verified || user.kycStatus === KycStatus.pending) {
      throw new BadRequestException(`KYC is already ${user.kycStatus}`);
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        // 1. Update or create HostProfile
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

        // 2. Create KYC submission record
        const submission = await tx.kycSubmission.create({
          data: {
            userId,
            type: KycType.host,
            status: KycStatus.pending,
            submittedDataJson: dto as unknown as Prisma.InputJsonValue,
          },
        });

        // 3. Update user KYC status
        await tx.user.update({
          where: { id: userId },
          data: { kycStatus: KycStatus.pending },
        });

        await this.auditLogService.logAction({
          actorId: userId,
          action: 'KYC_HOST_SUBMITTED',
          entityType: 'KycSubmission',
          entityId: submission.id,
        });

        return submission;
      });
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException('This CAC number is already registered.');
      }
      throw error;
    }
  }

  async getMyKyc(userId: string) {
    return this.prisma.kycSubmission.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getKycById(id: string) {
    const submission = await this.prisma.kycSubmission.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true, role: true },
        },
      },
    });

    if (!submission) throw new NotFoundException('KYC submission not found');
    return submission;
  }

  async approveKyc(id: string, adminId: string, dto: ReviewKycDto) {
    const submission = await this.getKycById(id);

    if (submission.status !== KycStatus.pending) {
      throw new BadRequestException(`Cannot approve KYC that is ${submission.status}`);
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedSubmission = await tx.kycSubmission.update({
        where: { id },
        data: {
          status: KycStatus.verified,
          reviewedBy: adminId,
          reviewNotes: dto.reviewNotes,
          reviewedAt: new Date(),
        },
      });

      await tx.user.update({
        where: { id: submission.userId },
        data: { kycStatus: KycStatus.verified },
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

  async rejectKyc(id: string, adminId: string, dto: ReviewKycDto) {
    const submission = await this.getKycById(id);

    if (submission.status !== KycStatus.pending) {
      throw new BadRequestException(`Cannot reject KYC that is ${submission.status}`);
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedSubmission = await tx.kycSubmission.update({
        where: { id },
        data: {
          status: KycStatus.rejected,
          reviewedBy: adminId,
          reviewNotes: dto.reviewNotes,
          reviewedAt: new Date(),
        },
      });

      await tx.user.update({
        where: { id: submission.userId },
        data: { kycStatus: KycStatus.rejected },
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
}

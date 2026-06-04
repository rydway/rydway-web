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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding database...');
    await prisma.notification.deleteMany({});
    await prisma.review.deleteMany({});
    await prisma.message.deleteMany({});
    await prisma.conversation.deleteMany({});
    await prisma.maintenanceLog.deleteMany({});
    await prisma.payment.deleteMany({});
    await prisma.payout.deleteMany({});
    await prisma.booking.deleteMany({});
    await prisma.vehicleImage.deleteMany({});
    await prisma.vehicle.deleteMany({});
    await prisma.hostProfile.deleteMany({});
    await prisma.renterProfile.deleteMany({});
    await prisma.user.deleteMany({});
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash('Password123!', salt);
    const admin = await prisma.user.create({
        data: {
            email: 'admin@rydway.com',
            firstName: 'Rydway',
            lastName: 'Admin',
            passwordHash,
            role: client_1.Role.admin,
            kycStatus: client_1.KycStatus.verified,
            isActive: true,
        },
    });
    console.log('Created Admin:', admin.email);
    const hostUser1 = await prisma.user.create({
        data: {
            email: 'host1@rydway.com',
            firstName: 'Alhaji',
            lastName: 'Musa',
            passwordHash,
            role: client_1.Role.host,
            kycStatus: client_1.KycStatus.verified,
            isActive: true,
            hostProfile: {
                create: {
                    businessName: 'Musa Luxury Fleet',
                    cacNumber: 'CAC-123456',
                    taxId: 'TAX-7890',
                    bankName: 'Access Bank',
                    accountName: 'Musa Luxury Fleet Ltd',
                    accountNumber: '0123456789',
                    avgRating: 5.0,
                    totalReviews: 1,
                },
            },
        },
    });
    const hostProfile1 = await prisma.hostProfile.findUnique({ where: { userId: hostUser1.id } });
    console.log('Created Host:', hostUser1.email);
    const renterUser1 = await prisma.user.create({
        data: {
            email: 'renter1@rydway.com',
            firstName: 'Chidi',
            lastName: 'Okonkwo',
            passwordHash,
            role: client_1.Role.renter,
            kycStatus: client_1.KycStatus.verified,
            isActive: true,
            renterProfile: {
                create: {
                    licenseNumber: 'DL-987654321',
                    licenseExpiry: new Date('2030-12-31'),
                    avgRating: 4.8,
                    totalReviews: 1,
                },
            },
        },
    });
    console.log('Created Renter:', renterUser1.email);
    const vehicle1 = await prisma.vehicle.create({
        data: {
            hostId: hostProfile1.id,
            name: 'Mercedes-Benz G-Wagon G63',
            slug: 'mercedes-benz-g-wagon-g63-' + Date.now().toString(36),
            category: 'SUV',
            fuelType: 'Petrol',
            transmission: 'Automatic',
            seats: 5,
            dailyRate: 150000,
            securityDeposit: 50000,
            location: 'Maitama, Abuja',
            latitude: 9.0778,
            longitude: 7.4984,
            description: 'Experience absolute luxury and commanding presence with the G-Wagon G63. Perfect for business meetings or premium tours in Abuja.',
            status: client_1.VehicleStatus.available,
            isFeatured: true,
            isVerified: true,
            requiresDriver: false,
            minimumRentalDays: 2,
            images: {
                create: [
                    { url: 'https://images.unsplash.com/photo-1520050206274-a1ae446cb3cc?auto=format&fit=crop&w=800&q=80', position: 1, isPrimary: true },
                    { url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80', position: 2, isPrimary: false },
                ],
            },
        },
    });
    const vehicle2 = await prisma.vehicle.create({
        data: {
            hostId: hostProfile1.id,
            name: 'Range Rover Autobiography',
            slug: 'range-rover-autobiography-' + Date.now().toString(36),
            category: 'SUV',
            fuelType: 'Diesel',
            transmission: 'Automatic',
            seats: 5,
            dailyRate: 120000,
            securityDeposit: 40000,
            location: 'Wuse 2, Abuja',
            latitude: 9.0667,
            longitude: 7.4833,
            description: 'Refined capability and unparalleled comfort. The Range Rover Autobiography defines executive travel.',
            status: client_1.VehicleStatus.available,
            isFeatured: false,
            isVerified: true,
            requiresDriver: true,
            minimumRentalDays: 1,
            images: {
                create: [
                    { url: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=800&q=80', position: 1, isPrimary: true },
                ],
            },
        },
    });
    console.log('Created Vehicles:', vehicle1.name, ',', vehicle2.name);
    const booking = await prisma.booking.create({
        data: {
            bookingNumber: 'BKG-SEED-001',
            renterId: renterUser1.id,
            hostId: hostProfile1.id,
            vehicleId: vehicle1.id,
            startDate: new Date('2026-06-01T09:00:00Z'),
            endDate: new Date('2026-06-05T18:00:00Z'),
            pickupTime: '09:00:00',
            dropoffTime: '18:00:00',
            pickupLocation: 'Maitama, Abuja',
            dropoffLocation: 'Maitama, Abuja',
            daysCount: 5,
            baseAmount: 750000,
            platformFeeAmount: 75000,
            securityDepositAmount: 50000,
            totalAmount: 875000,
            status: client_1.BookingStatus.completed,
            paymentStatus: 'success',
            approvalStatus: 'approved',
            confirmedAt: new Date('2026-05-18T10:00:00Z'),
            completedAt: new Date('2026-05-19T18:00:00Z'),
        },
    });
    console.log('Created Seed Booking:', booking.bookingNumber);
    await prisma.review.create({
        data: {
            bookingId: booking.id,
            reviewerId: renterUser1.id,
            revieweeId: hostUser1.id,
            rating: 5,
            body: 'Excellent service! The G-Wagon was clean and musa was very professional.',
            type: 'host',
        },
    });
    console.log('Created Seed Review.');
    console.log('Seeding finished successfully!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map
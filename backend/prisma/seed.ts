import { PrismaClient, Role, KycStatus, VehicleStatus, BookingStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing data
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

  // 1. Create Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@rydway.com',
      firstName: 'Rydway',
      lastName: 'Admin',
      passwordHash,
      role: Role.admin,
      kycStatus: KycStatus.verified,
      isActive: true,
    },
  });
  console.log('Created Admin:', admin.email);

  // 2. Create Hosts
  const hostUser1 = await prisma.user.create({
    data: {
      email: 'host1@rydway.com',
      firstName: 'Alhaji',
      lastName: 'Musa',
      passwordHash,
      role: Role.host,
      kycStatus: KycStatus.verified,
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

  // 3. Create Renters
  const renterUser1 = await prisma.user.create({
    data: {
      email: 'renter1@rydway.com',
      firstName: 'Chidi',
      lastName: 'Okonkwo',
      passwordHash,
      role: Role.renter,
      kycStatus: KycStatus.verified,
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

  // 4. Create Vehicles
  const vehicle1 = await prisma.vehicle.create({
    data: {
      hostId: hostProfile1!.id,
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
      status: VehicleStatus.available,
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
      hostId: hostProfile1!.id,
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
      status: VehicleStatus.available,
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

  // 5. Create Booking
  const booking = await prisma.booking.create({
    data: {
      bookingNumber: 'BKG-SEED-001',
      renterId: renterUser1.id,
      hostId: hostProfile1!.id,
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
      status: BookingStatus.completed,
      paymentStatus: 'success',
      approvalStatus: 'approved',
      confirmedAt: new Date('2026-05-18T10:00:00Z'),
      completedAt: new Date('2026-05-19T18:00:00Z'),
    },
  });
  console.log('Created Seed Booking:', booking.bookingNumber);

  // 6. Create Review
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

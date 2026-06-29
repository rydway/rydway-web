-- =============================================================================
-- SEED: Abuja Car Rental Businesses - Accounts & Profiles Only
-- Platform: Rydway
-- =============================================================================
-- PASSWORD: All accounts use 'rydway123'
-- Before running, replace REPLACE_WITH_BCRYPT_HASH_OF_rydway123 with the 
-- actual bcrypt hash. Generate it in your project:
--
--   node -e "const b=require('bcryptjs'); b.hash('rydway123',10).then(console.log)"
--   or
--   node -e "const b=require('bcrypt'); b.hash('rydway123',10).then(console.log)"
--
-- EMAIL FORMAT: {hostname}@rydway.com (placeholder until business claims account)
--
-- Run these migrations FIRST if columns don't exist:
ALTER TABLE public."HostProfile" ADD COLUMN IF NOT EXISTS "isClaimed" boolean NOT NULL DEFAULT false;
ALTER TABLE public."HostProfile" ADD COLUMN IF NOT EXISTS "claimedAt" timestamp without time zone NULL;
ALTER TABLE public."HostProfile" ADD COLUMN IF NOT EXISTS "instagramUrl" text NULL;
ALTER TABLE public."HostProfile" ADD COLUMN IF NOT EXISTS "instagramHandle" text NULL;
ALTER TABLE public."HostProfile" ADD COLUMN IF NOT EXISTS "instagramFollowers" text NULL;
ALTER TABLE public."HostProfile" ADD COLUMN IF NOT EXISTS "websiteUrl" text NULL;
-- =============================================================================

BEGIN;

-- =============================================================================
-- SECTION 1: USERS
-- =============================================================================

INSERT INTO public."User" (
  id, email, phone, "passwordHash",
  "firstName", "lastName", role,
  "isActive", "isSuspended",
  "kycStatus", "emailVerifiedAt",
  "createdAt", "updatedAt"
) VALUES

-- 1. Abuja Car Hire
('user_seed_001',
 'abujacarhire@rydway.com',
 '+2349068530525',
 'REPLACE_WITH_BCRYPT_HASH_OF_rydway123',
 'Abuja', 'Car Hire', 'host',
 true, false, 'unsubmitted', NULL,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 2. Simpres Car Hire/Rentals
('user_seed_002',
 'simpres@rydway.com',
 NULL,
 'REPLACE_WITH_BCRYPT_HASH_OF_rydway123',
 'Simpres', 'Car Hire/Rentals', 'host',
 true, false, 'unsubmitted', NULL,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 3. Abuja Car Rental Express
('user_seed_003',
 'abujacarrentalexpress@rydway.com',
 '+2348121905725',
 'REPLACE_WITH_BCRYPT_HASH_OF_rydway123',
 'Abuja', 'Car Rental Express', 'host',
 true, false, 'unsubmitted', NULL,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 4. AbujaCar Rentals
('user_seed_004',
 'abujacarrentals@rydway.com',
 NULL,
 'REPLACE_WITH_BCRYPT_HASH_OF_rydway123',
 'AbujaCar', 'Rentals', 'host',
 true, false, 'unsubmitted', NULL,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 5. Autopilot Car Hire
('user_seed_005',
 'autopilot@rydway.com',
 NULL,
 'REPLACE_WITH_BCRYPT_HASH_OF_rydway123',
 'Autopilot', 'Car Hire', 'host',
 true, false, 'unsubmitted', NULL,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 6. Executive Car Hire Abuja
('user_seed_006',
 'executivecarhire@rydway.com',
 '+2348038383251',
 'REPLACE_WITH_BCRYPT_HASH_OF_rydway123',
 'Executive', 'Car Hire Abuja', 'host',
 true, false, 'unsubmitted', NULL,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 7. SwiftDrive Car Rental
('user_seed_007',
 'swiftdrive@rydway.com',
 NULL,
 'REPLACE_WITH_BCRYPT_HASH_OF_rydway123',
 'SwiftDrive', 'Car Rental', 'host',
 true, false, 'unsubmitted', NULL,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 8. VIP Fleets
('user_seed_008',
 'vipfleets@rydway.com',
 NULL,
 'REPLACE_WITH_BCRYPT_HASH_OF_rydway123',
 'VIP', 'Fleets', 'host',
 true, false, 'unsubmitted', NULL,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 9. Venegowconnect
('user_seed_009',
 'venegowconnect@rydway.com',
 '+2348136555553',
 'REPLACE_WITH_BCRYPT_HASH_OF_rydway123',
 'Venegowconnect', '.', 'host',
 true, false, 'unsubmitted', NULL,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 10. Heyforsagee Car Rental
('user_seed_010',
 'heyforsagee@rydway.com',
 NULL,
 'REPLACE_WITH_BCRYPT_HASH_OF_rydway123',
 'Heyforsagee', 'Car Rental', 'host',
 true, false, 'unsubmitted', NULL,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 11. Grand Titan Luxury
('user_seed_011',
 'grandtitan@rydway.com',
 NULL,
 'REPLACE_WITH_BCRYPT_HASH_OF_rydway123',
 'Grand', 'Titan Luxury', 'host',
 true, false, 'unsubmitted', NULL,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 12. Lynx Rental
('user_seed_012',
 'lynxrental@rydway.com',
 NULL,
 'REPLACE_WITH_BCRYPT_HASH_OF_rydway123',
 'Lynx', 'Rental', 'host',
 true, false, 'unsubmitted', NULL,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 13. The Luxury Chauffeur (TLC)
('user_seed_013',
 'luxurychauffeur@rydway.com',
 NULL,
 'REPLACE_WITH_BCRYPT_HASH_OF_rydway123',
 'The', 'Luxury Chauffeur (TLC)', 'host',
 true, false, 'unsubmitted', NULL,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 14. Zollorides
('user_seed_014',
 'zollorides@rydway.com',
 '+2348036313963',
 'REPLACE_WITH_BCRYPT_HASH_OF_rydway123',
 'Zollorides', '.', 'host',
 true, false, 'unsubmitted', NULL,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 15. Autobro Car Hire
('user_seed_015',
 'autobro@rydway.com',
 NULL,
 'REPLACE_WITH_BCRYPT_HASH_OF_rydway123',
 'Autobro', 'Car Hire', 'host',
 true, false, 'unsubmitted', NULL,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 16. Rhezon Car Rentals
('user_seed_016',
 'rhezon@rydway.com',
 NULL,
 'REPLACE_WITH_BCRYPT_HASH_OF_rydway123',
 'Rhezon', 'Car Rentals', 'host',
 true, false, 'unsubmitted', NULL,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 17. Aisle Car Rentals
('user_seed_017',
 'aisle@rydway.com',
 NULL,
 'REPLACE_WITH_BCRYPT_HASH_OF_rydway123',
 'Aisle', 'Car Rentals', 'host',
 true, false, 'unsubmitted', NULL,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 18. Naija Car Hire
('user_seed_018',
 'naijacarhire@rydway.com',
 NULL,
 'REPLACE_WITH_BCRYPT_HASH_OF_rydway123',
 'Naija', 'Car Hire', 'host',
 true, false, 'unsubmitted', NULL,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 19. Sylarm Booking
('user_seed_019',
 'sylarm@rydway.com',
 NULL,
 'REPLACE_WITH_BCRYPT_HASH_OF_rydway123',
 'Sylarm', 'Booking', 'host',
 true, false, 'unsubmitted', NULL,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 20. Machel Car Rental
('user_seed_020',
 'machel@rydway.com',
 NULL,
 'REPLACE_WITH_BCRYPT_HASH_OF_rydway123',
 'Machel', 'Car Rental', 'host',
 true, false, 'unsubmitted', NULL,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 21. Xclusive Rent A Car
('user_seed_021',
 'xclusive@rydway.com',
 NULL,
 'REPLACE_WITH_BCRYPT_HASH_OF_rydway123',
 'Xclusive', 'Rent A Car', 'host',
 true, false, 'unsubmitted', NULL,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 22. SIXT Rent A Car Abuja
('user_seed_022',
 'sixt@rydway.com',
 NULL,
 'REPLACE_WITH_BCRYPT_HASH_OF_rydway123',
 'SIXT', 'Rent A Car Abuja', 'host',
 true, false, 'unsubmitted', NULL,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 23. G2G Rentals
('user_seed_023',
 'g2grentals@rydway.com',
 NULL,
 'REPLACE_WITH_BCRYPT_HASH_OF_rydway123',
 'G2G', 'Rentals', 'host',
 true, false, 'unsubmitted', NULL,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 24. Royal Rent A Car
('user_seed_024',
 'royalrentacar@rydway.com',
 NULL,
 'REPLACE_WITH_BCRYPT_HASH_OF_rydway123',
 'Royal', 'Rent A Car', 'host',
 true, false, 'unsubmitted', NULL,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 25. Swift Rental Cars
('user_seed_025',
 'swiftrentalcars@rydway.com',
 '+2348172236921',
 'REPLACE_WITH_BCRYPT_HASH_OF_rydway123',
 'Swift', 'Rental Cars', 'host',
 true, false, 'unsubmitted', NULL,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 26. Royal Fleets
('user_seed_026',
 'royalfleets@rydway.com',
 '+2348023304981',
 'REPLACE_WITH_BCRYPT_HASH_OF_rydway123',
 'Royal', 'Fleets', 'host',
 true, false, 'unsubmitted', NULL,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 27. Nairaxi
('user_seed_027',
 'nairaxi@rydway.com',
 NULL,
 'REPLACE_WITH_BCRYPT_HASH_OF_rydway123',
 'Nairaxi', '.', 'host',
 true, false, 'unsubmitted', NULL,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 28. AbujaCar Platform
('user_seed_028',
 'abujacar@rydway.com',
 NULL,
 'REPLACE_WITH_BCRYPT_HASH_OF_rydway123',
 'AbujaCar', 'Platform', 'host',
 true, false, 'unsubmitted', NULL,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 29. Starr Luxury Cars Abuja
('user_seed_029',
 'starrluxury@rydway.com',
 NULL,
 'REPLACE_WITH_BCRYPT_HASH_OF_rydway123',
 'Starr', 'Luxury Cars Abuja', 'host',
 true, false, 'unsubmitted', NULL,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 30. Machel Concierge & Jet
('user_seed_030',
 'macheljet@rydway.com',
 NULL,
 'REPLACE_WITH_BCRYPT_HASH_OF_rydway123',
 'Machel', 'Concierge & Jet', 'host',
 true, false, 'unsubmitted', NULL,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)

ON CONFLICT (email) DO NOTHING;


-- =============================================================================
-- SECTION 2: HOST PROFILES
-- =============================================================================

INSERT INTO public."HostProfile" (
  id, "userId",
  "businessName", "tradingName",
  "businessAddress", "businessCity", "businessState",
  "businessPhone", "businessEmail",
  "businessType", "rcNumber",
  "instagramHandle", "instagramUrl", "instagramFollowers",
  "websiteUrl",
  "isClaimed",
  "subscriptionTier",
  "createdAt", "updatedAt"
) VALUES

-- 1. Abuja Car Hire
('host_seed_001', 'user_seed_001',
 'Abuja Car Hire', 'Abuja Car Hire',
 'Legislative Institute, Lugbe 900108, FCT', 'Abuja', 'FCT',
 '+2349068530525', 'abujacarhire@rydway.com',
 'Car Rental', NULL,
 '@abuja_car_hire', 'https://www.instagram.com/abuja_car_hire/', '116K',
 'https://abujacarhire.ng',
 false, 'free',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 2. Simpres Car Hire/Rentals
('host_seed_002', 'user_seed_002',
 'Simpres Car Hire/Rentals', 'Simpres Car Hire/Rentals',
 'Abuja, FCT', 'Abuja', 'FCT',
 NULL, 'simpres@rydway.com',
 'Car Rental', NULL,
 '@simpres_logistics', 'https://www.instagram.com/simpres_logistics/', '59K',
 NULL,
 false, 'free',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 3. Abuja Car Rental Express
('host_seed_003', 'user_seed_003',
 'Abuja Car Rental Express', 'Abuja Car Rental Express',
 'Abuja, FCT', 'Abuja', 'FCT',
 '+2348121905725', 'abujacarrentalexpress@rydway.com',
 'Car Rental', NULL,
 '@abuja_car_rental_express', 'https://www.instagram.com/abuja_car_rental_express/', '10K',
 NULL,
 false, 'free',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 4. AbujaCar Rentals
('host_seed_004', 'user_seed_004',
 'AbujaCar Rentals', 'AbujaCar Rentals',
 'Abuja, FCT', 'Abuja', 'FCT',
 NULL, 'abujacarrentals@rydway.com',
 'Car Rental', NULL,
 '@abujacar_rentals', 'https://www.instagram.com/abujacar_rentals/', '5.8K',
 NULL,
 false, 'free',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 5. Autopilot Car Hire
('host_seed_005', 'user_seed_005',
 'Autopilot Car Hire', 'Autopilot Car Hire',
 'Abuja, FCT', 'Abuja', 'FCT',
 NULL, 'autopilot@rydway.com',
 'Car Rental', NULL,
 '@autopilot.ng', 'https://www.instagram.com/autopilot.ng/', '14K',
 NULL,
 false, 'free',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 6. Executive Car Hire Abuja
('host_seed_006', 'user_seed_006',
 'Executive Car Hire Abuja', 'Executive Car Hire Abuja',
 'Abuja, FCT', 'Abuja', 'FCT',
 '+2348038383251', 'executivecarhire@rydway.com',
 'Car Rental', NULL,
 '@executivecarhire_ng', 'https://www.instagram.com/executivecarhire_ng/', '1.9K',
 NULL,
 false, 'free',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 7. SwiftDrive Car Rental
('host_seed_007', 'user_seed_007',
 'SwiftDrive Car Rental', 'SwiftDrive Car Rental',
 'Abuja, FCT', 'Abuja', 'FCT',
 NULL, 'swiftdrive@rydway.com',
 'Car Rental', '7266488',
 '@swiftdriveservice', 'https://www.instagram.com/swiftdriveservice/', '2K',
 NULL,
 false, 'free',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 8. VIP Fleets
('host_seed_008', 'user_seed_008',
 'VIP Fleets', 'VIP Fleets',
 'Abuja, FCT', 'Abuja', 'FCT',
 NULL, 'vipfleets@rydway.com',
 'Car Rental', NULL,
 '@vipfleets', 'https://www.instagram.com/vipfleets/', '6.3K',
 NULL,
 false, 'free',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 9. Venegowconnect
('host_seed_009', 'user_seed_009',
 'Venegowconnect', 'Venegowconnect',
 'Abuja, FCT', 'Abuja', 'FCT',
 '+2348136555553', 'venegowconnect@rydway.com',
 'Car Rental', '8139549',
 '@venegowconnect', 'https://www.instagram.com/venegowconnect/', '9.7K',
 NULL,
 false, 'free',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 10. Heyforsagee Car Rental
('host_seed_010', 'user_seed_010',
 'Heyforsagee Car Rental', 'Heyforsagee Car Rental',
 'Lagos & Abuja, FCT', 'Abuja', 'FCT',
 NULL, 'heyforsagee@rydway.com',
 'Car Rental', NULL,
 '@heyforsagee', 'https://www.instagram.com/heyforsagee/', '12K',
 NULL,
 false, 'free',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 11. Grand Titan Luxury
('host_seed_011', 'user_seed_011',
 'Grand Titan Luxury', 'Grand Titan Luxury',
 'Abuja, FCT', 'Abuja', 'FCT',
 NULL, 'grandtitan@rydway.com',
 'Car Rental', '1887073',
 '@grandtitan_luxury', 'https://www.instagram.com/grandtitan_luxury/', '21K',
 NULL,
 false, 'free',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 12. Lynx Rental
('host_seed_012', 'user_seed_012',
 'Lynx Rental', 'Lynx Rental',
 'Abuja, FCT', 'Abuja', 'FCT',
 NULL, 'lynxrental@rydway.com',
 'Car Rental', NULL,
 '@lynxrental', 'https://www.instagram.com/lynxrental/', '2.2K',
 NULL,
 false, 'free',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 13. The Luxury Chauffeur (TLC)
('host_seed_013', 'user_seed_013',
 'The Luxury Chauffeur (TLC)', 'The Luxury Chauffeur (TLC)',
 'Nationwide, Abuja', 'Abuja', 'FCT',
 NULL, 'luxurychauffeur@rydway.com',
 'Car Rental', '1947558',
 '@the.luxurychauffeur', 'https://www.instagram.com/the.luxurychauffeur/', '10K',
 NULL,
 false, 'free',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 14. Zollorides
('host_seed_014', 'user_seed_014',
 'Zollorides', 'Zollorides',
 'Abuja, Lagos, Kaduna, Kano', 'Abuja', 'FCT',
 '+2348036313963', 'zollorides@rydway.com',
 'Car Rental', '3669671',
 '@zollorides', 'https://www.instagram.com/zollorides/', '4.4K',
 NULL,
 false, 'free',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 15. Autobro Car Hire
('host_seed_015', 'user_seed_015',
 'Autobro Car Hire', 'Autobro Car Hire',
 'Abuja, FCT', 'Abuja', 'FCT',
 NULL, 'autobro@rydway.com',
 'Car Rental', NULL,
 '@autobro_och', '', NULL,
 NULL,
 false, 'free',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 16. Rhezon Car Rentals
('host_seed_016', 'user_seed_016',
 'Rhezon Car Rentals', 'Rhezon Car Rentals',
 'Floor M1 Transcorp Hilton Hotel, No. 1 Aguiyi Ironsi Street, Maitama, Abuja', 'Abuja', 'FCT',
 NULL, 'rhezon@rydway.com',
 'Car Rental', NULL,
 NULL, NULL, NULL,
 'https://rhezon.org',
 false, 'free',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 17. Aisle Car Rentals
('host_seed_017', 'user_seed_017',
 'Aisle Car Rentals', 'Aisle Car Rentals',
 'Abuja, FCT (Maitama, Wuse, Asokoro, CBD)', 'Abuja', 'FCT',
 NULL, 'aisle@rydway.com',
 'Car Rental', NULL,
 NULL, NULL, NULL,
 'https://aisle.com.ng',
 false, 'free',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 18. Naija Car Hire
('host_seed_018', 'user_seed_018',
 'Naija Car Hire', 'Naija Car Hire',
 'Wuse II & Nnamdi Azikiwe Airport, Abuja', 'Abuja', 'FCT',
 NULL, 'naijacarhire@rydway.com',
 'Car Rental', NULL,
 NULL, NULL, NULL,
 'https://naijacarhire.com',
 false, 'free',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 19. Sylarm Booking
('host_seed_019', 'user_seed_019',
 'Sylarm Booking', 'Sylarm Booking',
 'Abuja, FCT', 'Abuja', 'FCT',
 NULL, 'sylarm@rydway.com',
 'Car Rental', NULL,
 NULL, NULL, NULL,
 'https://sylarmbooking.com.ng',
 false, 'free',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 20. Machel Car Rental
('host_seed_020', 'user_seed_020',
 'Machel Car Rental', 'Machel Car Rental',
 'Abuja, FCT', 'Abuja', 'FCT',
 NULL, 'machel@rydway.com',
 'Car Rental', NULL,
 NULL, NULL, NULL,
 'https://machel.ng',
 false, 'free',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 21. Xclusive Rent A Car
('host_seed_021', 'user_seed_021',
 'Xclusive Rent A Car', 'Xclusive Rent A Car',
 'Abuja, FCT', 'Abuja', 'FCT',
 NULL, 'xclusive@rydway.com',
 'Car Rental', NULL,
 NULL, NULL, NULL,
 'https://xclusiverentcars.com',
 false, 'free',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 22. SIXT Rent A Car Abuja
('host_seed_022', 'user_seed_022',
 'SIXT Rent A Car Abuja', 'SIXT Rent A Car Abuja',
 'Abuja International Airport (ABV) & Downtown Abuja', 'Abuja', 'FCT',
 NULL, 'sixt@rydway.com',
 'Car Rental', NULL,
 NULL, NULL, NULL,
 'https://www.sixt.com/car-rental/nigeria/abuja/',
 false, 'free',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 23. G2G Rentals
('host_seed_023', 'user_seed_023',
 'G2G Rentals', 'G2G Rentals',
 'Abuja, FCT', 'Abuja', 'FCT',
 NULL, 'g2grentals@rydway.com',
 'Car Rental', NULL,
 NULL, NULL, NULL,
 NULL,
 false, 'free',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 24. Royal Rent A Car
('host_seed_024', 'user_seed_024',
 'Royal Rent A Car', 'Royal Rent A Car',
 'Maitama, Abuja', 'Abuja', 'FCT',
 NULL, 'royalrentacar@rydway.com',
 'Car Rental', NULL,
 NULL, NULL, NULL,
 NULL,
 false, 'free',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 25. Swift Rental Cars
('host_seed_025', 'user_seed_025',
 'Swift Rental Cars', 'Swift Rental Cars',
 'Arcade Club Suites, Plot 68, First Avenue Central Bus Districts, Abuja', 'Abuja', 'FCT',
 '+2348172236921', 'swiftrentalcars@rydway.com',
 'Car Rental', NULL,
 NULL, NULL, NULL,
 NULL,
 false, 'free',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 26. Royal Fleets
('host_seed_026', 'user_seed_026',
 'Royal Fleets', 'Royal Fleets',
 'HF 66 Kaura Modern Market, Duboyi, Abuja, FCT', 'Abuja', 'FCT',
 '+2348023304981', 'royalfleets@rydway.com',
 'Car Rental', NULL,
 NULL, NULL, NULL,
 NULL,
 false, 'free',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 27. Nairaxi
('host_seed_027', 'user_seed_027',
 'Nairaxi', 'Nairaxi',
 'Abuja, FCT (Maitama, Wuse, Asokoro, Garki)', 'Abuja', 'FCT',
 NULL, 'nairaxi@rydway.com',
 'Car Rental', NULL,
 NULL, NULL, NULL,
 'https://nairaxi.ng',
 false, 'free',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 28. AbujaCar Platform
('host_seed_028', 'user_seed_028',
 'AbujaCar Platform', 'AbujaCar Platform',
 'Abuja, FCT', 'Abuja', 'FCT',
 NULL, 'abujacar@rydway.com',
 'Car Rental', NULL,
 NULL, NULL, NULL,
 'https://abujacar.com',
 false, 'free',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 29. Starr Luxury Cars Abuja
('host_seed_029', 'user_seed_029',
 'Starr Luxury Cars Abuja', 'Starr Luxury Cars Abuja',
 'Abuja, FCT', 'Abuja', 'FCT',
 NULL, 'starrluxury@rydway.com',
 'Car Rental', NULL,
 NULL, NULL, NULL,
 'https://starrluxurycars.com',
 false, 'free',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 30. Machel Concierge & Jet
('host_seed_030', 'user_seed_030',
 'Machel Concierge & Jet', 'Machel Concierge & Jet',
 'Abuja, FCT', 'Abuja', 'FCT',
 NULL, 'macheljet@rydway.com',
 'Car Rental', NULL,
 NULL, NULL, NULL,
 'https://machel.ng',
 false, 'free',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)

ON CONFLICT ("userId") DO NOTHING;

COMMIT;

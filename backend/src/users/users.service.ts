import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        kycStatus: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async createUser(data: Prisma.UserCreateInput) {
    try {
      const user = await this.prisma.user.create({
        data,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          kycStatus: true,
          createdAt: true,
        },
      });
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Email or phone already exists');
        }
      }
      throw error;
    }
  }

  async updateUser(id: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        kycStatus: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updatePassword(id: string, passwordHash: string) {
    return this.prisma.user.update({
      where: { id },
      data: { passwordHash },
    });
  }

  async softDelete(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });
  }

  async getVendors(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [vendors, total] = await Promise.all([
      this.prisma.user.findMany({
        where: {
          role: Role.host,
          isActive: true,
        },
        orderBy: {
          hostProfile: {
            avgRating: 'desc',
          },
        },
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          phone: true,
          firstName: true,
          lastName: true,
          role: true,
          profileImageUrl: true,
          kycStatus: true,
          hostProfile: {
            select: {
              id: true,
              businessName: true,
              tradingName: true,
              businessAddress: true,
              businessPhone: true,
              businessEmail: true,
              avgRating: true,
              totalReviews: true,
            },
          },
        },
      }),
      this.prisma.user.count({
        where: {
          role: Role.host,
          isActive: true,
        },
      }),
    ]);

    return {
      data: vendors,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

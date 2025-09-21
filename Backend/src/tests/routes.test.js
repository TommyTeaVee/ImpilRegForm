const request = require('supertest');
const express = require('express');
const multer = require('multer');
const { PrismaClient } = require('@prisma/client');

// Mock Prisma client
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    registration: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

// Mock upload utility
jest.mock('../utils/upload', () => ({
  upload: {
    fields: jest.fn(() => (req, res, next) => next()),
  },
}));

// Import the router after setting up mocks
const registrationRouter = require('../routes/registration'); // Adjust path as needed

// Create test app
const app = express();
app.use(express.json());
app.use('/registrations', registrationRouter);

describe('Registration API', () => {
  let prisma;

  beforeEach(() => {
    prisma = new PrismaClient();
    jest.clearAllMocks();
  });

  describe('POST /registrations', () => {
    it('should create a new registration with valid data', async () => {
      const mockRegistration = {
        id: '1',
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        dob: new Date('1990-01-01'),
        gender: 'Male',
        modelType: 'Featured',
        status: 'pending',
        createdAt: new Date(),
      };

      prisma.registration.create.mockResolvedValue(mockRegistration);

      const response = await request(app)
        .post('/registrations')
        .field('fullName', 'John Doe')
        .field('email', 'john@example.com')
        .field('phone', '1234567890')
        .field('dob', '1990-01-01')
        .field('gender', 'Male')
        .field('modelType', 'Featured')
        .attach('profileImage', Buffer.from('test'), 'test.jpg');

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Registration saved');
      expect(prisma.registration.create).toHaveBeenCalled();
    });

    it('should return 400 when required fields are missing', async () => {
      const response = await request(app)
        .post('/registrations')
        .field('fullName', 'John Doe')
        // Missing email, phone, dob, gender, modelType
        .attach('profileImage', Buffer.from('test'), 'test.jpg');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Missing required field');
    });

    it('should return 400 for invalid modelType', async () => {
      const response = await request(app)
        .post('/registrations')
        .field('fullName', 'John Doe')
        .field('email', 'john@example.com')
        .field('phone', '1234567890')
        .field('dob', '1990-01-01')
        .field('gender', 'Male')
        .field('modelType', 'InvalidType')
        .attach('profileImage', Buffer.from('test'), 'test.jpg');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("modelType must be 'Featured' or 'InHouse'");
    });

    it('should return 400 for InHouse model without required fields', async () => {
      const response = await request(app)
        .post('/registrations')
        .field('fullName', 'John Doe')
        .field('email', 'john@example.com')
        .field('phone', '1234567890')
        .field('dob', '1990-01-01')
        .field('gender', 'Male')
        .field('modelType', 'InHouse')
        // Missing bio and allergiesOrSkin
        .attach('profileImage', Buffer.from('test'), 'test.jpg');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('InHouse requires');
    });

    it('should handle server errors', async () => {
      prisma.registration.create.mockRejectedValue(new Error('DB error'));

      const response = await request(app)
        .post('/registrations')
        .field('fullName', 'John Doe')
        .field('email', 'john@example.com')
        .field('phone', '1234567890')
        .field('dob', '1990-01-01')
        .field('gender', 'Male')
        .field('modelType', 'Featured')
        .attach('profileImage', Buffer.from('test'), 'test.jpg');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Server error');
    });
  });

  describe('GET /registrations', () => {
    it('should return all registrations', async () => {
      const mockRegistrations = [
        { id: '1', fullName: 'John Doe', status: 'pending' },
        { id: '2', fullName: 'Jane Smith', status: 'approved' },
      ];

      prisma.registration.findMany.mockResolvedValue(mockRegistrations);

      const response = await request(app).get('/registrations');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockRegistrations);
      expect(prisma.registration.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should handle server errors', async () => {
      prisma.registration.findMany.mockRejectedValue(new Error('DB error'));

      const response = await request(app).get('/registrations');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Server error');
    });
  });

  describe('GET /registrations/:id', () => {
    it('should return a specific registration', async () => {
      const mockRegistration = {
        id: '1',
        fullName: 'John Doe',
        email: 'john@example.com',
        status: 'pending',
      };

      prisma.registration.findUnique.mockResolvedValue(mockRegistration);

      const response = await request(app).get('/registrations/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockRegistration);
      expect(prisma.registration.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should return 404 for non-existent registration', async () => {
      prisma.registration.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/registrations/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Not found');
    });

    it('should handle server errors', async () => {
      prisma.registration.findUnique.mockRejectedValue(new Error('DB error'));

      const response = await request(app).get('/registrations/1');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Server error');
    });
  });

  describe('PATCH /registrations/:id/status', () => {
    it('should update registration status', async () => {
      const mockUpdatedRegistration = {
        id: '1',
        fullName: 'John Doe',
        status: 'approved',
      };

      prisma.registration.update.mockResolvedValue(mockUpdatedRegistration);

      const response = await request(app)
        .patch('/registrations/1/status')
        .send({ status: 'approved' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUpdatedRegistration);
      expect(prisma.registration.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: 'approved' },
      });
    });

    it('should handle server errors', async () => {
      prisma.registration.update.mockRejectedValue(new Error('DB error'));

      const response = await request(app)
        .patch('/registrations/1/status')
        .send({ status: 'approved' });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Server error');
    });
  });

  describe('DELETE /registrations/:id', () => {
    it('should delete a registration', async () => {
      prisma.registration.delete.mockResolvedValue({});

      const response = await request(app).delete('/registrations/1');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Deleted');
      expect(prisma.registration.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should handle server errors', async () => {
      prisma.registration.delete.mockRejectedValue(new Error('DB error'));

      const response = await request(app).delete('/registrations/1');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Server error');
    });
  });
});
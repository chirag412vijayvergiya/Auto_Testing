const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/User');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
});

test('POST /api/users should create a user', async () => {
    const response = await request(app)
        .post('/api/users')
        .send({ name: 'Alice', email: 'alice@example.com' });
    expect(response.status).toBe(301);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.name).toBe('Alice');
});

test('GET /api/users should return users', async () => {
    await User.create({ name: 'Bob', email: 'bob@example.com' }); // Pre-insert a user

    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
});

// ✅ FIXED: Ensure User Exists Before Testing GET by ID
test('GET /api/users/:id should return a user', async () => {
    const user = await User.create({ name: 'David', email: 'david@example.com' });

    const response = await request(app).get(`/api/users/${user._id}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('David');
});

test('GET /api/users/:id should return 400 for invalid ID', async () => {
    const response = await request(app).get('/api/users/invalidID');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid user ID format');
});

// ✅ FIXED: Properly Handle Non-Existent User

test('GET /api/users/:id should return 404 if user does not exist', async () => {
    const fakeId = new mongoose.Types.ObjectId(); // Generate a valid but non-existent ID

    const response = await request(app).get(`/api/users/${fakeId}`);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('User not found');
});

test('POST /api/users should fail if email is missing', async () => {
    const response = await request(app).post('/api/users').send({ name: 'Alice' });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Name and email are required');
});

test('POST /api/users should fail for duplicate email', async () => {
    await request(app).post('/api/users').send({ name: 'Alice', email: 'alice@example.com' });
    const response = await request(app).post('/api/users').send({ name: 'Bob', email: 'alice@example.com' });
    expect(response.status).toBe(409);
    expect(response.body.error).toBe('Email already exists');
});

test('GET /api/users/:id should return 400 for invalid ID format', async () => {
    const response = await request(app).get('/api/users/invalidID');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid user ID format');
});

test('GET /api/users/:id should return 404 if user does not exist', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app).get(`/api/users/${fakeId}`);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('User not found');
});

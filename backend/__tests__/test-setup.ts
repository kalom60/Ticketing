import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongo: MongoMemoryServer;

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri);
  }
});

// afterEach(async () => {
//   const db = mongoose.connection.db;
//   if (!db) {
//     throw new Error("Database connection is not established");
//   }

//   const collections = await db.collections();
//   for (const collection of collections) {
//     await collection.deleteMany({});
//   }
// });

afterAll(async () => {
  if (mongo) {
    await mongoose.connection.close();
    await mongo.stop();
  }
});

import clientPromise from './database';

// Mongoose-style dbConnect function for compatibility
const dbConnect = async () => {
  return await clientPromise;
};

export default dbConnect;

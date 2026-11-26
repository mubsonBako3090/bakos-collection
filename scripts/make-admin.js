// Usage: npm run make-admin -- someone@example.com
// Register the account on the site first, then run this to promote it.
import { MongoClient } from 'mongodb';

const email = (process.argv[2] || '').trim().toLowerCase();
if (!email) {
  console.error('Usage: npm run make-admin -- someone@example.com');
  process.exit(1);
}
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not set. Put it in .env.local (see .env.example).');
  process.exit(1);
}

const client = new MongoClient(process.env.MONGODB_URI);
try {
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || 'bakos-collection');
  const res = await db.collection('users').updateOne({ email }, { $set: { role: 'admin' } });
  if (res.matchedCount === 0) {
    console.error(`No user found with email ${email}. Register that account first.`);
    process.exit(1);
  }
  console.log(`${email} is now an admin.`);
} finally {
  await client.close();
}

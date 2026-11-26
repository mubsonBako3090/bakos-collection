import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

/** An error whose message is safe to show to the client. */
export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function json(data, status = 200) {
  return NextResponse.json(data, { status });
}

/** Turn any thrown value into a response. Unknown errors are logged, never leaked. */
export function handleError(err) {
  if (err instanceof ApiError) {
    return json({ error: err.message }, err.status);
  }
  console.error(err);
  return json({ error: 'Something went wrong. Please try again.' }, 500);
}

export async function readJson(req) {
  try {
    const body = await req.json();
    if (body === null || typeof body !== 'object') throw new Error('not an object');
    return body;
  } catch {
    throw new ApiError(400, 'Invalid request body.');
  }
}

const OBJECT_ID = /^[a-f\d]{24}$/i;

export function isObjectId(value) {
  return typeof value === 'string' && OBJECT_ID.test(value);
}

export function toObjectId(value, label = 'id') {
  if (!isObjectId(value)) throw new ApiError(400, `Invalid ${label}.`);
  return new ObjectId(value);
}

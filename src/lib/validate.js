import { ApiError } from './http';

export function cleanText(value, max = 200) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

const PHONE = /^\+?[0-9][0-9\s-]{6,18}$/;

export function isValidPhone(phone) {
  return PHONE.test(phone);
}

/** Shipping details required to place an order. */
export function validateShipping(input) {
  const shipping = {
    address: cleanText(input?.address),
    city: cleanText(input?.city, 100),
    state: cleanText(input?.state, 100),
    zip: cleanText(input?.zip, 20),
    phone: cleanText(input?.phone, 20),
  };

  if (!shipping.address || !shipping.city || !shipping.state) {
    throw new ApiError(400, 'Address, city and state are required.');
  }
  if (!isValidPhone(shipping.phone)) {
    throw new ApiError(400, 'Please enter a valid phone number.');
  }
  return shipping;
}

import crypto from 'crypto';

export const verifyCheckrSignature = (secret: crypto.BinaryLike, compactJSON: crypto.BinaryLike, signature: any) => {
  const hmac = crypto.createHmac('sha256', secret);
  const computedHash = hmac.update(compactJSON).digest('hex')

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(computedHash))
}
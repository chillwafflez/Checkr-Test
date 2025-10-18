import crypto from 'crypto';

export const verifyCheckrSignature = (secret: string, compactJsonPayload: Buffer, signature?: string) => {
  if (!signature) return false;

  const hmac = crypto.createHmac("sha256", secret)
  const computedHash = hmac.update(compactJsonPayload).digest("hex");

  return crypto.timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(computedHash, "hex"))
}
// hmacAuth.js
import CryptoJS from "crypto-js";

const generateHmacSignature = (apiKey, secretKey, requestUri) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const dataToSign = `${apiKey}/${requestUri}${timestamp}`;
  console.log(dataToSign, "kk");

  const hmac = CryptoJS.HmacSHA256(dataToSign, secretKey);
  const signature = CryptoJS.enc.Base64.stringify(hmac);

  return {
    apiKey,
    signature,
    timestamp,
  };
};

export const getHmacHeaders = (apiKey, secretKey, requestUri) => {
  const { signature, timestamp } = generateHmacSignature(
    apiKey,
    secretKey,
    requestUri
  );

  return {
    "X-Api-Key": apiKey,
    "X-Signature": signature,
    "X-Timestamp": timestamp,
  };
};

export const aesEncrypt = async (
  data: string,
  password: string,
  difficulty = 10
) => {
  const hashKey = await grindKey(password, difficulty);
  const iv = await getIv(password);

  const key = await window.crypto.subtle.importKey(
    'raw',
    hashKey,
    {
      name: 'AES-GCM',
    },
    false,
    ['encrypt']
  );

  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
      tagLength: 128,
    },
    key,
    new TextEncoder().encode(data)
  );

  const result = Array.from(iv).concat(Array.from(new Uint8Array(encrypted)));

  return base64Encode(new Uint8Array(result));
};

export const aesDecrypt = async (
  ciphertext: string,
  password: string,
  difficulty = 10
) => {
  const ciphertextBuffer = Array.from(base64Decode(ciphertext));
  const hashKey = await grindKey(password, difficulty);

  const key = await window.crypto.subtle.importKey(
    'raw',
    hashKey,
    {
      name: 'AES-GCM',
    },
    false,
    ['decrypt']
  );

  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: new Uint8Array(ciphertextBuffer.slice(0, 12)),
      tagLength: 128,
    },
    key,
    new Uint8Array(ciphertextBuffer.slice(12))
  );

  return new TextDecoder().decode(new Uint8Array(decrypted));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const base64Encode = (u8: any) => {
  return btoa(String.fromCharCode.apply(null, u8));
};

const base64Decode = (str: string) => {
  return new Uint8Array(
    atob(str)
      .split('')
      .map(c => c.charCodeAt(0))
  );
};

const grindKey = (password: string, difficulty: number) => {
  return pbkdf2(
    password,
    password + password,
    Math.pow(2, difficulty),
    32,
    'SHA-256'
  );
};

const getIv = async (password: string) => {
  const ivHash = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(password)
  );

  return new Uint8Array(ivHash.slice(0, 12));
};

const pbkdf2 = async (
  message: string,
  salt: string,
  iterations: number,
  keyLen: number,
  algorithm: string
) => {
  const msgBuffer = new TextEncoder().encode(message);
  const msgUint8Array = new Uint8Array(msgBuffer);
  const saltBuffer = new TextEncoder().encode(salt);
  const saltUint8Array = new Uint8Array(saltBuffer);

  const key = await crypto.subtle.importKey(
    'raw',
    msgUint8Array,
    {
      name: 'PBKDF2',
    },
    false,
    ['deriveBits']
  );

  const buffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltUint8Array,
      iterations: iterations,
      hash: algorithm,
    },
    key,
    keyLen * 8
  );

  return new Uint8Array(buffer);
};

// Client-side Cryptography & PIN security using Web Crypto API

export async function hashPin(pin: string, salt: string = 'itoura-vault-salt'): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(pin + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function encryptText(plainText: string, pin: string): Promise<string> {
  try {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc.encode(pin.padEnd(32, '#').slice(0, 32)),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    const salt = enc.encode('itoura-entry-salt');
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      enc.encode(plainText)
    );

    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);

    return btoa(String.fromCharCode(...combined));
  } catch (err) {
    console.error('Encryption error:', err);
    return plainText;
  }
}

export async function decryptText(cipherText: string, pin: string): Promise<string> {
  try {
    if (!cipherText || !/^[A-Za-z0-9+/=]+$/.test(cipherText)) {
      return cipherText;
    }

    const binaryString = atob(cipherText);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    if (bytes.length < 13) return cipherText;

    const iv = bytes.slice(0, 12);
    const data = bytes.slice(12);

    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc.encode(pin.padEnd(32, '#').slice(0, 32)),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    const salt = enc.encode('itoura-entry-salt');
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );

    return new TextDecoder().decode(decrypted);
  } catch {
    return cipherText;
  }
}

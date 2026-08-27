import CryptoJS from 'crypto-js';

// Fixed IV for legacy (v1) encryption only
const LEGACY_IV = CryptoJS.enc.Utf8.parse(
	'\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00',
);

export const hashMD5 = (data: string) => {
	const md5Key = CryptoJS.MD5(data).toString();
	return CryptoJS.enc.Utf8.parse(md5Key);
};

// Different finance-API PHP components read the same logical "company id" under
// different field names (InfogID, Infog_CompanyID, InfogCompanyID, infogCompanyID,
// CompanyID, companyID, MFICompanyID, infogID). Until the API is normalised,
// mirror whichever alias the caller set under all the others before encrypting
// so every PHP component finds the value. Purely additive: if a saga already
// set a specific alias to a non-empty value, that value is preserved.
const COMPANY_ID_ALIASES = [
	'InfogID', 'Infog_CompanyID', 'InfogCompanyID', 'infogCompanyID',
	'CompanyID', 'companyID', 'MFICompanyID', 'infogID',
];
const normaliseCompanyIdAliases = (data: any): any => {
	if (!data || typeof data !== 'object') return data;
	let canonical: any;
	for (const k of COMPANY_ID_ALIASES) {
		if (data[k] !== undefined && data[k] !== null && data[k] !== '') {
			canonical = data[k];
			break;
		}
	}
	if (canonical === undefined) return data;
	const out: any = { ...data };
	for (const k of COMPANY_ID_ALIASES) {
		if (out[k] === undefined || out[k] === null || out[k] === '') out[k] = canonical;
	}
	return out;
};

// Encrypt function (returns Hex) - legacy v1 style
export const encryptData = (data: object, key: string): string => {
	const KEY = hashMD5(key);
	const jsonString = JSON.stringify(normaliseCompanyIdAliases(data));
	const encrypted = CryptoJS.AES.encrypt(jsonString, KEY, {
		iv: LEGACY_IV,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7,
	});
	return CryptoJS.enc.Hex.stringify(CryptoJS.enc.Base64.parse(encrypted.toString()));
};

/** Encrypt format: hex(iv_16_bytes + ciphertext), key = SHA256(keyValue) */
export const encryptDataV2 = (data: object, key: string): string => {
	const KEY = CryptoJS.SHA256(CryptoJS.enc.Utf8.parse(key));
	const iv = CryptoJS.lib.WordArray.random(16);
	const jsonString = JSON.stringify(normaliseCompanyIdAliases(data));
	const encrypted = CryptoJS.AES.encrypt(jsonString, KEY, {
		iv,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7,
	});
	const packed = iv.concat(encrypted.ciphertext);
	return packed.toString(CryptoJS.enc.Hex);
};

/** Decrypt format: hex(iv_16_bytes + ciphertext), key = SHA256(keyValue) */
const decryptV2 = (encryptedHex: string, key: string) => {
	const KEY = CryptoJS.SHA256(CryptoJS.enc.Utf8.parse(key));
	const hex = encryptedHex.startsWith('v2:') ? encryptedHex.slice(3) : encryptedHex;
	const raw = CryptoJS.enc.Hex.parse(hex);
	const words = raw.words;
	const sigBytes = raw.sigBytes;
	if (sigBytes < 16) {
		console.error('decryptData v2: Payload too short for IV');
		return null;
	}
	// First 16 bytes = IV (4 words)
	const iv = CryptoJS.lib.WordArray.create(words.slice(0, 4), 16);
	// Rest = ciphertext
	const cipherWords = words.slice(4);
	const cipherSigBytes = sigBytes - 16;
	const ciphertext = CryptoJS.lib.WordArray.create(cipherWords, cipherSigBytes);
	const cipherBase64 = ciphertext.toString(CryptoJS.enc.Base64);
	const decrypted = CryptoJS.AES.decrypt(cipherBase64, KEY, {
		iv,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7,
	});
	return decrypted.toString(CryptoJS.enc.Utf8);
};

// Decrypt Data (supports v2 backend format and legacy)
export const decryptData = (encryptedHex: string, key: string) => {
	try {
		// Validate input
		if (!encryptedHex || typeof encryptedHex !== 'string' || encryptedHex.trim() === '') {
			console.error('decryptData: Invalid encryptedHex input');
			return { data: null, response: null };
		}

		let decryptedText: string | null = decryptV2(encryptedHex, key);

		if (!decryptedText) {
			const KEY = hashMD5(key);
			let encryptedBase64;
			try {
				encryptedBase64 = CryptoJS.enc.Hex.parse(encryptedHex).toString(
					CryptoJS.enc.Base64,
				);
			} catch (error) {
				console.error('decryptData: Error parsing hex to base64', error);
				return { data: null, response: null };
			}
			const decrypted = CryptoJS.AES.decrypt(encryptedBase64, KEY, {
				iv: LEGACY_IV,
				mode: CryptoJS.mode.CBC,
				padding: CryptoJS.pad.Pkcs7,
			});
			decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
		}

		if (!decryptedText || decryptedText.trim() === '') {
			console.error(
				'decryptData: Decryption resulted in empty string - possibly wrong key or corrupted data',
			);
			return { data: null, response: null };
		}

		try {
			return JSON.parse(decryptedText);
		} catch (parseError) {
			console.error('decryptData: Error parsing decrypted JSON', parseError);
			return { data: null, response: null };
		}
	} catch (error) {
		console.error('decryptData: Unexpected error during decryption', error);
		return { data: null, response: null };
	}
};

export const isDecryptFailure = (decoded: any) => {
	if (!decoded || typeof decoded !== 'object') return true;
	const keys = Object.keys(decoded);
	return (
		decoded.data === null &&
		decoded.response === null &&
		keys.length <= 2 &&
		keys.every((k) => k === 'data' || k === 'response')
	);
};

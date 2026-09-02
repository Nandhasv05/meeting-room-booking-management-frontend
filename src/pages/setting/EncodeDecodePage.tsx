// AUTHOR : NANDHAKUMAR S V
// DATE : 28/08/2026
// DESCRIPTION : Encode / decode API requestToken and response envelopes
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { BrandLogo } from '../../components/brand/BrandLogo';
import { PageHeader } from '../../components/ui/Feedback';
import { Field, GhostButton, inputClass, PrimaryButton } from '../../components/ui/Form';
import { Card, CardHeader } from '../../components/ui/Surface';
import { API_CRYPTO_KEY, API_URL } from '../../redux/const';
import { decryptData, encryptDataV2, isDecryptFailure } from '../../redux/_common/enode-decode';

const textareaClass = `${inputClass} min-h-[180px] resize-y font-mono text-[13px] leading-relaxed`;

function extractCipher(raw: string): string {
  const text = raw.trim();
  if (!text) return '';
  try {
    const parsed = JSON.parse(text) as Record<string, unknown>;
    if (typeof parsed.requestToken === 'string' && parsed.requestToken.trim()) return parsed.requestToken.trim();
    if (typeof parsed.response === 'string' && parsed.response.trim()) return parsed.response.trim();
  } catch {
    /* paste was the hex token itself */
  }
  return text.replace(/^["']|["']$/g, '').trim();
}

function pretty(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

async function copyText(value: string, label: string) {
  if (!value) return;
  await navigator.clipboard.writeText(value);
  toast.success(`${label} copied`);
}

export function EncodeDecodePage() {
  const [key, setKey] = useState(API_CRYPTO_KEY);
  const [cipherIn, setCipherIn] = useState('');
  const [plainIn, setPlainIn] = useState('{\n  "email": "admin",\n  "password": "Password#123"\n}');
  const [decoded, setDecoded] = useState('');
  const [encoded, setEncoded] = useState('');
  const [decodeError, setDecodeError] = useState('');
  const [encodeError, setEncodeError] = useState('');
  const [loginResult, setLoginResult] = useState('');

  const cryptoKey = useMemo(() => key.trim() || API_CRYPTO_KEY, [key]);

  const decode = () => {
    setDecodeError('');
    const token = extractCipher(cipherIn);
    if (!token) {
      setDecoded('');
      setDecodeError('Paste a requestToken, response hex, or the full JSON body.');
      return;
    }
    const result = decryptData(token, cryptoKey);
    if (isDecryptFailure(result)) {
      setDecoded('');
      setDecodeError('Could not decode. Check the key and that the token is complete.');
      return;
    }
    setDecoded(pretty(result));
  };

  const encode = () => {
    setEncodeError('');
    const text = plainIn.trim();
    if (!text) {
      setEncoded('');
      setEncodeError('Paste JSON to encode.');
      return;
    }
    let payload: object;
    try {
      const parsed = JSON.parse(text) as unknown;
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        setEncoded('');
        setEncodeError('JSON must be an object, for example { "email": "admin", "password": "..." }.');
        return;
      }
      payload = parsed;
    } catch {
      setEncoded('');
      setEncodeError('Invalid JSON.');
      return;
    }
    const token = encryptDataV2(payload, cryptoKey);
    setEncoded(JSON.stringify({ requestToken: token }, null, 2));
    return JSON.stringify({ requestToken: token });
  };

  const sendLogin = async () => {
    setLoginResult('');
    const body = encode();
    if (!body) return;
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      const json = (await res.json()) as { success?: boolean; message?: string };
      const text = `${res.status} — ${json.message || 'No message'}`;
      setLoginResult(text);
      if (json.success) toast.success(json.message || 'Signed in.');
      else toast.error(json.message || 'Login failed');
    } catch (err) {
      const text = err instanceof Error ? err.message : 'Login request failed';
      setLoginResult(text);
      toast.error(text);
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Encode / Decode"
        description="Turn API requestToken / response hex into JSON, or JSON into a requestToken. Uses the same AES key as the app."
      />

      <Card>
        <Field label="Crypto key" hint="Must match backend API_CRYPTO_KEY (default MeetingHallApiKey).">
          <input className={inputClass} value={key} onChange={(e) => setKey(e.target.value)} autoComplete="off" />
        </Field>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Decode" subtitle="Paste requestToken, response, or the whole { requestToken } body." />
          <textarea
            className={textareaClass}
            value={cipherIn}
            onChange={(e) => setCipherIn(e.target.value)}
            placeholder='{"requestToken":"..."}'
            spellCheck={false}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <PrimaryButton type="button" onClick={decode}>
              Decode
            </PrimaryButton>
            <GhostButton type="button" onClick={() => void copyText(decoded, 'Decoded JSON')}>
              Copy result
            </GhostButton>
          </div>
          {decodeError ? <p className="mt-2 text-xs text-rose-700">{decodeError}</p> : null}
          {decoded ? (
            <pre className="mt-3 max-h-72 overflow-auto rounded-xl bg-mist/70 p-3 font-mono text-[13px] text-navy-900">
              {decoded}
            </pre>
          ) : null}
        </Card>

        <Card>
          <CardHeader
            title="Encode"
            subtitle='Login JSON must use email (or username) and password, then POST to /api/auth/login. Example: admin / Password#123'
          />
          <textarea
            className={textareaClass}
            value={plainIn}
            onChange={(e) => setPlainIn(e.target.value)}
            spellCheck={false}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <PrimaryButton type="button" onClick={encode}>
              Encode
            </PrimaryButton>
            <GhostButton type="button" onClick={() => void sendLogin()}>
              Send to /api/auth/login
            </GhostButton>
            <GhostButton type="button" onClick={() => void copyText(encoded, 'Encoded body')}>
              Copy result
            </GhostButton>
          </div>
          {encodeError ? <p className="mt-2 text-xs text-rose-700">{encodeError}</p> : null}
          {loginResult ? <p className="mt-2 text-xs font-medium text-navy-800">{loginResult}</p> : null}
          {encoded ? (
            <pre className="mt-3 max-h-72 overflow-auto rounded-xl bg-mist/70 p-3 font-mono text-[13px] text-navy-900">
              {encoded}
            </pre>
          ) : null}
        </Card>
      </div>
    </div>
  );
}

export function EncodeDecodeStandalonePage() {
  return (
    <div className="min-h-[100dvh] bg-[#f6f8f7] px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <BrandLogo height={32} to={null} />
        </div>
        <EncodeDecodePage />
      </div>
    </div>
  );
}

export default EncodeDecodePage;

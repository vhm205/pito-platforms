import { GenerateTokenProps } from '../dtos/acb.dto';

export async function generateToken({
  clientId,
  clientSecret,
  paymentGatewayUrl,
  paymentApiKey,
}: GenerateTokenProps): Promise<{ access_token: string; expires_in: number }> {
  const urlencoded = new URLSearchParams();
  urlencoded.append('grant_type', 'client_credentials');
  urlencoded.append('scope', 'soba-api service:qr-payment');
  urlencoded.append('client_secret', clientSecret);
  urlencoded.append('client_id', clientId);

  try {
    const result = await fetch(`${paymentGatewayUrl}/acb/generate-token`, {
      method: 'POST',
      body: JSON.stringify({
        urlencoded: urlencoded.toString(),
      }),
      headers: {
        'payment-pitovn-api-key': paymentApiKey,
      },
    });

    const response = await result.json();
    return response;
  } catch {
    const result = await fetch(
      `https://id.acb.com.vn/auth/realms/soba/protocol/openid-connect/token`,
      {
        method: 'POST',
        body: urlencoded,
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    const response = await result.json();
    return response;
  }
}

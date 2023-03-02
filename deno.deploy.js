import { serve } from 'https://deno.land/std@0.178.0/http/server.ts';
import { serveDir } from 'https://deno.land/std@0.178.0/http/file_server.ts';

const setHeaders = (res) => {
  res.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  );
  res.headers.set('X-XSS-Protection', '1; mode=block');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set(
    'Content-Security-Policy',
    "default-src 'self' http: https: ws: wss: data: blob: 'unsafe-inline'; frame-ancestors 'self'"
  );
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Server', 'LitServer');
  return res;
};

serve(async (req) => {
  const originURL = new URL(req.url);
  const host = originURL.host;
  if (host === 'cufoon.com') {
    originURL.host = 'www.cufoon.com';
    const headers = {
      headers: new Headers([['Location', originURL.href]])
    };
    setHeaders(headers);
    return new Response(null, { headers: headers.headers, status: 301 });
  }
  const res = await serveDir(req, {
    fsRoot: './html'
  });
  return setHeaders(res);
});

/**
 * Cloudflare Pages Function: /css
 * 
 * Handles Google Fonts-style public CSS integration API:
 * Examples:
 *   https://fontguj.pages.dev/css?family=UC_AjantaTwo
 *   https://fontguj.pages.dev/css?family=UC_AjantaTwo|NotoSansGujarati
 *   https://fontguj.pages.dev/css?family=UCAjantaTwo
 */

const FONT_REGISTRY = [
  {
    family: 'UC_AjantaTwo',
    aliases: ['ucajantatwo', 'uc-ajantatwo', 'ajantatwo', 'ajanta'],
    weight: 700,
    style: 'normal',
    file: 'UCAjantaTwo-Bold.woff2',
    display: 'swap'
  }
];

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // Handle CORS Preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const origin = `${url.protocol}//${url.host}`;
  const familyParams = url.searchParams.getAll('family');

  // Parse pipe-separated (|), comma-separated (,), and repeated ?family= params
  let requestedFamilies = [];
  if (familyParams.length > 0) {
    requestedFamilies = familyParams.flatMap(param => 
      param.split(/[|,]/).map(item => item.trim()).filter(Boolean)
    );
  }

  // If no family requested, return usage instructions and list of available families
  if (requestedFamilies.length === 0) {
    const usageComment = `/* FontGuj - Gujarati Web Fonts Integration API */
/* Usage Example: */
/* <link rel="stylesheet" href="${origin}/css?family=UC_AjantaTwo"> */
/* body { font-family: 'UC_AjantaTwo', sans-serif; } */
/* Available families: ${FONT_REGISTRY.map(f => f.family).join(', ')} */
`;
    return new Response(usageComment, {
      status: 200,
      headers: {
        'Content-Type': 'text/css; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  }

  const matchedFonts = [];
  const unknownFamilies = [];

  for (const req of requestedFamilies) {
    const cleanReq = req.split(':')[0].trim().toLowerCase().replace(/[\s\-_]/g, '');
    const match = FONT_REGISTRY.find(f => {
      const primary = f.family.toLowerCase().replace(/[\s\-_]/g, '');
      if (primary === cleanReq) return true;
      return f.aliases && f.aliases.some(a => a.toLowerCase().replace(/[\s\-_]/g, '') === cleanReq);
    });

    if (match) {
      if (!matchedFonts.includes(match)) {
        matchedFonts.push(match);
      }
    } else {
      unknownFamilies.push(req);
    }
  }

  if (matchedFonts.length === 0) {
    const errorCss = `/* FontGuj CSS API Error: Requested font family not found: ${unknownFamilies.join(', ')} */
/* Available families: ${FONT_REGISTRY.map(f => f.family).join(', ')} */
/* Visit ${origin}/ to browse available Gujarati web fonts. */
`;
    return new Response(errorCss, {
      status: 404,
      headers: {
        'Content-Type': 'text/css; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  const cssBlocks = matchedFonts.map(font => {
    const fontUrl = `${origin}/fonts/${font.file}`;
    return `/* FontGuj - ${font.family} (weight: ${font.weight}) */
@font-face {
  font-family: '${font.family}';
  src: url('${fontUrl}') format('woff2');
  font-weight: ${font.weight};
  font-style: ${font.style};
  font-display: ${font.display};
}`;
  });

  let responseBody = `/* FontGuj - Public Gujarati Web Fonts Platform (Cloudflare Pages) */
/* Documentation: ${origin}/ */

${cssBlocks.join('\n\n')}
`;

  if (unknownFamilies.length > 0) {
    responseBody += `\n/* Note: Unknown family requested: ${unknownFamilies.join(', ')} */\n`;
  }

  return new Response(responseBody, {
    status: 200,
    headers: {
      'Content-Type': 'text/css; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      'Vary': 'Accept-Encoding',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

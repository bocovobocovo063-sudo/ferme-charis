const https = require('https');
const urls = [
  'https://charis-ferme.netlify.app/',
  'https://charis-ferme.netlify.app/privacy.html',
  'https://charis-ferme.netlify.app/cookie-policy.html',
  'https://charis-ferme.netlify.app/terms.html'
];
urls.forEach(url => {
  https.get(url, res => {
    console.log(`${url} -> ${res.statusCode} ${res.headers.location || ''}`);
    res.on('data', () => {});
    res.on('end', () => {});
  }).on('error', e => console.log(`${url} ERR ${e.message}`));
});

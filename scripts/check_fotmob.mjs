import https from 'https';

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', reject);
  });
}

async function main() {
  // Check league page
  console.log('=== World Cup League Page ===');
  let html = await get('https://www.fotmob.com/leagues/77/');
  let m = html.match(/__NEXT_DATA__.*?<\/script>/);
  if (!m) { console.log('no next data'); return; }
  let json = JSON.parse(m[0].replace('__NEXT_DATA__" type="application/json">', '').replace('</script>', ''));
  let pp = json.props.pageProps;
  console.log('Keys:', Object.keys(pp).join(', '));
  Object.keys(pp).forEach(k => {
    const v = pp[k];
    if (v && typeof v === 'object' && !Array.isArray(v)) console.log('  ' + k + ':', Object.keys(v).slice(0,20).join(', '));
    else if (Array.isArray(v)) console.log('  ' + k + ': Array[' + v.length + ']');
    else console.log('  ' + k + ':', typeof v);
  });

  // Check if there's a matches array or fixtures
  if (pp.fixtures || pp.matches) {
    console.log('Fixtures available:', JSON.stringify(pp.fixtures || pp.matches).substring(0, 500));
  }

  // Check team page
  console.log('\n=== Team Page (France) ===');
  html = await get('https://www.fotmob.com/teams/6723/overview/france');
  m = html.match(/__NEXT_DATA__.*?<\/script>/);
  if (m) {
    json = JSON.parse(m[0].replace('__NEXT_DATA__" type="application/json">', '').replace('</script>', ''));
    pp = json.props.pageProps;
    console.log('Keys:', Object.keys(pp).join(', '));
    if (pp.fixtures) console.log('Fixtures: avail');
    if (pp.lastMatches) console.log('lastMatches: avail');
  } else {
    console.log('no next data');
  }
}

main().catch(e => console.error(e.message));

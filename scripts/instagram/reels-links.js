// Reels link collector, browser route (docs/tasks/TASK-setup.md). Companion to console.js, which skips Reels.
// Reads only the links already rendered on the profile's Reels tab; no API calls, no cookies.
//
// Use: open https://www.instagram.com/<handle>/reels/ logged in, in a wide window,
// DevTools -> Console (Option+Cmd+J), paste this whole file, press Enter. It scrolls the tab until
// no new Reels appear and downloads reels.txt (one URL per line) into Downloads. Then:
//   mkdir -p references/instagram/<handle>
//   mv ~/Downloads/reels.txt references/instagram/<handle>/reels.txt
//   .venv-ig/bin/yt-dlp --cookies-from-browser chrome -a references/instagram/<handle>/reels.txt \
//     -o 'references/instagram/<handle>/reels/%(upload_date)s_%(id)s.%(ext)s' \
//     --write-info-json --write-thumbnail --sleep-interval 3 --max-sleep-interval 8
//
//   Stop early: window.__stopReels = true
;(async () => {
  const handle = location.pathname.split('/').filter(Boolean)[0]
  if (!['www.instagram.com', 'instagram.com'].includes(location.hostname) ||
      !/^[\w.]{1,30}$/.test(handle || '') || !/\/reels\/?$/.test(location.pathname)) {
    console.error('Open the profile Reels tab first: instagram.com/<handle>/reels/')
    return
  }
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
  const found = new Map()
  window.__stopReels = false
  let idle = 0
  while (idle < 5 && !window.__stopReels) {
    const before = found.size
    for (const a of document.querySelectorAll('main a[href*="/reel/"]')) {
      const m = new URL(a.href, location.origin).pathname.match(/\/reel\/([\w-]+)/)
      if (m) found.set(m[1], `https://www.instagram.com/reel/${m[1]}/`)
    }
    idle = found.size === before ? idle + 1 : 0
    console.log(`${found.size} reels`)
    window.scrollTo(0, document.body.scrollHeight)
    await sleep(1800 + Math.round(Math.random() * 1200))
  }
  const blob = new Blob([[...found.values()].join('\n') + '\n'], { type: 'text/plain' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'reels.txt'
  link.click()
  console.log(`Saved reels.txt with ${found.size} reels.`)
})()

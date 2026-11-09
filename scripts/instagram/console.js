// Discovery (docs/tasks/TASK-setup.md), browser route. Reused from lunares/desmolde (2026-11-04 repair).
// Ported from model-portfolio's docs/reference/instagram/collect-posts.js (Bia's site).
//
// Uses the visible Instagram UI; Instagram can still throttle or block requests.
// Reels are skipped: this route collects photos. For each photo post it opens
// the post viewer, clicks through every
// carousel slide, reads the date and caption, and downloads that post's slides at
// once (ig-<handle>_<shortcode>_<NN>.jpg). When every post is done it saves
// ig-<handle>.json. Progress is kept in localStorage, so after a reload, pasting the
// script again skips the posts already done.
//
// Use: open https://www.instagram.com/<handle>/ logged in, in a wide window,
// DevTools → Console (⌥⌘J), paste this whole file, press Enter. Allow multiple
// downloads when Chrome asks. Leave the tab alone (~5 s per post). Then:
//   /usr/bin/python3 scripts/instagram/collect.py --from-json ~/Downloads/ig-<handle>.json
//
//   Stop early:            window.__stopCollect = true
//   Save the JSON now:     window.__saveCollect()
//   Start over from zero:  localStorage.removeItem('collect:<handle>')
;(async () => {
  const handle = location.pathname.split('/').filter(Boolean)[0]
  if (!['www.instagram.com', 'instagram.com'].includes(location.hostname) ||
      !/^[\w.]{1,30}$/.test(handle || '') ||
      ['p', 'reel', 'reels', 'accounts', 'explore', 'direct', 'stories'].includes(handle) ||
      /\/(?:p|reel)\//.test(location.pathname)) {
    console.error('Open an Instagram profile page (instagram.com/<handle>/) first.')
    return
  }
  if (window.__igCollecting) {
    console.warn('A collector is already running. Refresh the profile before restarting.')
    return
  }
  window.__igCollecting = true
  try {
    const profilePath = location.pathname
    const STORE = `collect:${handle}`
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
    const jitter = (ms) => ms + Math.round(Math.random() * ms * 0.5)
    const NEXT_LABELS = ['Next', 'Avançar', 'Próximo', 'Siguiente', 'Suivant']
    window.__stopCollect = false

    const load = () => {
      try {
        return JSON.parse(localStorage.getItem(STORE)) ?? null
      } catch {
        return null
      }
    }
    const persist = (state) => localStorage.setItem(STORE, JSON.stringify(state))

    const waitFor = async (fn, timeout = 8000) => {
      const start = Date.now()
      while (Date.now() - start < timeout && !window.__stopCollect) {
        const v = fn()
        if (v) return v
        await sleep(150)
      }
      return null
    }

    const largest = (img) => {
      const set = (img.getAttribute('srcset') || '')
        .split(',')
        .map((s) => s.trim().split(/\s+/))
        .filter(([u]) => u)
        .map(([u, w]) => ({ u, w: parseInt(w, 10) || 0 }))
        .sort((a, b) => b.w - a.w)
      return set[0]?.u || img.currentSrc || img.src
    }
    // The same photo appears with different query strings; the path identifies it.
    const key = (url) => {
      try {
        return new URL(url).pathname
      } catch {
        return url
      }
    }

    const save = (blob, name) => {
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = name
      a.click()
      setTimeout(() => URL.revokeObjectURL(a.href), 5000)
    }

    const gridLinks = () =>
      [...document.querySelectorAll('main a[href*="/p/"], main a[href*="/reel/"]')].map((a) => ({
        a,
        href: a.getAttribute('href'),
        code: a.getAttribute('href').split('/').filter(Boolean).pop(),
      }))

    // 1. The post list, built once by scrolling the grid to the end, then reused from storage.
    let state = load()
    if (!state?.links?.length) {
      const links = []
      const seen = new Set()
      let still = 0
      let last = 0
      while (still < 4 && !window.__stopCollect) {
        for (const l of gridLinks()) {
          if (!seen.has(l.code)) {
            seen.add(l.code)
            links.push({ code: l.code, href: l.href, isReel: l.href.includes('/reel/') })
          }
        }
        window.scrollTo(0, document.body.scrollHeight)
        await sleep(1800)
        still = document.body.scrollHeight === last ? still + 1 : 0
        last = document.body.scrollHeight
        console.log(`grid: ${links.length} posts`)
      }
      state = { links, posts: {} }
      persist(state)
    } else {
      console.log(`resuming: ${Object.values(state.posts).filter((p) => p.slides.length).length}/${state.links.length} done`)
    }

    const writeJson = () => {
      const posts = state.links.map((l) => state.posts[l.code]).filter(Boolean)
      const data = { handle, read_at: new Date().toISOString().slice(0, 19) + '+00:00', method: 'posts', posts }
      save(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }), `ig-${handle}.json`)
      console.log(`saved ig-${handle}.json with ${posts.length} posts`)
    }
    window.__saveCollect = writeJson

    // 2. Find a tile without leaving the page: scroll the grid until it's rendered.
    const findTile = async (href) => {
      const hit = () => gridLinks().find((l) => l.href === href)?.a
      if (hit()) return hit()
      window.scrollTo(0, 0)
      await sleep(600)
      for (let i = 0; i < 60 && !window.__stopCollect; i++) {
        if (hit()) return hit()
        window.scrollBy(0, window.innerHeight * 0.8)
        await sleep(700)
      }
      return null
    }

    const visible = (element) => {
      const box = element.getBoundingClientRect()
      return box.width > 0 && box.height > 0 && getComputedStyle(element).visibility !== 'hidden'
    }
    const dialogRoot = () => {
      const dialogs = [...document.querySelectorAll('[role="dialog"]')].filter(visible)
      const dialog = dialogs.find((d) => d.querySelector('article img, article video')) || dialogs.at(-1)
      return dialog?.querySelector('article') || dialog ||
        (/\/(?:p|reel)\//.test(location.pathname) ? document.querySelector('main article, article') : null)
    }
    const nextButton = (root) =>
      [...root.querySelectorAll('button, [role="button"]')].find((b) =>
        visible(b) && !b.disabled && b.getAttribute('aria-disabled') !== 'true' &&
        [b, ...b.querySelectorAll('[aria-label]')].some((e) => NEXT_LABELS.includes(e.getAttribute('aria-label'))))
    const diagnostics = (reason, link) => {
      console.warn('[IG collector] Stopped:', reason, link.href, JSON.stringify({
        path: location.pathname,
        dialogs: document.querySelectorAll('[role="dialog"]').length,
        articles: document.querySelectorAll('article').length,
        images: [...(dialogRoot()?.querySelectorAll('img') || [])].map((img) => ({
          width: Math.round(img.getBoundingClientRect().width),
          loaded: img.complete && img.naturalWidth > 0,
          host: (() => {
            try { return new URL(img.currentSrc || img.src).hostname } catch { return '' }
          })(),
        })),
      }))
    }
    const closeDialog = async (historyBeforeOpen) => {
      const onProfile = () => location.pathname === profilePath &&
        !document.querySelector('[role="dialog"]') && gridLinks().length > 0
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
      if (await waitFor(onProfile, 2500)) return true
      if (document.querySelector('[role="dialog"]')) {
        const close = document.querySelector('[role="dialog"] svg[aria-label="Close"], [role="dialog"] svg[aria-label="Fechar"]')
        close?.closest('button, div[role="button"]')?.click()
        if (await waitFor(onProfile, 2500)) return true
      }
      if (/\/(?:p|reel)\//.test(location.pathname) && history.length > historyBeforeOpen) {
        console.log('[IG collector] Returning to profile through browser history')
        history.back()
        if (await waitFor(onProfile, 10000)) return true
      }
      return false
    }

    // 3. Open each remaining post, read it, download its slides at once.
    for (const link of state.links) {
      if (window.__stopCollect) break
      if (link.isReel || link.href.includes('/reel/')) continue
      console.log('[IG collector] Opening', link.href)
      // A post saved with no slides was a miss, so try it again.
      if (state.posts[link.code]?.slides?.length) continue

      const tile = await findTile(link.href)
      if (!tile) {
        diagnostics('could not find on the grid', link)
        break
      }
      tile.scrollIntoView({ block: 'center' })
      await sleep(400)
      const historyBeforeOpen = history.length
      tile.click()

      const root = await waitFor(() => {
        const d = dialogRoot()
        return d && d.querySelector('img[src], img[srcset], video') ? d : null
      })
      if (!root) {
        diagnostics('post viewer not detected', link)
        break
      }
      await sleep(jitter(700))

      const slides = new Map()
      const read = () => {
        for (const img of root.querySelectorAll('img')) {
          const box = img.getBoundingClientRect()
          // Photos come from cdninstagram.com or fbcdn.net; the size test rules out avatars and icons.
          if (box.width < 200 || !img.complete || !img.naturalWidth || !/cdninstagram|fbcdn/.test(img.currentSrc || img.src)) continue
          const url = largest(img)
          if (url && !slides.has(key(url))) {
            slides.set(key(url), { url, alt_text: img.getAttribute('alt'), is_video: false, width: img.naturalWidth || null, height: img.naturalHeight || null })
          }
        }
        for (const v of root.querySelectorAll('video')) {
          const box = v.getBoundingClientRect()
          if (box.width < 200 || !v.poster) continue
          if (!slides.has(key(v.poster))) slides.set(key(v.poster), { url: v.poster, alt_text: null, is_video: true, width: null, height: null })
        }
      }
      await waitFor(() => { read(); return slides.size > 0 }, 10000)
      for (let step = 0; step < 20; step++) {
        if (window.__stopCollect) break
        const next = nextButton(root)
        if (!next) break
        next.click()
        await sleep(jitter(650))
        read()
      }

      const found = [...slides.values()]
      if (!found.length) {
        diagnostics('no loaded media found; leave this viewer open for inspection', link)
        break
      }
      const saved = []
      for (const [j, slide] of found.entries()) {
        const name = `ig-${handle}_${link.code}_${String(j + 1).padStart(2, '0')}.jpg`
        try {
          const response = await fetch(slide.url, { signal: AbortSignal.timeout(20000) })
          if (!response.ok) throw new Error(`HTTP ${response.status}`)
          const blob = await response.blob()
          if (!blob.type.startsWith('image/')) throw new Error(`Unexpected content: ${blob.type}`)
          save(blob, name)
          const { url, ...rest } = slide // URLs expire; the file is what matters
          saved.push({ ...rest, download: name })
        } catch (err) {
          console.warn('skipped image', link.href, j + 1, err)
        }
        await sleep(250)
      }

      const caption = root.querySelector('h1')?.innerText ?? ''
      state.posts[link.code] = {
        shortcode: link.code,
        url: new URL(link.href, location.origin).href,
        date_utc: root.querySelector('time[datetime]')?.getAttribute('datetime') ?? null,
        type: link.isReel ? 'video' : saved.length > 1 ? 'carousel' : 'image',
        caption,
        alt_text: null,
        tagged_users: [],
        mentions: [...caption.matchAll(/@([\w.]+)/g)].map((x) => x[1]),
        slides: saved,
      }
      persist(state)
      const done = Object.values(state.posts).filter((p) => p.slides.length).length
      console.log(`post ${done}/${state.links.length}: ${saved.length} slide(s) ${link.href}`)

      if (!(await closeDialog(historyBeforeOpen))) {
        diagnostics('could not return to profile', link)
        break
      }
      await sleep(jitter(1500))
    }

    const done = Object.values(state.posts).filter((p) => p.slides.length).length
    const photoLinks = state.links.filter((l) => !l.isReel && !l.href.includes('/reel/'))
    const photoDone = photoLinks.filter((l) => state.posts[l.code]?.slides?.length).length
    if (photoDone === photoLinks.length) {
      writeJson()
      console.log(`done: ${photoDone} photo posts; ${state.links.length - photoLinks.length} Reels skipped. Progress kept in localStorage['${STORE}'].`)
    } else {
      console.log(`paused at ${done}/${state.links.length}. Paste the script again to continue, or run window.__saveCollect() to save what's done.`)
    }
  } catch (error) {
    console.error('[IG collector] Stopped; saved progress is preserved.', error)
  } finally {
    window.__igCollecting = false
  }
})()

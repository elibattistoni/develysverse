(() => {
  const stack = document.querySelector('.fragment-stack');
  const fragments = [...stack.querySelectorAll('.fragment')];
  const mouseTilt = matchMedia('(any-hover: hover) and (any-pointer: fine) and (prefers-reduced-motion: no-preference)');
  let tiltFrame = 0;
  let tiltedArt;

  function resetTilt() {
    cancelAnimationFrame(tiltFrame);
    tiltFrame = 0;
    tiltedArt?.style.removeProperty('--rx');
    tiltedArt?.style.removeProperty('--ry');
    tiltedArt = undefined;
  }

  stack.addEventListener('pointermove', event => {
    if (!mouseTilt.matches || event.pointerType !== 'mouse') return;
    const fragment = event.target.closest('.fragment');
    if (!fragment) return resetTilt();
    const art = fragment.querySelector('.fragment-art');
    if (tiltedArt !== art) resetTilt();
    tiltedArt = art;
    cancelAnimationFrame(tiltFrame);
    tiltFrame = requestAnimationFrame(() => {
      const bounds = fragment.getBoundingClientRect();
      const x = Math.max(-.5, Math.min(.5, (event.clientX - bounds.left) / bounds.width - .5));
      const y = Math.max(-.5, Math.min(.5, (event.clientY - bounds.top) / bounds.height - .5));
      art.style.setProperty('--rx', `${-y * 7}deg`);
      art.style.setProperty('--ry', `${x * 9}deg`);
    });
  });
  stack.addEventListener('pointerleave', resetTilt);
  stack.addEventListener('pointercancel', resetTilt);
  mouseTilt.addEventListener('change', resetTilt);

  for (const fragment of fragments) {
    fragment.addEventListener('click', () => {
      const front = fragments.find(item => item.dataset.slot === 'front');
      if (front === fragment) return;
      resetTilt();
      front.dataset.slot = fragment.dataset.slot;
      front.setAttribute('aria-pressed', 'false');
      fragment.dataset.slot = 'front';
      fragment.setAttribute('aria-pressed', 'true');
    });
  }

  const rail = document.querySelector('#projectRail');
  const controls = document.querySelector('.rail-controls');
  const prev = document.querySelector('#railPrev');
  const next = document.querySelector('#railNext');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const cards = [...rail.children];

  function updateRail() {
    const limit = rail.scrollWidth - rail.clientWidth;
    controls.hidden = limit < 3;
    rail.tabIndex = controls.hidden ? -1 : 0;
    prev.disabled = rail.scrollLeft <= 2;
    next.disabled = rail.scrollLeft >= limit - 2;
  }

  function stepProjects(direction) {
    const step = cards[1].offsetLeft - cards[0].offsetLeft;
    const current = direction > 0 ? Math.floor((rail.scrollLeft + 3) / step) : Math.ceil((rail.scrollLeft - 3) / step);
    rail.scrollTo({ left: (current + direction) * step, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  }

  prev.addEventListener('click', () => stepProjects(-1));
  next.addEventListener('click', () => stepProjects(1));
  rail.addEventListener('scroll', updateRail, { passive: true });
  new ResizeObserver(updateRail).observe(rail);
  updateRail();

})();

(() => {
  const neuroscience = document.querySelector('.neuroscience-content');
  const desktop = matchMedia('(min-width: 801px)');

  function updateDetailsScroll() {
    const remaining = neuroscience.scrollHeight - neuroscience.clientHeight - neuroscience.scrollTop;
    neuroscience.parentElement.toggleAttribute('data-more-content', desktop.matches && remaining > 2);
  }

  function setDetailsFocus() {
    if (desktop.matches) {
      neuroscience.tabIndex = 0;
      neuroscience.setAttribute('role', 'region');
    } else {
      neuroscience.removeAttribute('tabindex');
      neuroscience.removeAttribute('role');
    }
    updateDetailsScroll();
  }

  setDetailsFocus();
  desktop.addEventListener('change', setDetailsFocus);
  neuroscience.addEventListener('scroll', updateDetailsScroll, { passive: true });
  new ResizeObserver(updateDetailsScroll).observe(neuroscience);
  document.fonts.ready.then(updateDetailsScroll);

  const expertise = document.querySelector('#expertise');
  for (const card of expertise.querySelectorAll('.expertise-card')) {
    const front = card.querySelector('.expertise-front');
    const back = card.querySelector('.expertise-back');
    const open = front.querySelector('.expertise-open');
    const close = back.querySelector('.expertise-back-button');
    const details = back.querySelector('.neuroscience-content');

    function flip(showBack) {
      const incoming = showBack ? back : front;
      const outgoing = showBack ? front : back;
      const nextFocus = showBack ? back.querySelector('h3') : open;

      incoming.inert = false;
      if (showBack && details) details.scrollTop = 0;
      card.toggleAttribute('data-flipped', showBack);
      open.setAttribute('aria-expanded', String(showBack));
      nextFocus.focus({ preventScroll: true });
      outgoing.inert = true;
    }

    back.inert = true;
    card.setAttribute('data-flip-ready', '');
    open.hidden = false;
    close.hidden = false;
    open.addEventListener('click', () => flip(true));
    close.addEventListener('click', () => flip(false));
  }


})();

(() => {
  const contact = document.querySelector('#contact');
  const copy = contact.querySelector('.contact-copy');
  const status = contact.querySelector('.contact-status');
  const fallback = contact.querySelector('.contact-fallback');
  const address = fallback.querySelector('span').textContent;
  let resetLabel;
  let copying = false;

  fallback.hidden = true;
  copy.hidden = false;
  copy.addEventListener('click', async () => {
    if (copying) return;
    copying = true;
    window.clearTimeout(resetLabel);
    copy.textContent = 'Copy email';
    status.textContent = '';

    try {
      await navigator.clipboard.writeText(address);
      fallback.hidden = true;
      copy.textContent = 'Email copied';
      status.textContent = 'Email address copied to the clipboard.';
      resetLabel = window.setTimeout(() => {
        copy.textContent = 'Copy email';
        status.textContent = '';
      }, 2500);
    } catch {
      fallback.hidden = false;
      status.textContent = 'Automatic copy failed. Select the email address to copy it manually.';
    } finally {
      copying = false;
    }
  });
})();

(() => {
  const map = document.querySelector('.skills-map');
  const canvas = map.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    map.querySelector('.skills-map-toolbar').hidden = true;
    canvas.hidden = true;
    map.querySelector('#skills-map-help').hidden = true;
    return;
  }

  const groups = [
    { color: '#76d9d3', center: [-2.8, -.65], narrow: [-.02,-2.65],
      note: 'React and TypeScript for frontend architecture, with open-source work on Raycast extensions.' },
    { color: '#aabdf7', center: [2.72, -.77], narrow: [-.40,.03],
      note: 'Python, statistical modeling and machine learning for analytics, NLP and data visualization.' },
    { color: '#c6b7ff', center: [.32, 1.58], narrow: [.03,2.63] }
  ];
  // These coordinates define the first readable view. Depth is revealed by rotation.
  const points = [
    ['React', 0, -.35, -.39,.44, true], ['TypeScript', 0, -1.30,.21,-.31],
    ['Next.js', 0, .26,-1.12,-.25], ['Frontend Architecture', 0, .96,.17,.08],
    ['Testing', 0, -.48,.92,-.54], ['Open Source', 0, .84,.94,.38],
    ['Machine Learning', 1, -.45,.64,.43,true], ['Python', 1, .13,-.72,.39],
    ['Statistical Models', 1, .94,-.10,-.55], ['NLP', 1, 1.25,.61,.17],
    ['Visualization', 1, -.91,-.11,-.52], ['Predictive Modeling', 1, .19,1.25,.08],
    ['Visual Attention', 2, -.67,-.24,.51,true], ['Eye Tracking', 2, -1.26,.58,-.56],
    ['EEG / MEG', 2, .62,-.40,.08], ['Brain Decoding', 2, 1.16,.45,.36],
    ['MATLAB', 2, -.62,.92,-.50], ['Experimental Research', 2, .33,.39,-.20]
  ];
  const links = [
    [0,1],[0,2],[0,3],[0,5],[1,3],[1,4],[2,3],[3,4],[3,5],[4,5],
    [6,7],[6,8],[6,9],[6,10],[6,11],[7,8],[7,9],[8,11],[10,11],
    [12,13],[12,14],[12,17],[13,17],[14,15],[14,16],[14,17],[15,16],[16,17],
    [6,15],[7,15],[10,3]
  ];
  const filters = [...map.querySelectorAll('[data-cluster]')];
  const note = map.querySelector('.map-note');
  const homeYaw = -.12, homePitch = .07;
  let yaw = homeYaw, pitch = homePitch, zoom = 1, active = 'all', frame = 0, drag;
  const clamp = (value,min,max) => Math.max(min,Math.min(max,value));

  function draw() {
    frame = 0;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    const dpr = Math.min(devicePixelRatio || 1,2);
    const pixelWidth = Math.round(w*dpr), pixelHeight = Math.round(h*dpr);
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.clearRect(0,0,w,h);
    const narrow = w < 550;
    const rotationX = Math.cos(yaw), rotationZ = Math.sin(yaw);
    const pitchY = Math.cos(pitch), pitchZ = Math.sin(pitch);
    const scaleX = Math.min(w / (narrow ? 4.5 : 9.3), h / (narrow ? 5.6 : 4.45)) * zoom;
    const scaleY = Math.min(w / (narrow ? 3.7 : 7.8), h / (narrow ? 8.3 : 5.15)) * zoom;
    const projected = points.map(([label,cluster,x,y,z,anchor]) => {
      const group = groups[cluster];
      const center = narrow ? group.narrow : group.center;
      x += center[0];
      y += center[1];
      const px = x*rotationX + z*rotationZ;
      const z0 = z*rotationX - x*rotationZ;
      const py = y*pitchY - z0*pitchZ;
      const depth = 13 / (13 - (y*pitchZ + z0*pitchY));
      return { label, cluster, anchor, depth, color:group.color, x:w/2 + px*scaleX*depth, y:h*(narrow ? .5 : .44) + py*scaleY*depth };
    });
    const visible = node => active === 'all' || String(node.cluster) === active;

    for (const [a,b] of links) {
      const from = projected[a], to = projected[b];
      const bridge = from.cluster !== to.cluster;
      ctx.globalAlpha = visible(from) && visible(to) ? (bridge ? .42 : .36) : (visible(from) || visible(to) ? .23 : .075);
      ctx.strokeStyle = bridge ? '#99adc7' : from.color;
      ctx.setLineDash(bridge ? [4,5] : []);
      ctx.beginPath();
      ctx.moveTo(from.x,from.y);
      ctx.lineTo(to.x,to.y);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    const nodesByDepth = [...projected].sort((a,b) => a.depth-b.depth);
    for (const node of nodesByDepth) {
      const radius = (node.anchor ? 6.9 : 4.1) * node.depth;
      ctx.globalAlpha = visible(node) ? .18 : .04;
      ctx.fillStyle = node.color;
      ctx.beginPath();
      ctx.arc(node.x,node.y,radius + 4,0,Math.PI*2);
      ctx.fill();
      ctx.globalAlpha = visible(node) ? .94 : .22;
      ctx.beginPath();
      ctx.arc(node.x,node.y,radius,0,Math.PI*2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    const compactOverview = narrow && w < 380 && active === 'all';
    const labels = projected.filter(node => visible(node) && (!compactOverview || node.anchor || ['TypeScript','Python','Eye Tracking','EEG / MEG'].includes(node.label)));
    labels.sort((a,b) => Number(Boolean(b.anchor)) - Number(Boolean(a.anchor)) || b.depth-a.depth);
    const occupied = projected.map(({x,y,anchor}) => [x-(anchor?8:6),y-(anchor?8:6),x+(anchor?8:6),y+(anchor?8:6)]);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const activeEdges = links.filter(([a,b]) => visible(projected[a]) && visible(projected[b]));
    const placed = [];
    for (const node of labels) {
      if (node.x < 3 || node.x > w-3 || node.y < 3 || node.y > h-3) continue;
      const font = `${node.anchor ? 650 : 500} ${narrow ? 13 : 14}px Inter, system-ui, sans-serif`;
      ctx.font = font;
      const half = ctx.measureText(node.label).width/2 + 5;
      const offsets = [[0,-18],[0,18],[half+10,0],[-half-10,0],[18,-28],[-18,28]];
      let best;
      for (const [dx,dy] of offsets) {
        const x = clamp(node.x + dx,half,w-half), y = node.y + dy;
        const box = [x-half,y-9,x+half,y+9];
        if (y < 10 || y > h-10 || occupied.some(([l,t,r,b]) => box[0] < r && box[2] > l && box[1] < b && box[3] > t)) continue;

        // Prefer a clear area near the node, especially for links between disciplines.
        let score = Math.hypot(x-node.x, y-node.y);
        for (const [a,b] of activeEdges) {
          const from = projected[a], to = projected[b];
          const sx = (from.x-x)/half, sy = (from.y-y)/9;
          const vx = (to.x-from.x)/half, vy = (to.y-from.y)/9;
          const lengthSquared = vx*vx + vy*vy;
          const t = lengthSquared ? clamp(-(sx*vx + sy*vy)/lengthSquared, 0, 1) : 0;
          if (Math.hypot(sx+t*vx, sy+t*vy) < 1.1) {
            score += from.cluster === to.cluster ? 24 : 36;
          }
        }
        if (!best || score < best.score) best = {x,y,box,score};
      }
      if (!best) continue;
      occupied.push(best.box);
      placed.push({ ...best, node, font });
    }
    // Clear a small halo so the map's background, rather than a crossing line, sits behind each label.
    ctx.globalCompositeOperation = 'destination-out';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 5;
    ctx.lineJoin = 'round';
    for (const {x,y,node,font} of placed) {
      ctx.font = font;
      ctx.strokeText(node.label,x,y);
    }
    ctx.globalCompositeOperation = 'source-over';
    for (const {x,y,node,font} of placed) {
      ctx.font = font;
      ctx.fillStyle = node.color;
      ctx.fillText(node.label,x,y);
    }
    ctx.lineWidth = 1;
    ctx.lineJoin = 'miter';
  }

  function invalidate() {
    if (!frame) frame = requestAnimationFrame(draw);
  }
  function rotate(dx,dy) {
    yaw = (yaw + dx) % (Math.PI*2);
    pitch = clamp(pitch + dy,-1,1);
    invalidate();
  }
  for (const button of filters) {
    button.addEventListener('click', () => {
      active = button.dataset.cluster;
      filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      note.textContent = active === 'all' ? '' : (groups[Number(active)].note ?? '');
      invalidate();
    });
  }
  const actions = {
    'rotate-left': () => rotate(-.20,0),
    'rotate-right': () => rotate(.20,0),
    'zoom-out': () => { zoom = clamp(zoom-.12,.72,1.4); },
    'zoom-in': () => { zoom = clamp(zoom+.12,.72,1.4); },
    reset: () => { yaw = homeYaw; pitch = homePitch; zoom = 1; }
  };
  for (const button of map.querySelectorAll('[data-map-action]')) {
    button.addEventListener('click', () => {
      actions[button.dataset.mapAction]();
      invalidate();
    });
  }
  const keys = {
    ArrowLeft: actions['rotate-left'], ArrowRight: actions['rotate-right'],
    ArrowUp: () => rotate(0,-.15), ArrowDown: () => rotate(0,.15),
    '+': actions['zoom-in'], '-': actions['zoom-out'], Home: actions.reset
  };
  canvas.addEventListener('keydown', event => {
    if (!Object.hasOwn(keys,event.key)) return;
    event.preventDefault();
    keys[event.key]();
    invalidate();
  });
  canvas.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
    drag = { id:event.pointerId, x:event.clientX, y:event.clientY, touch:event.pointerType === 'touch', active:false };
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointermove', event => {
    if (drag?.id !== event.pointerId) return;
    const dx = event.clientX-drag.x, dy = event.clientY-drag.y;
    if (drag.touch && !drag.active && (Math.abs(dx) < 7 || Math.abs(dx) <= Math.abs(dy))) return;
    drag.active = true;
    rotate(dx*.008,drag.touch ? 0 : dy*.008);
    drag.x = event.clientX;
    drag.y = event.clientY;
  });
  canvas.addEventListener('lostpointercapture', () => { drag = undefined; });
  new ResizeObserver(invalidate).observe(canvas);
  document.fonts.ready.then(invalidate);
  invalidate();
})();

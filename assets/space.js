// space.js: the deep-space background, the hero meteor and the Meteor Defense mini-game.
// Built with three.js (loaded through the import map in index.html).
// If 3D can't start (old browser, no WebGL), the page simply keeps its CSS gradient and the Play button stays hidden.
//
// Sections: 1 settings · 2 renderer · 3 scenery · 4 meteor · 5 fire particles · 6 layout · 7 HUD reticle
//           8 game · 9 main loop
import * as THREE from 'three';
import { sound } from './sound.js?v=3';

// ---------- 1. Settings (change numbers here, not inside the code) ----------
const CONFIG = {
  stars: 2200,
  particles: 2600,          // shared pool for the meteor trail and explosions
  trailPerSecond: 620,      // sparks per second behind the hero meteor
  phoneWidth: 760,          // same as @media (max-width: 760px) in style.css
  maxPixelRatio: { phone: 1.5, desktop: 2 },
  game: { lives: 3, maxRocks: 12, rampSeconds: 60, firstSpawn: 0.4 }
};
const DIR = new THREE.Vector3(-1, -0.75, 0).normalize(); // the hero meteor falls down-left

const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
let reduceMotion = motionQuery.matches;
motionQuery.addEventListener('change', (e) => { reduceMotion = e.matches; });

// ---------- 2. Renderer (stop here quietly if WebGL is unavailable) ----------
const host = document.getElementById('space');
let renderer = null;
try {
  renderer = new THREE.WebGLRenderer({ antialias: (window.devicePixelRatio || 1) < 2, alpha: true });
} catch (err) {
  console.warn('3D background unavailable, using the plain background instead.', err);
}
if (renderer) startSpace();

function startSpace() {
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 500);
  camera.position.set(0, 0, 10);
  const temp = new THREE.Vector3();   // reused for maths so we don't create garbage every frame

  // ---------- 3. Scenery: stars, nebula, planet, lights ----------
  const dotTexture = makeTexture(64, 64, (g) => {
    const r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    r.addColorStop(0, '#fff'); r.addColorStop(0.25, 'rgba(255,255,255,.8)'); r.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = r; g.fillRect(0, 0, 64, 64);
  });

  const starPositions = new Float32Array(CONFIG.stars * 3);
  const starColors = new Float32Array(CONFIG.stars * 3);
  const palette = [[1, 1, 1], [0.75, 0.82, 1], [1, 0.85, 0.6], [1, 0.6, 0.95]];
  for (let i = 0; i < CONFIG.stars; i++) {
    starPositions[i * 3] = (Math.random() - 0.5) * 90;
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 60;
    starPositions[i * 3 + 2] = -5 - Math.random() * 90;
    starColors.set(palette[Math.random() < 0.8 ? 0 : 1 + Math.floor(Math.random() * 3)], i * 3);
  }
  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
  scene.add(new THREE.Points(starGeometry, new THREE.PointsMaterial({ size: 0.22, map: dotTexture, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })));

  [[0xff2bd6, -22, 9, -70, 60, 0.10], [0x3a4cff, 18, -8, -80, 70, 0.12], [0xffc94a, 30, 14, -90, 40, 0.05]].forEach(([color, x, y, z, size, opacity]) => {
    const cloud = new THREE.Sprite(new THREE.SpriteMaterial({ map: dotTexture, color, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending }));
    cloud.position.set(x, y, z); cloud.scale.set(size, size * 0.6, 1); scene.add(cloud);
  });

  const planet = new THREE.Mesh(new THREE.SphereGeometry(7, 64, 64), new THREE.MeshStandardMaterial({ color: 0x1a1f4a, roughness: 1 }));
  planet.position.z = -45;
  const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(7.6, 64, 64), new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { c: { value: new THREE.Color(0xff2bd6) } },
    vertexShader: 'varying vec3 n;varying vec3 v;void main(){n=normalize(normalMatrix*normal);vec4 mv=modelViewMatrix*vec4(position,1.);v=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}',
    fragmentShader: 'uniform vec3 c;varying vec3 n;varying vec3 v;void main(){float f=pow(1.-max(dot(n,v),0.),2.6);gl_FragColor=vec4(c*f,f);}'
  }));
  planet.add(atmosphere); // the glow now follows the planet automatically
  scene.add(planet);

  scene.add(new THREE.AmbientLight(0x3a4080, 0.9));
  const sun = new THREE.DirectionalLight(0xcfd6ff, 1.6); sun.position.set(-6, 8, 6); scene.add(sun);

  const streakTexture = makeTexture(256, 8, (g) => {
    const r = g.createLinearGradient(0, 0, 256, 0);
    r.addColorStop(0, 'rgba(255,255,255,0)'); r.addColorStop(1, 'rgba(255,255,255,1)');
    g.fillStyle = r; g.fillRect(0, 0, 256, 8);
  });
  const shootingStar = new THREE.Mesh(new THREE.PlaneGeometry(6, 0.05), new THREE.MeshBasicMaterial({ map: streakTexture, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }));
  shootingStar.position.z = -20; scene.add(shootingStar);
  const shootingVelocity = new THREE.Vector3(26, -9, 0);
  let shootingLife = 0, nextShootingStar = 2;

  // ---------- 4. The hero meteor (a bumpy rock with a glow and a warm light) ----------
  const rockGeometry = makeRockGeometry();
  const rockMaterial = new THREE.MeshStandardMaterial({ color: 0x4a3a3a, roughness: 0.95, metalness: 0.05, flatShading: true, emissive: 0x2a0a00 });
  const rock = new THREE.Mesh(rockGeometry, rockMaterial);
  const glowMaterial = new THREE.SpriteMaterial({ map: dotTexture, color: 0xff8a3a, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending });
  const glow = new THREE.Sprite(glowMaterial);
  const heat = new THREE.PointLight(0xff7a2a, 40, 12);
  const meteor = new THREE.Group();
  meteor.add(rock, glow, heat);
  heat.position.copy(DIR).multiplyScalar(1.4);
  glow.position.copy(DIR).multiplyScalar(0.7); glow.scale.set(4.2, 4.2, 1);
  const flyer = new THREE.Group();   // moves the meteor (and its sparks) up as you scroll
  flyer.add(meteor);
  scene.add(flyer);
  const flash = new THREE.PointLight(0xffb060, 0, 14); // explosion flash in the game
  flyer.add(flash);

  // ---------- 5. Fire particles (one shared pool for trails and explosions) ----------
  const fire = makeFireSystem(CONFIG.particles);
  flyer.add(fire.points);

  // ---------- 6. Layout: where things sit for this screen size ----------
  let viewW = 0, viewH = 0, isPhone = false, halfH = 5, halfW = 8, meteorScale = 1;
  const home = new THREE.Vector3();
  function resize() {
    const w = host.clientWidth, h = host.clientHeight;
    const phone = w < CONFIG.phoneWidth;
    // Phones fire "resize" when the address bar slides; ignore small height-only changes so nothing jumps.
    if (w === viewW && (h === viewH || (phone && Math.abs(h - viewH) < 150))) return;
    viewW = w; viewH = h; isPhone = phone;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isPhone ? CONFIG.maxPixelRatio.phone : CONFIG.maxPixelRatio.desktop));
    renderer.setSize(w, h);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    halfW = halfH * camera.aspect;
    home.set(isPhone ? halfW * 0.3 : Math.min(halfW * 0.42, 9), isPhone ? halfH * 0.66 : halfH * 0.12, 0);
    meteorScale = isPhone ? 0.55 : Math.min(1.25, 0.9 + halfW * 0.02);
    meteor.scale.setScalar(meteorScale);
    planet.position.x = isPhone ? -34 : -20;
  }
  resize();
  addEventListener('resize', resize);

  // 3D position → screen pixels
  function toScreen(object) {
    object.getWorldPosition(temp).project(camera);
    return { x: (temp.x + 1) / 2 * viewW, y: (1 - temp.y) / 2 * viewH };
  }
  const pixelsPerUnit = () => viewH / (2 * halfH);

  // ---------- 7. HUD reticle that tracks the meteor (and becomes the crosshair in the game) ----------
  const reticle = document.getElementById('reticle');
  const telemetry = document.getElementById('tele');
  let velocity = 41.7, altitude = 118, telemetryTimer = 0;
  let mouseX = 0, mouseY = 0, pointerX = -999, pointerY = -999;
  addEventListener('pointermove', (e) => {
    mouseX = e.clientX / innerWidth * 2 - 1; mouseY = -(e.clientY / innerHeight * 2 - 1);
    pointerX = e.clientX; pointerY = e.clientY;
  });
  function placeReticle(x, y) { reticle.style.transform = `translate(${x}px, ${y}px)`; }

  // ---------- 8. Meteor Defense mini-game ----------
  const byId = (id) => document.getElementById(id);
  const gameLayer = byId('game');
  const playButton = byId('playBtn');
  const soundButton = byId('gSound');
  const pageParts = ['nav', 'main', 'footer'].map((sel) => document.querySelector(sel)).filter(Boolean);
  const game = { open: false, running: false, score: 0, lives: CONFIG.game.lives, time: 0, spawnIn: 0, rocks: [], best: 0, shake: 0 };
  try { game.best = Number(localStorage.getItem('meteorBest')) || 0; } catch { /* ignore */ }

  const difficulty = () => Math.min(game.time / CONFIG.game.rampSeconds, 1); // 0 → 1 over the first minute
  const pointsFor = (size) => (size < 0.5 ? 30 : size < 0.7 ? 20 : 10);       // smaller = harder = more points

  function updateHud() {
    byId('gScore').textContent = game.score;
    byId('gLives').textContent = '♥'.repeat(game.lives) + '♡'.repeat(CONFIG.game.lives - game.lives);
    byId('gLives').setAttribute('aria-label', `${game.lives} shields left`);
    byId('gBest').textContent = game.best;
  }
  function updateSoundButton() {
    soundButton.textContent = sound.enabled ? '🔊' : '🔇';
    soundButton.setAttribute('aria-pressed', String(sound.enabled));
    soundButton.setAttribute('aria-label', sound.enabled ? 'Sound on' : 'Sound off');
  }
  function removeRock(r) { flyer.remove(r.group); game.rocks.splice(game.rocks.indexOf(r), 1); }
  function clearRocks() { game.rocks.forEach((r) => flyer.remove(r.group)); game.rocks = []; }

  function openGame() {
    if (game.open) return;
    game.open = true;
    sound.unlock();
    document.body.classList.add('playing');
    pageParts.forEach((el) => { el.inert = true; });  // keyboard can't reach the hidden page
    scrollTo({ top: 0, behavior: 'instant' });
    gameLayer.hidden = false;
    byId('gStart').hidden = false; byId('gOver').hidden = true;
    rock.visible = false; glow.visible = false;
    updateHud(); updateSoundButton();
    byId('gGo').focus();
  }
  function closeGame() {
    game.open = false; game.running = false; game.shake = 0; flash.intensity = 0;
    clearRocks();
    sound.music(false);
    document.body.classList.remove('playing');
    pageParts.forEach((el) => { el.inert = false; });
    gameLayer.hidden = true;
    rock.visible = true; glow.visible = true;
    reticle.classList.remove('aim');
    playButton.focus();
  }
  function startRound() {
    clearRocks();
    Object.assign(game, { running: true, score: 0, lives: CONFIG.game.lives, time: 0, spawnIn: CONFIG.game.firstSpawn });
    byId('gStart').hidden = true; byId('gOver').hidden = true;
    updateHud();
    sound.roundStart(); sound.music(true);
  }
  function gameOver() {
    game.running = false;
    if (game.score > game.best) {
      game.best = game.score;
      try { localStorage.setItem('meteorBest', String(game.best)); } catch { /* ignore */ }
    }
    byId('gFinal').textContent = game.score; byId('gFinalBest').textContent = game.best;
    updateHud();
    byId('gOver').hidden = false;
    sound.music(false); sound.gameOver();
    byId('gAgain').focus();
  }

  function spawnRock() {
    const size = 0.32 + Math.random() * 0.6;
    const startY = halfH * 1.2;
    const startX = -halfW * 0.6 + Math.random() * halfW * 1.7;
    const endX = -halfW * 0.85 + Math.random() * halfW * 1.7;   // aim so it lands on screen
    const direction = new THREE.Vector3(endX - startX, -(startY + halfH * 1.1), 0).normalize();
    const body = new THREE.Mesh(rockGeometry, rockMaterial); body.scale.setScalar(size);
    const rockGlow = new THREE.Sprite(glowMaterial);        // shared material: nothing to clean up later
    rockGlow.scale.set(3.4 * size, 3.4 * size, 1);
    rockGlow.position.copy(direction).multiplyScalar(0.6 * size);
    const group = new THREE.Group(); group.add(body, rockGlow);
    group.position.set(startX, startY, 0);
    flyer.add(group);
    game.rocks.push({ group, body, size, direction, speed: 2.4 + Math.random() * 1.3 + difficulty() * 3.2,
      spin: new THREE.Vector3(Math.random(), Math.random(), Math.random()).multiplyScalar(2.5) });
  }

  function popText(x, y, text) {
    const label = document.createElement('span');
    label.className = 'pop'; label.textContent = text;
    label.style.left = `${x}px`; label.style.top = `${y}px`;
    gameLayer.appendChild(label);
    setTimeout(() => label.remove(), 800);
  }

  function shoot(x, y) {
    sound.zap();
    let target = null, bestDistance = Infinity;
    for (const r of game.rocks) {
      const s = toScreen(r.group);
      const radius = 1.25 * r.size * pixelsPerUnit() + 20;   // a little generous so taps feel fair
      const distance = Math.hypot(s.x - x, s.y - y);
      if (distance < radius && distance < bestDistance) { bestDistance = distance; target = { r, s }; }
    }
    if (!target) return;
    const { r, s } = target;
    const points = pointsFor(r.size);
    game.score += points; updateHud(); popText(s.x, s.y, `+${points}`);
    fire.burst(r.group.position, Math.round(110 * r.size + 40), 0.8 + r.size);
    flash.position.copy(r.group.position); flash.intensity = 90;
    if (!reduceMotion) game.shake = 0.25;
    sound.boom(r.size);
    removeRock(r);
  }

  function shieldHit(r) {
    removeRock(r);
    game.lives -= 1; updateHud();
    sound.shieldHit();
    fire.burst(r.group.position, 40, 0.6);
    if (!reduceMotion) { gameLayer.classList.add('hurt'); setTimeout(() => gameLayer.classList.remove('hurt'), 280); }
    if (game.lives <= 0) gameOver();
  }

  function updateGame(dt) {
    if (!game.open) return;
    flash.intensity *= Math.pow(0.02, dt);  // fade the explosion flash
    if (!game.running) return;
    game.time += dt;
    game.spawnIn -= dt;
    if (game.spawnIn <= 0 && game.rocks.length < CONFIG.game.maxRocks) {
      spawnRock();
      game.spawnIn = (1.15 - 0.78 * difficulty()) * (0.7 + Math.random() * 0.6);
    }
    for (let k = game.rocks.length - 1; k >= 0; k--) {
      const r = game.rocks[k];
      r.group.position.addScaledVector(r.direction, r.speed * dt);
      r.body.rotation.x += r.spin.x * dt; r.body.rotation.y += r.spin.y * dt;
      fire.emit(Math.max(1, Math.round(dt * 170 * r.size)), r.group.position, r.direction, r.size);
      if (r.group.position.y < -halfH * 1.08) { shieldHit(r); if (!game.running) break; }
    }
  }

  // Controls
  host.addEventListener('pointerdown', (e) => { if (game.running) { e.preventDefault(); shoot(e.clientX, e.clientY); } });
  addEventListener('click', (e) => {  // clicking the hero meteor itself also starts the game
    if (game.open || scrollY > innerHeight * 0.5 || e.target.closest('a,button,.card,nav,#game,.lb')) return;
    const s = toScreen(meteor);
    if (Math.hypot(s.x - e.clientX, s.y - e.clientY) < 1.4 * meteorScale * pixelsPerUnit() + 24) openGame();
  });
  playButton.addEventListener('click', openGame);
  byId('gGo').addEventListener('click', startRound);
  byId('gAgain').addEventListener('click', startRound);
  ['gQuit', 'gBack', 'gExit'].forEach((id) => byId(id).addEventListener('click', closeGame));
  soundButton.addEventListener('click', () => { sound.unlock(); sound.setEnabled(!sound.enabled); updateSoundButton(); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && game.open) closeGame(); });

  // ---------- 9. Main loop: runs every frame ----------
  const clock = new THREE.Clock();
  let lastSparkTime = 0, frame = 0, pendingTime = 0;
  function loop() {
    requestAnimationFrame(loop);
    pendingTime += clock.getDelta();
    const t = clock.elapsedTime;
    const scrolled = Math.min(scrollY / innerHeight, 3);
    const moving = reduceMotion ? 0 : 1;
    const heroOffScreen = scrolled > 1.3 && !game.open;

    // Past the hero, nothing important moves fast, so draw every other frame to save battery.
    // (Skipped time is carried over, so animations keep their real speed.)
    frame += 1;
    if (heroOffScreen && frame % 2) return;
    const dt = Math.min(pendingTime, 0.05);
    pendingTime = 0;

    // Hero meteor: gentle bob and tumble; the whole group rises as you scroll.
    meteor.position.set(home.x + Math.sin(t * 0.7) * 0.25 * moving, home.y + Math.cos(t * 0.9) * 0.18 * moving, 0);
    flyer.position.y = scrolled * halfH * 1.6;
    planet.position.y = (isPhone ? -16 : -11) + scrolled * 2.2;
    rock.rotation.x += dt * 0.35 * moving; rock.rotation.y += dt * 0.22 * moving;
    glowMaterial.opacity = 0.75 + Math.sin(t * 14) * 0.08 * moving;
    heat.intensity = game.open ? 0 : 36 + Math.sin(t * 11) * 6 * moving;

    if (moving) driftStars(dt);
    if (moving && !game.open && !heroOffScreen) { fire.emit(Math.round(dt * CONFIG.trailPerSecond), meteor.position); lastSparkTime = t; }
    if (game.running) lastSparkTime = t;
    updateGame(dt);
    if (t - lastSparkTime < 2.6) fire.update(dt, meteorScale);   // skip the spark maths once every spark has faded
    updateShootingStar(dt * moving);

    // Camera follows the mouse a little (not during the game, so aiming stays steady).
    const follow = game.open ? 0 : 1;
    camera.position.x += (mouseX * 0.6 * follow - camera.position.x) * Math.min(dt * 2, 1);
    camera.position.y += (mouseY * 0.4 * follow - camera.position.y) * Math.min(dt * 2, 1);
    camera.lookAt(0, 0, 0);
    if (game.shake > 0) { game.shake -= dt; camera.position.x += (Math.random() - 0.5) * 0.25; camera.position.y += (Math.random() - 0.5) * 0.25; }

    renderer.render(scene, camera);
    updateReticle(dt, scrolled, moving);
  }

  function driftStars(dt) {
    const a = starGeometry.attributes.position.array;
    for (let i = 0; i < CONFIG.stars; i++) {
      const depth = 1 + (a[i * 3 + 2] + 95) / 30;   // nearer stars move faster
      a[i * 3] -= DIR.x * dt * depth * 0.9;
      a[i * 3 + 1] -= DIR.y * dt * depth * 0.9;
      if (a[i * 3] > 45) a[i * 3] -= 90;
      if (a[i * 3 + 1] > 30) a[i * 3 + 1] -= 60;
    }
    starGeometry.attributes.position.needsUpdate = true;
  }

  function updateShootingStar(dt) {
    nextShootingStar -= dt;
    if (nextShootingStar <= 0) {
      shootingLife = 1; nextShootingStar = 4 + Math.random() * 5;
      shootingStar.position.set(-30 + Math.random() * 30, 8 + Math.random() * 10, -20);
      shootingStar.rotation.z = Math.atan2(shootingVelocity.y, shootingVelocity.x);
    }
    if (shootingLife > 0) {
      shootingLife -= dt * 1.4;
      shootingStar.position.addScaledVector(shootingVelocity, dt);
      shootingStar.material.opacity = Math.max(shootingLife, 0);
    }
  }

  function updateReticle(dt, scrolled, moving) {
    if (game.open) {
      reticle.classList.add('on', 'aim');
      placeReticle(pointerX, pointerY);
      return;
    }
    reticle.classList.remove('aim');
    reticle.classList.toggle('on', scrolled < 0.55);
    if (scrolled >= 0.55) return;
    const s = toScreen(meteor);
    placeReticle(s.x, s.y);
    telemetryTimer += dt;
    if (telemetryTimer > 0.25) {
      telemetryTimer = 0;
      velocity = Math.min(Math.max(velocity + (Math.random() - 0.5) * 0.6, 38), 46);
      altitude -= 0.9 * moving; if (altitude < 60) altitude = 118;
      telemetry.innerHTML = `TRACKING <em>OBJ SD-26</em><br>v <em>${velocity.toFixed(1)} km/s</em><br>ALT <em>${altitude.toFixed(0)} km</em><br>MAG <em>−4.${Math.floor(Math.random() * 9)}</em><br><span class="play">▶ click it to play</span>`;
    }
  }

  loop();
  playButton.hidden = false; // only show Play once 3D is running
}

// ---------- helpers that don't need the scene ----------
function makeTexture(w, h, draw) {
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  draw(canvas.getContext('2d'));
  return new THREE.CanvasTexture(canvas);
}

// A sphere pushed in and out with sine "noise" plus a few craters, so it looks like a rock.
function makeRockGeometry() {
  const geometry = new THREE.IcosahedronGeometry(1, 5);
  const positions = geometry.attributes.position;
  const v = new THREE.Vector3();
  const craters = Array.from({ length: 7 }, () => new THREE.Vector3().randomDirection());
  for (let i = 0; i < positions.count; i++) {
    v.fromBufferAttribute(positions, i).normalize();
    let bump = 0.18 * Math.sin(3.1 * v.x + 1.7) * Math.sin(2.3 * v.y + 0.4) * Math.sin(2.9 * v.z + 2.1)
             + 0.08 * Math.sin(7.3 * v.x) * Math.sin(6.1 * v.y + 1) * Math.sin(5.7 * v.z + 0.5);
    craters.forEach((c) => { const d = v.distanceTo(c); if (d < 0.35) bump -= 0.09 * (1 - d / 0.35); });
    v.multiplyScalar(1 + bump); v.x *= 1.15;
    positions.setXYZ(i, v.x, v.y, v.z);
  }
  geometry.computeVertexNormals();
  return geometry;
}

// Sparks: white-hot → orange → magenta → fade. Used for trails (emit) and explosions (burst).
function makeFireSystem(count) {
  const pos = new Float32Array(count * 3), vel = new Float32Array(count * 3), life = new Float32Array(count),
    maxLife = new Float32Array(count), size = new Float32Array(count), alpha = new Float32Array(count), color = new Float32Array(count * 3);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
  geometry.setAttribute('aAlpha', new THREE.BufferAttribute(alpha, 1));
  geometry.setAttribute('aColor', new THREE.BufferAttribute(color, 3));
  const pointRatio = Math.min(window.devicePixelRatio || 1, 2);
  const points = new THREE.Points(geometry, new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { ratio: { value: pointRatio } },
    vertexShader: 'uniform float ratio;attribute float aSize;attribute float aAlpha;attribute vec3 aColor;varying float a;varying vec3 col;void main(){a=aAlpha;col=aColor;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=aSize*ratio*(260./-mv.z);gl_Position=projectionMatrix*mv;}',
    fragmentShader: 'varying float a;varying vec3 col;void main(){float d=length(gl_PointCoord-.5);float k=smoothstep(.5,.0,d)*a;gl_FragColor=vec4(col*k,k);}'
  }));
  points.frustumCulled = false;
  const hot = new THREE.Color(0xfff2c0), orange = new THREE.Color(0xff7a2a), magenta = new THREE.Color(0xff2bd6), dusk = new THREE.Color(0x3a2a90), c = new THREE.Color();
  const r = new THREE.Vector3();
  let next = 0;
  const take = () => { const i = next; next = (next + 1) % count; return i; };

  return {
    points,
    emit(n, origin, direction = DIR, scale = 1) {
      for (let k = 0; k < n; k++) {
        const i = take();
        r.randomDirection().multiplyScalar(0.55 * scale);
        pos[i * 3] = origin.x + r.x - direction.x * 0.4 * scale;
        pos[i * 3 + 1] = origin.y + r.y - direction.y * 0.4 * scale;
        pos[i * 3 + 2] = origin.z + r.z;
        const speed = 2.2 + Math.random() * 3.2;
        vel[i * 3] = -direction.x * speed + (Math.random() - 0.5) * 0.6;
        vel[i * 3 + 1] = -direction.y * speed + (Math.random() - 0.5) * 0.6;
        vel[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
        maxLife[i] = life[i] = 1.1 + Math.random() * 1.3;
      }
    },
    burst(origin, n, power) {
      for (let k = 0; k < n; k++) {
        const i = take();
        r.randomDirection();
        const speed = (1.5 + Math.random() * 5.5) * power;
        pos[i * 3] = origin.x + r.x * 0.2; pos[i * 3 + 1] = origin.y + r.y * 0.2; pos[i * 3 + 2] = origin.z + r.z * 0.2;
        vel[i * 3] = r.x * speed; vel[i * 3 + 1] = r.y * speed; vel[i * 3 + 2] = r.z * speed;
        maxLife[i] = life[i] = 0.45 + Math.random() * 0.7;
      }
    },
    update(dt, scale) {
      for (let i = 0; i < count; i++) {
        if (life[i] <= 0) { alpha[i] = 0; continue; }
        life[i] -= dt;
        const age = 1 - life[i] / maxLife[i];   // 0 = just born, 1 = gone
        pos[i * 3] += vel[i * 3] * dt; pos[i * 3 + 1] += vel[i * 3 + 1] * dt; pos[i * 3 + 2] += vel[i * 3 + 2] * dt;
        if (age < 0.25) c.copy(hot).lerp(orange, age / 0.25);
        else if (age < 0.6) c.copy(orange).lerp(magenta, (age - 0.25) / 0.35);
        else c.copy(magenta).lerp(dusk, (age - 0.6) / 0.4);
        color[i * 3] = c.r; color[i * 3 + 1] = c.g; color[i * 3 + 2] = c.b;
        size[i] = (1.2 + age * 5) * scale;
        alpha[i] = (1 - age) * (age < 0.08 ? age / 0.08 : 1) * 0.9;
      }
      ['position', 'aSize', 'aAlpha', 'aColor'].forEach((name) => { geometry.attributes[name].needsUpdate = true; });
    }
  };
}

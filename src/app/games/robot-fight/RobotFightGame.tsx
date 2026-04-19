'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// ============ CONSTANTS ============
const W = 800;
const H = 450;
const GROUND = 345;
const GRAVITY = 0.55;
const JUMP_V = -13;
const SPEED = 4.5;
const ROUND_TIME = 99;
const ROUNDS_TO_WIN = 2;

const PUNCH_FRAMES = 28;
const KICK_FRAMES = 36;
const SPECIAL_FRAMES = 65;
const HURT_FRAMES = 22;

const PUNCH_HIT_S = 8;
const PUNCH_HIT_E = 14;
const KICK_HIT_S = 12;
const KICK_HIT_E = 20;
const SPECIAL_HIT_S = 18;
const SPECIAL_HIT_E = 32;

const PUNCH_REACH = 90;
const KICK_REACH = 110;
const SPECIAL_REACH = 170;

// ============ TYPES ============
type CharId = 'jasper' | 'julien' | 'mommy' | 'daddy';
type AnimId = 'idle' | 'walk' | 'punch' | 'kick' | 'jump' | 'special' | 'hurt' | 'dead';
type Phase = 'select' | 'countdown' | 'fight' | 'round_end' | 'game_over';

interface Fighter {
  id: CharId;
  x: number;
  y: number;
  vx: number;
  vy: number;
  hp: number;
  maxHp: number;
  facing: 1 | -1;
  anim: AnimId;
  animFrame: number;
  actionTimer: number;
  onGround: boolean;
  specialCooldown: number;
  hitRegistered: boolean;
}

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  color: string; size: number;
}

interface GS {
  phase: Phase;
  player: Fighter;
  ai: Fighter;
  timer: number;
  timerMs: number;
  playerWins: number;
  aiWins: number;
  roundEndTimer: number;
  roundMsg: string;
  countdownTimer: number;
  particles: Particle[];
  shake: number;
  selectedChar: CharId | null;
}

interface AIState {
  thinkTimer: number;
  action: 'approach' | 'attack' | 'idle' | 'jump';
  attackType: 'punch' | 'kick' | 'special';
}

// ============ CHARACTER CONFIG ============
const COLORS: Record<CharId, { p: string; s: string; g: string; e: string }> = {
  jasper: { p: '#2266dd', s: '#77aaff', g: '#aaddff', e: '#00eeff' },
  julien: { p: '#228833', s: '#55cc66', g: '#99ffaa', e: '#ffee00' },
  mommy:  { p: '#bb2288', s: '#ff77cc', g: '#ffbbee', e: '#ff3333' },
  daddy:  { p: '#aa1111', s: '#ff4422', g: '#ff8844', e: '#ffaa00' },
};

const CNAMES: Record<CharId, string> = {
  jasper: 'JASPER', julien: 'JULIEN', mommy: 'MOMMY', daddy: 'DADDY',
};

const STATS: Record<CharId, { hp: number; pDmg: number; kDmg: number; sDmg: number; sHeal: number; sCd: number }> = {
  jasper: { hp: 100, pDmg: 8,  kDmg: 13, sDmg: 0,  sHeal: 28, sCd: 480 },
  julien: { hp: 90,  pDmg: 7,  kDmg: 15, sDmg: 22, sHeal: 0,  sCd: 540 },
  mommy:  { hp: 120, pDmg: 10, kDmg: 16, sDmg: 30, sHeal: 0,  sCd: 480 },
  daddy:  { hp: 105, pDmg: 9,  kDmg: 14, sDmg: 22, sHeal: 0,  sCd: 540 },
};

const SPECIAL_NAMES: Record<CharId, string> = {
  jasper: 'CANDY BOOST!',
  julien: 'DANCE SLAM!',
  mommy:  'WAR CRY!',
  daddy:  'POWER SURGE!',
};

const CHAR_DESC: Record<CharId, string[]> = {
  jasper: ['Balanced fighter', 'Heals 28 HP with special'],
  julien: ['Fast & agile', 'Ground-shaking dance attack'],
  mommy:  ['Tough & powerful', 'Sonic scream blast'],
  daddy:  ['???', '???'],
};

// ============ HELPERS ============
function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function createFighter(id: CharId, x: number, facing: 1 | -1): Fighter {
  return {
    id, x, y: GROUND, vx: 0, vy: 0,
    hp: STATS[id].hp, maxHp: STATS[id].hp,
    facing, anim: 'idle', animFrame: 0, actionTimer: 0,
    onGround: true, specialCooldown: 0, hitRegistered: false,
  };
}

// ============ DRAWING ============
function drawBg(ctx: CanvasRenderingContext2D) {
  // Sky
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#08051a');
  sky.addColorStop(0.65, '#1a0a33');
  sky.addColorStop(1, '#2a1022');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // City silhouette
  ctx.fillStyle = '#0c0518';
  const blds = [
    [0,235,55],[55,210,40],[95,248,35],[130,198,60],[190,225,50],[240,242,38],
    [278,212,55],[333,228,45],[378,203,65],[443,238,40],[483,218,52],[535,243,37],
    [572,208,60],[632,224,50],[682,244,42],[724,208,65],
  ] as [number,number,number][];
  for (const [bx, by, bw] of blds) {
    ctx.fillStyle = '#0c0518';
    ctx.fillRect(bx, by, bw, GROUND - by);
    ctx.fillStyle = 'rgba(255,200,50,0.1)';
    for (let wx = bx + 5; wx < bx + bw - 8; wx += 10) {
      for (let wy = by + 8; wy < GROUND - 10; wy += 13) {
        if (Math.random() > 0.5) ctx.fillRect(wx, wy, 4, 6);
      }
    }
  }

  // Floor
  const floor = ctx.createLinearGradient(0, GROUND, 0, H);
  floor.addColorStop(0, '#1e0a32');
  floor.addColorStop(1, '#12061e');
  ctx.fillStyle = floor;
  ctx.fillRect(0, GROUND, W, H - GROUND);

  // Grid perspective
  ctx.strokeStyle = 'rgba(160,50,220,0.22)';
  ctx.lineWidth = 1;
  for (let gx = 0; gx <= W; gx += 40) {
    ctx.beginPath();
    ctx.moveTo(gx, GROUND);
    ctx.lineTo(W / 2 + (gx - W / 2) * 1.5, H + 100);
    ctx.stroke();
  }
  for (let gy = 0; gy <= 5; gy++) {
    const fy = GROUND + (H - GROUND) * (gy / 5);
    ctx.beginPath(); ctx.moveTo(0, fy); ctx.lineTo(W, fy); ctx.stroke();
  }

  // Neon ground line
  ctx.shadowColor = '#bb44ff'; ctx.shadowBlur = 14;
  ctx.strokeStyle = '#cc55ff'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(0, GROUND); ctx.lineTo(W, GROUND); ctx.stroke();
  ctx.shadowBlur = 0;
}

function drawRobot(ctx: CanvasRenderingContext2D, f: Fighter) {
  const { x, y, facing, anim, animFrame, actionTimer, id } = f;
  const c = COLORS[id];
  const fd = facing; // 1 = right, -1 = left — used as a multiplier for direction-dependent offsets
  const isDead = anim === 'dead';
  const isHurt = anim === 'hurt';

  ctx.save();
  ctx.translate(x, y);
  // No ctx.scale(-1,1) — all directional offsets use fd explicitly so rotations are unambiguous.

  if (isHurt && Math.floor(animFrame / 3) % 2 === 0) ctx.globalAlpha = 0.3;

  // Shadow
  if (!isDead) {
    const prevAlpha = ctx.globalAlpha;
    ctx.globalAlpha = prevAlpha * 0.4;
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.ellipse(0, 4, 26, 7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = prevAlpha;
  }

  // Pose angles — "forward" means toward the facing direction.
  // torsoRot > 0  = torso leans forward (in facing direction).
  // fA > 0        = forward arm rotates forward (punches in facing dir).
  // fL > 0        = forward leg kicks forward.
  let torsoY = 0;
  let torsoRot = 0;
  let headBob = 0;
  let fA = 0;  // forward arm rotation (degrees, + = punches forward)
  let bA = 0;  // back arm rotation
  let fL = 0;  // forward leg rotation (degrees, + = kicks forward)
  let bL = 0;  // back leg rotation
  let bSq = 1;

  if (isDead) {
    ctx.translate(fd * 15, 25);
    ctx.rotate(fd * 1.4);
  } else if (anim === 'idle') {
    headBob = Math.sin(animFrame * 0.07) * 2;
    torsoY  = Math.sin(animFrame * 0.07) * 1.5;
    fA = Math.sin(animFrame * 0.07) * 4;
    bA = -Math.sin(animFrame * 0.07) * 4;
  } else if (anim === 'walk') {
    headBob = Math.abs(Math.sin(animFrame * 0.14)) * -3;
    torsoY  = headBob * 0.5;
    fL =  Math.sin(animFrame * 0.14) * 32;  // forward leg swings ahead
    bL = -Math.sin(animFrame * 0.14) * 32;  // back leg swings behind
    fA = -Math.sin(animFrame * 0.14) * 22;  // forward arm swings back (opposite leg)
    bA =  Math.sin(animFrame * 0.14) * 22;
  } else if (anim === 'punch') {
    const progress = 1 - actionTimer / PUNCH_FRAMES; // 0→1 as anim plays
    const ext = Math.sin(progress * Math.PI);        // 0→peak→0
    fA = ext * 90;       // forward arm swings forward
    torsoRot = ext * 14; // torso leans forward
  } else if (anim === 'kick') {
    const progress = 1 - actionTimer / KICK_FRAMES;
    const ext = Math.sin(progress * Math.PI);
    fL = ext * 80;        // forward leg kicks ahead
    bL = ext * -10;
    torsoRot = -ext * 10; // torso leans back for balance
    bA = ext * -12;
  } else if (anim === 'special') {
    const p = 1 - actionTimer / SPECIAL_FRAMES;
    torsoRot = Math.sin(p * Math.PI * 6) * 16;
    fA =  Math.sin(p * Math.PI * 3) * 55;
    bA = -Math.sin(p * Math.PI * 3) * 55;
    headBob = Math.sin(p * Math.PI * 4) * 5;
  } else if (anim === 'hurt') {
    torsoRot = -15; // lean backward
    fA = -25;
    bA = -25;
    headBob = -6;
  } else if (anim === 'jump') {
    fL = -28; bL = 28; fA = -35; bA = 35; torsoY = -4; bSq = 0.9;
  }

  const drawFill = (col: string, stroke: string, fn: () => void) => {
    ctx.fillStyle = col; ctx.strokeStyle = stroke; ctx.lineWidth = 1.5;
    fn(); ctx.fill(); ctx.stroke();
  };

  const D = Math.PI / 180;

  if (!isDead) {
    // Canvas CW rotation moves a downward-hanging limb to the LEFT.
    // So to swing a limb in the facing direction (fd=+1 = right), we need CCW = negative angle.
    // Formula: ctx.rotate(-fd * angle * D) makes fL>0 always kick *forward* in screen space.
    ctx.save(); ctx.translate(fd * 10, 44 + torsoY); ctx.rotate(-fd * fL * D);
    drawFill(c.p, c.s, () => rr(ctx, -7, 0, 14, 30, 4));
    ctx.fillStyle = c.s; rr(ctx, -9, 27, 18, 9, 3); ctx.fill();
    ctx.restore();
    // Back leg
    ctx.save(); ctx.translate(fd * -10, 44 + torsoY); ctx.rotate(-fd * bL * D);
    drawFill(c.p, c.s, () => rr(ctx, -7, 0, 14, 30, 4));
    ctx.fillStyle = c.s; rr(ctx, -9, 27, 18, 9, 3); ctx.fill();
    ctx.restore();
  }

  // Torso leans from its TOP — CW rotation moves the top RIGHT, so fd*torsoRot is correct (no negation).
  ctx.save(); ctx.translate(0, torsoY); ctx.rotate(fd * torsoRot * D); ctx.scale(1, bSq);

  drawFill(c.p, c.s, () => rr(ctx, -18, -16, 36, 56, 6));
  ctx.fillStyle = c.s; rr(ctx, -11, -6, 22, 20, 4); ctx.fill();

  // Reactor core
  ctx.fillStyle = c.g; ctx.shadowColor = c.g; ctx.shadowBlur = 14;
  ctx.beginPath(); ctx.arc(0, 3, 7, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 3, 3, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;

  // Back arm
  ctx.save(); ctx.translate(fd * -18, -4); ctx.rotate(-fd * bA * D);
  drawFill(c.p, c.s, () => rr(ctx, -6, -4, 12, 26, 4));
  ctx.fillStyle = c.s; ctx.beginPath(); ctx.arc(0, 23, 7, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  // Forward arm — fA>0 swings the arm toward the opponent (in the facing direction)
  ctx.save(); ctx.translate(fd * 18, -4); ctx.rotate(-fd * fA * D);
  drawFill(c.p, c.s, () => rr(ctx, -6, -4, 12, 26, 4));
  ctx.fillStyle = c.s; ctx.beginPath(); ctx.arc(0, 23, 7, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  // Head (symmetric, no facing-dependent transforms needed)
  ctx.save(); ctx.translate(0, headBob - 30);
  drawFill(c.p, c.s, () => rr(ctx, -15, -16, 30, 30, 7));
  ctx.fillStyle = 'rgba(0,0,0,0.65)'; rr(ctx, -11, -11, 22, 10, 3); ctx.fill();
  // Eyes
  ctx.fillStyle = c.e; ctx.shadowColor = c.e; ctx.shadowBlur = 9;
  ctx.beginPath(); ctx.arc(-5, -6, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(5, -6, 3, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
  // Antenna
  ctx.strokeStyle = c.s; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, -16); ctx.lineTo(0, -26); ctx.stroke();
  ctx.fillStyle = c.g; ctx.shadowColor = c.g; ctx.shadowBlur = 7;
  ctx.beginPath(); ctx.arc(0, -29, 4, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = c.s;
  for (let mx = -4; mx <= 4; mx += 3) ctx.fillRect(mx - 0.5, 4, 2, 5);
  ctx.restore(); // head

  ctx.restore(); // torso

  if (anim === 'special') {
    const p = 1 - actionTimer / SPECIAL_FRAMES;
    ctx.globalAlpha = Math.sin(p * Math.PI) * 0.45;
    ctx.fillStyle = c.g; ctx.shadowColor = c.g; ctx.shadowBlur = 45;
    ctx.beginPath(); ctx.arc(0, -10 + torsoY, 55, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }

  ctx.restore(); // main
}

function drawHealthBar(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number,
  hp: number, maxHp: number,
  name: string, isPlayer: boolean,
  charId: CharId, sCd: number, sMaxCd: number,
) {
  const pct = Math.max(0, hp / maxHp);
  const c = COLORS[charId];

  // BG
  ctx.fillStyle = 'rgba(0,0,0,0.55)'; rr(ctx, x, y, w, 20, 4); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 1; rr(ctx, x, y, w, 20, 4); ctx.stroke();

  // HP fill
  const bw = Math.floor((w - 4) * pct);
  if (bw > 0) {
    const col = pct > 0.5 ? '#33ee33' : pct > 0.25 ? '#eeee22' : '#ee2222';
    ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 5;
    rr(ctx, x + 2, y + 2, bw, 16, 3); ctx.fill();
    ctx.shadowBlur = 0;
  }

  // Name drawn inside the bar so it's never clipped by canvas edge
  ctx.font = 'bold 13px "Courier New", monospace';
  ctx.textAlign = isPlayer ? 'left' : 'right';
  ctx.fillStyle = '#fff'; ctx.shadowColor = '#000'; ctx.shadowBlur = 4;
  ctx.fillText(name, isPlayer ? x + 6 : x + w - 6, y + 14);
  ctx.shadowBlur = 0;

  // Special cooldown bar (sits just below the HP bar)
  const sy = y + 24;
  ctx.fillStyle = 'rgba(0,0,0,0.45)'; rr(ctx, x, sy, w, 5, 2); ctx.fill();
  const sp = 1 - Math.max(0, sCd) / sMaxCd;
  if (sp > 0) {
    ctx.fillStyle = c.g; ctx.shadowColor = c.g; ctx.shadowBlur = 5;
    rr(ctx, x + 1, sy + 1, Math.floor((w - 2) * sp), 3, 1); ctx.fill();
    ctx.shadowBlur = 0;
  }
  ctx.textAlign = 'left';
}

function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  for (const p of particles) {
    ctx.globalAlpha = p.life / p.maxLife;
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 7;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * (p.life / p.maxLife), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
}

// ============ PARTICLES ============
function spawnHit(particles: Particle[], x: number, y: number, color: string, n = 14) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const sp = 2 + Math.random() * 5;
    particles.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 2,
      life: 18 + Math.random() * 18, maxLife: 36, color, size: 2 + Math.random() * 4 });
  }
}
function spawnSpecial(particles: Particle[], x: number, y: number, color: string) {
  for (let i = 0; i < 32; i++) {
    const a = Math.random() * Math.PI * 2;
    const sp = 1 + Math.random() * 8;
    particles.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 3,
      life: 28 + Math.random() * 28, maxLife: 56, color, size: 3 + Math.random() * 6 });
  }
}
function updateParticles(particles: Particle[]) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx; p.y += p.vy; p.vy += 0.2; p.vx *= 0.93; p.life--;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

// ============ PHYSICS & COMBAT ============
function applyPhysics(f: Fighter) {
  if (!f.onGround) f.vy += GRAVITY;
  f.x += f.vx; f.y += f.vy;
  f.vx *= 0.82;
  if (f.y >= GROUND) {
    f.y = GROUND; f.vy = 0; f.onGround = true;
    if (f.anim === 'jump') { f.anim = 'idle'; f.actionTimer = 0; }
  }
  f.x = Math.max(45, Math.min(W - 45, f.x));
}

function checkHit(atk: Fighter, def: Fighter, dmg: number, reach: number, particles: Particle[]): number {
  if (atk.hitRegistered || def.anim === 'dead') return 0;
  const dx = atk.facing === 1 ? def.x - atk.x : atk.x - def.x;
  if (dx > 0 && dx < reach && Math.abs(def.y - atk.y) < 80) {
    atk.hitRegistered = true;
    spawnHit(particles, (atk.x + def.x) / 2, atk.y - 50, COLORS[atk.id].g);
    return dmg;
  }
  return 0;
}

function applyDamage(def: Fighter, dmg: number) {
  if (dmg <= 0 || def.anim === 'dead') return;
  def.hp = Math.max(0, def.hp - dmg);
  if (def.hp <= 0) {
    def.anim = 'dead'; def.actionTimer = 0; def.vx = 0; def.vy = 0;
  } else if (def.anim !== 'jump') {
    def.anim = 'hurt'; def.actionTimer = HURT_FRAMES; def.animFrame = 0;
    def.vx = def.x < 400 ? -3 : 3;
  }
}

// ============ PLAYER UPDATE ============
function doPlayerAttack(gs: GS, anim: AnimId, timer: number) {
  gs.player.anim = anim;
  gs.player.actionTimer = timer;
  gs.player.animFrame = 0;
  gs.player.hitRegistered = false;
  if (anim === 'special') gs.player.specialCooldown = STATS[gs.player.id].sCd;
}

function updatePlayer(
  gs: GS,
  left: boolean, right: boolean, punch: boolean, kick: boolean,
  jump: boolean, special: boolean,
) {
  const p = gs.player;
  if (p.anim === 'dead') { p.animFrame++; return; }
  const st = STATS[p.id];
  const inAction = p.anim === 'punch' || p.anim === 'kick' || p.anim === 'special' || p.anim === 'hurt';

  if (p.actionTimer > 0) {
    p.actionTimer--;
    const atF = (p.anim === 'punch' ? PUNCH_FRAMES : p.anim === 'kick' ? KICK_FRAMES : SPECIAL_FRAMES) - p.actionTimer;

    if (p.anim === 'punch' && atF >= PUNCH_HIT_S && atF <= PUNCH_HIT_E) {
      const d = checkHit(p, gs.ai, st.pDmg, PUNCH_REACH, gs.particles);
      if (d) { applyDamage(gs.ai, d); gs.shake = Math.max(gs.shake, 5); }
    } else if (p.anim === 'kick' && atF >= KICK_HIT_S && atF <= KICK_HIT_E) {
      const d = checkHit(p, gs.ai, st.kDmg, KICK_REACH, gs.particles);
      if (d) { applyDamage(gs.ai, d); gs.shake = Math.max(gs.shake, 6); }
    } else if (p.anim === 'special' && atF >= SPECIAL_HIT_S && atF <= SPECIAL_HIT_E) {
      if (st.sDmg > 0) {
        const d = checkHit(p, gs.ai, st.sDmg, SPECIAL_REACH, gs.particles);
        if (d) {
          applyDamage(gs.ai, d); gs.shake = Math.max(gs.shake, 9);
          spawnSpecial(gs.particles, (p.x + gs.ai.x) / 2, p.y - 60, COLORS[p.id].g);
        }
      } else if (st.sHeal > 0 && !p.hitRegistered) {
        p.hitRegistered = true;
        p.hp = Math.min(p.maxHp, p.hp + st.sHeal);
        spawnSpecial(gs.particles, p.x, p.y - 60, '#55ffaa');
      }
    }

    if (p.actionTimer <= 0) {
      p.anim = p.onGround ? 'idle' : 'jump';
      p.hitRegistered = false;
    }
  } else if (!inAction) {
    const faceOpponent = () => { p.facing = gs.ai.x > p.x ? 1 : -1; };
    if (special && p.specialCooldown <= 0 && p.onGround) { faceOpponent(); doPlayerAttack(gs, 'special', SPECIAL_FRAMES); }
    else if (punch && !kick) { faceOpponent(); doPlayerAttack(gs, 'punch', PUNCH_FRAMES); }
    else if (kick) { faceOpponent(); doPlayerAttack(gs, 'kick', KICK_FRAMES); }
    else if (jump && p.onGround) {
      p.vy = JUMP_V;
      p.onGround = false;
      p.anim = 'jump';
      if (left)  { p.vx = -SPEED; p.facing = -1; }
      if (right) { p.vx =  SPEED; p.facing =  1; }
    }
    else if (left && p.onGround) { p.vx = -SPEED; p.anim = 'walk'; p.facing = -1; }
    else if (right && p.onGround) { p.vx = SPEED; p.anim = 'walk'; p.facing = 1; }
    else if (p.onGround) p.anim = 'idle';
  }

  if (!inAction && !left && !right) p.facing = gs.ai.x > p.x ? 1 : -1;
  if (p.specialCooldown > 0) p.specialCooldown--;
  p.animFrame++;
}

// ============ AI UPDATE ============
function updateAI(gs: GS, aiSt: AIState) {
  const ai = gs.ai;
  if (ai.anim === 'dead') { ai.animFrame++; return; }
  const st = STATS[ai.id];
  const dist = Math.abs(ai.x - gs.player.x);
  const inAction = ai.anim === 'punch' || ai.anim === 'kick' || ai.anim === 'special' || ai.anim === 'hurt';

  if (ai.actionTimer > 0) {
    ai.actionTimer--;
    const atF = (ai.anim === 'punch' ? PUNCH_FRAMES : ai.anim === 'kick' ? KICK_FRAMES : SPECIAL_FRAMES) - ai.actionTimer;

    if (ai.anim === 'punch' && atF >= PUNCH_HIT_S && atF <= PUNCH_HIT_E) {
      const d = checkHit(ai, gs.player, st.pDmg, PUNCH_REACH, gs.particles);
      if (d) { applyDamage(gs.player, d); gs.shake = Math.max(gs.shake, 5); }
    } else if (ai.anim === 'kick' && atF >= KICK_HIT_S && atF <= KICK_HIT_E) {
      const d = checkHit(ai, gs.player, st.kDmg, KICK_REACH, gs.particles);
      if (d) { applyDamage(gs.player, d); gs.shake = Math.max(gs.shake, 6); }
    } else if (ai.anim === 'special' && atF >= SPECIAL_HIT_S && atF <= SPECIAL_HIT_E) {
      const d = checkHit(ai, gs.player, st.sDmg, SPECIAL_REACH, gs.particles);
      if (d) {
        applyDamage(gs.player, d); gs.shake = Math.max(gs.shake, 9);
        spawnSpecial(gs.particles, (ai.x + gs.player.x) / 2, ai.y - 60, COLORS[ai.id].g);
      }
    }

    if (ai.actionTimer <= 0) {
      ai.anim = ai.onGround ? 'idle' : 'jump';
      ai.hitRegistered = false;
    }
    ai.animFrame++;
    return;
  }

  // AI thinking
  aiSt.thinkTimer--;
  if (aiSt.thinkTimer <= 0) {
    aiSt.thinkTimer = 14 + Math.floor(Math.random() * 22);
    if (ai.specialCooldown <= 0 && ai.hp < ai.maxHp * 0.35 && dist < SPECIAL_REACH) {
      aiSt.action = 'attack'; aiSt.attackType = 'special';
    } else if (dist < 88) {
      aiSt.action = 'attack';
      const r = Math.random();
      aiSt.attackType = r < 0.42 ? 'punch' : r < 0.82 ? 'kick' : 'special';
    } else if (dist < 190) {
      aiSt.action = Math.random() < 0.65 ? 'approach' : 'attack';
      aiSt.attackType = Math.random() < 0.5 ? 'kick' : 'punch';
    } else {
      aiSt.action = 'approach';
    }
    if (Math.random() < 0.07 && ai.onGround) aiSt.action = 'jump';
  }

  ai.facing = gs.player.x > ai.x ? 1 : -1;

  if (aiSt.action === 'approach' && !inAction) {
    ai.vx = (gs.player.x > ai.x ? 1 : -1) * (SPEED - 0.6);
    ai.anim = 'walk';
  } else if (aiSt.action === 'attack' && !inAction) {
    if (aiSt.attackType === 'special' && ai.specialCooldown <= 0 && dist < SPECIAL_REACH) {
      ai.anim = 'special'; ai.actionTimer = SPECIAL_FRAMES; ai.hitRegistered = false;
      ai.specialCooldown = st.sCd;
    } else if (aiSt.attackType === 'punch' && dist < PUNCH_REACH + 15) {
      ai.anim = 'punch'; ai.actionTimer = PUNCH_FRAMES; ai.hitRegistered = false;
    } else if (aiSt.attackType === 'kick' && dist < KICK_REACH + 15) {
      ai.anim = 'kick'; ai.actionTimer = KICK_FRAMES; ai.hitRegistered = false;
    } else {
      ai.vx = (gs.player.x > ai.x ? 1 : -1) * (SPEED - 0.6);
      ai.anim = 'walk';
    }
  } else if (aiSt.action === 'jump' && ai.onGround) {
    ai.vy = JUMP_V; ai.onGround = false; ai.anim = 'jump';
  } else if (!inAction && ai.onGround) {
    ai.anim = 'idle';
  }

  if (ai.specialCooldown > 0) ai.specialCooldown--;
  ai.animFrame++;
}

// ============ MAIN COMPONENT ============
export default function RobotFightGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gsRef = useRef<GS | null>(null);
  const aiRef = useRef<AIState>({ thinkTimer: 30, action: 'idle', attackType: 'punch' });
  const keysRef = useRef<Record<string, boolean>>({});
  const rafRef = useRef<number>(0);
  const [uiPhase, setUiPhase] = useState<Phase>('select');
  const prevPhaseRef = useRef<Phase>('select');

  const press = useCallback((code: string) => (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    keysRef.current[code] = true;
  }, []);

  const release = useCallback((code: string) => (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    keysRef.current[code] = false;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;;

    const mkGS = (char: CharId | null, pWins = 0, aWins = 0): GS => ({
      phase: char ? 'countdown' : 'select',
      player: createFighter(char ?? 'jasper', 180, 1),
      ai: createFighter('daddy', W - 180, -1),
      timer: ROUND_TIME, timerMs: 0,
      playerWins: pWins, aiWins: aWins,
      roundEndTimer: 0, roundMsg: '',
      countdownTimer: 180, particles: [],
      shake: 0, selectedChar: char,
    });

    gsRef.current = mkGS(null);

    const onKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.code] = true;
      const gs = gsRef.current;
      if (!gs) return;

      if (gs.phase === 'select') {
        const map: Record<string, CharId> = { Digit1: 'jasper', Digit2: 'julien', Digit3: 'mommy', Numpad1: 'jasper', Numpad2: 'julien', Numpad3: 'mommy' };
        if (map[e.code]) {
          gsRef.current = mkGS(map[e.code]);
          aiRef.current = { thinkTimer: 60, action: 'idle', attackType: 'punch' };
        }
      }
      if (gs.phase === 'game_over' && (e.code === 'Space' || e.code === 'Enter')) {
        gsRef.current = mkGS(null);
      }
      e.preventDefault();
    };
    const onKeyUp = (e: KeyboardEvent) => { keysRef.current[e.code] = false; };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Precompute background once (randomness for windows)
    const bgCanvas = document.createElement('canvas');
    bgCanvas.width = W; bgCanvas.height = H;
    const bgCtx = bgCanvas.getContext('2d');
    if (!bgCtx) return;
    drawBg(bgCtx);
    const bgImg = bgCanvas;

    let lastTime = 0;

    const loop = (t: number) => {
      const dt = Math.min(t - lastTime, 50);
      lastTime = t;
      const gs = gsRef.current;
      if (!gs) return;
      // Sync phase to React state only when it changes (avoids per-frame re-renders)
      if (gs.phase !== prevPhaseRef.current) {
        prevPhaseRef.current = gs.phase;
        setUiPhase(gs.phase);
      }
      ctx.clearRect(0, 0, W, H);

      if (gs.phase === 'select') {
        renderSelect(ctx, t);
      } else if (gs.phase === 'countdown') {
        renderCountdown(ctx, gs, bgImg);
      } else if (gs.phase === 'fight') {
        renderFight(ctx, gs, bgImg, dt);
      } else if (gs.phase === 'round_end') {
        renderRoundEnd(ctx, gs, bgImg);
      } else if (gs.phase === 'game_over') {
        renderGameOver(ctx, gs);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    // ---- RENDER SELECT ----
    const renderSelect = (ctx: CanvasRenderingContext2D, t: number) => {
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#06031a'); bg.addColorStop(1, '#180a2e');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      // Scanlines effect
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      for (let sy = 0; sy < H; sy += 4) ctx.fillRect(0, sy, W, 2);

      ctx.textAlign = 'center';
      ctx.font = 'bold 44px "Courier New", monospace';
      ctx.fillStyle = '#ff33bb'; ctx.shadowColor = '#ff33bb'; ctx.shadowBlur = 24;
      ctx.fillText('ROBOT BRAWL', W / 2, 68);
      ctx.shadowBlur = 0;
      ctx.font = 'bold 16px "Courier New", monospace';
      ctx.fillStyle = '#9988cc';
      ctx.fillText('— SINGLE PLAYER —', W / 2, 95);
      ctx.font = 'bold 20px "Courier New", monospace';
      ctx.fillStyle = '#ccbbff';
      ctx.fillText('CHOOSE YOUR FIGHTER', W / 2, 128);

      const chars: CharId[] = ['jasper', 'julien', 'mommy'];
      const cW = 195;
      const cH = 235;
      const sx = W / 2 - (chars.length * (cW + 18)) / 2 + cW / 2;

      chars.forEach((cid, i) => {
        const cx = sx + i * (cW + 18);
        const cy = H / 2 + 22;
        const c = COLORS[cid];
        const pulse = Math.sin(t * 0.002 + i) * 0.12 + 0.88;

        ctx.fillStyle = 'rgba(0,0,0,0.55)'; rr(ctx, cx - cW / 2, cy - cH / 2, cW, cH, 12); ctx.fill();
        ctx.strokeStyle = c.p; ctx.lineWidth = 2.5;
        ctx.shadowColor = c.p; ctx.shadowBlur = 12 * pulse;
        rr(ctx, cx - cW / 2, cy - cH / 2, cW, cH, 12); ctx.stroke();
        ctx.shadowBlur = 0;

        const pf = createFighter(cid, cx, 1);
        pf.y = cy - 25; pf.animFrame = t / 16 + i * 40;
        drawRobot(ctx, pf);

        ctx.font = 'bold 17px "Courier New", monospace';
        ctx.fillStyle = '#fff'; ctx.shadowColor = c.g; ctx.shadowBlur = 6;
        ctx.fillText(CNAMES[cid], cx, cy + cH / 2 - 65);
        ctx.shadowBlur = 0;
        CHAR_DESC[cid].forEach((line, li) => {
          ctx.font = '11px "Courier New", monospace'; ctx.fillStyle = '#9aabb8';
          ctx.fillText(line, cx, cy + cH / 2 - 47 + li * 14);
        });
        ctx.font = 'bold 10px "Courier New", monospace';
        ctx.fillStyle = c.g; ctx.shadowColor = c.g; ctx.shadowBlur = 4;
        ctx.fillText(SPECIAL_NAMES[cid], cx, cy + cH / 2 - 17);
        ctx.shadowBlur = 0;
        ctx.font = 'bold 24px "Courier New", monospace';
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fillText(`[${i + 1}]`, cx, cy + cH / 2 + 8);
      });

      ctx.font = '12px "Courier New", monospace'; ctx.fillStyle = '#445566';
      ctx.fillText('MOVE: ← →   JUMP: ↑ / W   PUNCH: Z   KICK: X   SPECIAL: C', W / 2, H - 18);
      ctx.textAlign = 'left';
    };

    // ---- RENDER HUD ----
    const renderHUD = (ctx: CanvasRenderingContext2D, gs: GS) => {
      const bw = 280;
      drawHealthBar(ctx, 20, 12, bw, gs.player.hp, gs.player.maxHp, CNAMES[gs.player.id], true, gs.player.id, gs.player.specialCooldown, STATS[gs.player.id].sCd);
      drawHealthBar(ctx, W - 20 - bw, 12, bw, gs.ai.hp, gs.ai.maxHp, CNAMES[gs.ai.id], false, gs.ai.id, gs.ai.specialCooldown, STATS[gs.ai.id].sCd);

      ctx.textAlign = 'center'; ctx.font = 'bold 28px "Courier New", monospace';
      const tc = gs.timer <= 10 ? '#ff3333' : '#ffffff';
      ctx.fillStyle = tc; if (gs.timer <= 10) { ctx.shadowColor = tc; ctx.shadowBlur = 12; }
      ctx.fillText(String(Math.ceil(gs.timer)), W / 2, 30); ctx.shadowBlur = 0;

      const dr = 7;
      for (let i = 0; i < ROUNDS_TO_WIN; i++) {
        ctx.beginPath(); ctx.arc(W / 2 - 18 + i * 16, 44, dr, 0, Math.PI * 2);
        ctx.fillStyle = i < gs.playerWins ? '#33ff33' : 'rgba(255,255,255,0.15)'; ctx.fill();
      }
      for (let i = 0; i < ROUNDS_TO_WIN; i++) {
        ctx.beginPath(); ctx.arc(W / 2 + 2 + i * 16, 44, dr, 0, Math.PI * 2);
        ctx.fillStyle = i < gs.aiWins ? '#ff3333' : 'rgba(255,255,255,0.15)'; ctx.fill();
      }
      ctx.textAlign = 'left';
    };

    // ---- RENDER COUNTDOWN ----
    const renderCountdown = (ctx: CanvasRenderingContext2D, gs: GS, bgImg: HTMLCanvasElement) => {
      ctx.drawImage(bgImg, 0, 0);
      drawRobot(ctx, gs.player); drawRobot(ctx, gs.ai);
      renderHUD(ctx, gs);
      gs.countdownTimer--;

      const n = Math.ceil(gs.countdownTimer / 60);
      ctx.textAlign = 'center';
      if (gs.countdownTimer > 60) {
        ctx.font = 'bold 88px "Courier New", monospace';
        ctx.fillStyle = '#ff3333'; ctx.shadowColor = '#ff3333'; ctx.shadowBlur = 35;
        ctx.fillText(String(n), W / 2, H / 2 + 35);
      } else {
        const a = gs.countdownTimer / 60;
        ctx.globalAlpha = a;
        ctx.font = 'bold 80px "Courier New", monospace';
        ctx.fillStyle = '#ffff44'; ctx.shadowColor = '#ffff44'; ctx.shadowBlur = 45;
        ctx.fillText('FIGHT!', W / 2, H / 2 + 35);
        ctx.globalAlpha = 1;
      }
      ctx.shadowBlur = 0; ctx.textAlign = 'left';
      if (gs.countdownTimer <= 0) gs.phase = 'fight';
    };

    // ---- RENDER FIGHT ----
    const renderFight = (ctx: CanvasRenderingContext2D, gs: GS, bgImg: HTMLCanvasElement, dt: number) => {
      if (gs.shake > 0) gs.shake = Math.max(0, gs.shake - 0.6);

      gs.timerMs += dt;
      if (gs.timerMs >= 1000) { gs.timerMs -= 1000; gs.timer = Math.max(0, gs.timer - 1); }

      const k = keysRef.current;
      updatePlayer(gs,
        !!(k.ArrowLeft || k.KeyA), !!(k.ArrowRight || k.KeyD),
        !!(k.KeyZ || k.KeyJ), !!(k.KeyX || k.KeyK),
        !!(k.ArrowUp || k.KeyW || k.Space), !!(k.KeyC || k.KeyL),
      );
      updateAI(gs, aiRef.current);
      applyPhysics(gs.player); applyPhysics(gs.ai);
      updateParticles(gs.particles);

      // Draw
      if (gs.shake > 0) {
        ctx.save();
        ctx.translate((Math.random() - 0.5) * gs.shake * 2.5, (Math.random() - 0.5) * gs.shake * 2.5);
      }
      ctx.drawImage(bgImg, 0, 0);
      drawParticles(ctx, gs.particles);
      drawRobot(ctx, gs.player); drawRobot(ctx, gs.ai);
      renderHUD(ctx, gs);
      if (gs.shake > 0) ctx.restore();

      // Check round end
      const pd = gs.player.anim === 'dead';
      const ad = gs.ai.anim === 'dead';
      const tu = gs.timer <= 0;
      if (pd || ad || tu) {
        let msg = 'DRAW!';
        if (!pd && ad) { gs.playerWins++; msg = 'YOU WIN!'; }
        else if (pd && !ad) { gs.aiWins++; msg = 'YOU LOSE!'; }
        else if (!pd && !ad && tu) {
          if (gs.player.hp > gs.ai.hp) { gs.playerWins++; msg = 'YOU WIN!'; }
          else if (gs.ai.hp > gs.player.hp) { gs.aiWins++; msg = 'YOU LOSE!'; }
        }
        gs.roundMsg = msg; gs.roundEndTimer = 190; gs.phase = 'round_end';
      }
    };

    // ---- RENDER ROUND END ----
    const renderRoundEnd = (ctx: CanvasRenderingContext2D, gs: GS, bgImg: HTMLCanvasElement) => {
      ctx.drawImage(bgImg, 0, 0);
      drawParticles(ctx, gs.particles);
      drawRobot(ctx, gs.player); drawRobot(ctx, gs.ai);
      renderHUD(ctx, gs);
      updateParticles(gs.particles);

      ctx.fillStyle = 'rgba(0,0,0,0.48)'; ctx.fillRect(0, 0, W, H);
      const a = Math.min(1, (190 - gs.roundEndTimer) / 20);
      ctx.globalAlpha = a;
      const col = gs.roundMsg === 'YOU WIN!' ? '#33ff33' : gs.roundMsg === 'DRAW!' ? '#ffff33' : '#ff3333';
      ctx.font = 'bold 68px "Courier New", monospace'; ctx.textAlign = 'center';
      ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 35;
      ctx.fillText(gs.roundMsg, W / 2, H / 2);
      ctx.shadowBlur = 0;
      if (gs.roundMsg === 'YOU WIN!' || gs.roundMsg === 'YOU LOSE!') {
        ctx.font = '26px "Courier New", monospace';
        ctx.fillStyle = gs.roundMsg === 'YOU WIN!' ? '#aaffcc' : '#ffaaaa';
        ctx.fillText('K.O.!', W / 2, H / 2 + 55);
      }
      ctx.globalAlpha = 1; ctx.textAlign = 'left';

      gs.roundEndTimer--;
      if (gs.roundEndTimer <= 0) {
        if (gs.playerWins >= ROUNDS_TO_WIN || gs.aiWins >= ROUNDS_TO_WIN) {
          gs.phase = 'game_over';
        } else {
          const sc = gs.selectedChar ?? 'jasper';
          gsRef.current = mkGS(sc, gs.playerWins, gs.aiWins);
          aiRef.current = { thinkTimer: 60, action: 'idle', attackType: 'punch' };
        }
      }
    };

    // ---- RENDER GAME OVER ----
    const renderGameOver = (ctx: CanvasRenderingContext2D, gs: GS) => {
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#040210'); bg.addColorStop(1, '#120622');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      for (let sy = 0; sy < H; sy += 4) ctx.fillRect(0, sy, W, 2);

      const won = gs.playerWins >= ROUNDS_TO_WIN;
      ctx.textAlign = 'center';
      ctx.font = 'bold 76px "Courier New", monospace';
      const mc = won ? '#33ff44' : '#ff2222';
      ctx.fillStyle = mc; ctx.shadowColor = mc; ctx.shadowBlur = 45;
      ctx.fillText(won ? 'VICTORY!' : 'GAME OVER', W / 2, H / 2 - 35);
      ctx.shadowBlur = 0;
      ctx.font = '24px "Courier New", monospace';
      ctx.fillStyle = won ? '#aaffcc' : '#ffaaaa';
      ctx.fillText(won ? 'You defeated DADDY!' : 'DADDY wins this time...', W / 2, H / 2 + 22);
      ctx.font = 'bold 20px "Courier New", monospace';
      ctx.fillStyle = '#8888aa';
      ctx.fillText(`Score: ${gs.playerWins} — ${gs.aiWins}`, W / 2, H / 2 + 62);
      ctx.font = '16px "Courier New", monospace'; ctx.fillStyle = '#556677';
      ctx.fillText('Press SPACE or ENTER to play again', W / 2, H / 2 + 100);
      ctx.textAlign = 'left';
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  const btn = (
    label: string,
    code: string,
    color = '#223344',
    textColor = '#ffffff',
    wide = false,
  ) => {
    const s: React.CSSProperties = {
      background: color,
      color: textColor,
      border: '2px solid rgba(255,255,255,0.25)',
      borderRadius: 10,
      fontFamily: '"Courier New", monospace',
      fontWeight: 'bold',
      fontSize: wide ? 13 : 15,
      userSelect: 'none',
      WebkitUserSelect: 'none',
      touchAction: 'none',
      cursor: 'pointer',
      minWidth: wide ? 80 : 58,
      minHeight: 58,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: `0 0 8px ${color}88`,
      flexShrink: 0,
    };
    return (
      <button
        key={code}
        style={s}
        onMouseDown={press(code)}
        onMouseUp={release(code)}
        onMouseLeave={release(code)}
        onTouchStart={press(code)}
        onTouchEnd={release(code)}
        onTouchCancel={release(code)}
        type="button"
      >
        {label}
      </button>
    );
  };

  const charBtn = (label: string, code: string, color: string) => {
    const s: React.CSSProperties = {
      background: color,
      color: '#fff',
      border: '2px solid rgba(255,255,255,0.3)',
      borderRadius: 10,
      fontFamily: '"Courier New", monospace',
      fontWeight: 'bold',
      fontSize: 13,
      userSelect: 'none',
      WebkitUserSelect: 'none',
      touchAction: 'none',
      cursor: 'pointer',
      flex: 1,
      minHeight: 52,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: `0 0 10px ${color}88`,
    };
    const handleSelect = (e: React.TouchEvent | React.MouseEvent) => {
      e.preventDefault();
      keysRef.current[code] = true;
      setTimeout(() => { keysRef.current[code] = false; }, 100);
    };
    return (
      <button key={code} style={s} onMouseDown={handleSelect} onTouchStart={handleSelect} type="button">
        {label}
      </button>
    );
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      width: '100%', padding: '12px 8px 24px',
      background: '#06031a', minHeight: '100vh', boxSizing: 'border-box',
    }}>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{
          maxWidth: '100%', cursor: 'none',
          border: '2px solid #cc44ff',
          boxShadow: '0 0 28px #cc44ff55, 0 0 60px #88229933',
          borderRadius: '4px', display: 'block',
        }}
        tabIndex={0}
      />

      {/* Touch controls */}
      <div style={{ width: '100%', maxWidth: W, marginTop: 12 }}>

        {/* Character select buttons */}
        {(uiPhase === 'select') && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            {charBtn('1 · JASPER', 'Digit1', '#2255cc')}
            {charBtn('2 · JULIEN', 'Digit2', '#227733')}
            {charBtn('3 · MOMMY',  'Digit3', '#aa2277')}
          </div>
        )}

        {/* Play again button */}
        {uiPhase === 'game_over' && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
            {charBtn('▶ PLAY AGAIN', 'Space', '#553388')}
          </div>
        )}

        {/* Fight controls */}
        {(uiPhase === 'fight' || uiPhase === 'countdown' || uiPhase === 'round_end') && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 8 }}>
            {/* D-pad */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
              {btn('▲ JUMP', 'ArrowUp', '#334455')}
              <div style={{ display: 'flex', gap: 6 }}>
                {btn('◀', 'ArrowLeft', '#223344')}
                {btn('▶', 'ArrowRight', '#223344')}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {btn('PUNCH', 'KeyZ', '#1144aa', '#fff', true)}
              {btn('KICK',  'KeyX', '#881133', '#fff', true)}
              {btn('✨ SPEC', 'KeyC', '#774400', '#ffcc44', true)}
            </div>
          </div>
        )}
      </div>

      <p style={{ marginTop: 10, color: '#334455', fontSize: 11, fontFamily: 'monospace', textAlign: 'center' }}>
        Keyboard: ←→ Move · ↑/W Jump · Z Punch · X Kick · C Special
      </p>
    </div>
  );
}

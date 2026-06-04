// Lógica del motor de Cable Rush (Snake) - Servidor Autoritativo

// ─── Tabla de niveles ────────────────────────────────────────────────────────
// tickInterval: ms entre ticks del servidor  (controla velocidad real)
// moveEvery:    el jugador avanza 1 celda cada N ticks  (1 = max, 2 = la mitad)
// duration:     segundos acumulados para pasar al siguiente nivel
// obstacles:    cantidad de obstáculos fijos en el tablero
// bonusChance:  probabilidad de que un item extra "bonus" aparezca al spawnear
const LEVELS = [
  /* 1 */ { tickInterval: 120, moveEvery: 2, duration: 0,   obstacles: 0, bonusChance: 0.00 },
  /* 2 */ { tickInterval: 110, moveEvery: 2, duration: 15,  obstacles: 2, bonusChance: 0.10 },
  /* 3 */ { tickInterval: 100, moveEvery: 2, duration: 30,  obstacles: 4, bonusChance: 0.15 },
  /* 4 */ { tickInterval:  90, moveEvery: 1, duration: 50,  obstacles: 6, bonusChance: 0.20 },
  /* 5 */ { tickInterval:  75, moveEvery: 1, duration: 70,  obstacles: 8, bonusChance: 0.25 },
  /* 6 */ { tickInterval:  60, moveEvery: 1, duration: 95,  obstacles: 10, bonusChance: 0.30 },
  /* 7 */ { tickInterval:  45, moveEvery: 1, duration: 125, obstacles: 12, bonusChance: 0.35 },
  /* 8 */ { tickInterval:  30, moveEvery: 1, duration: 160, obstacles: 14, bonusChance: 0.40 },
];

function getLevelConfig(level) {
  const idx = Math.min(level - 1, LEVELS.length - 1);
  return LEVELS[idx];
}

// Calcula el nivel actual según duración
function calcLevel(duration) {
  let lv = 1;
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (duration >= LEVELS[i].duration) { lv = i + 1; break; }
  }
  return lv;
}

// Devuelve el tickInterval que debe usar el servidor para este nivel
function getTickInterval(level) {
  return getLevelConfig(level).tickInterval;
}

class SnakeGame {
  constructor(roomCode, playersList) {
    this.roomCode = roomCode;
    this.playersList = playersList; // [{socketId, name, character, playerIndex}]
    this.width  = 20;   // reducido de 30 → celdas más grandes y visibles
    this.height = 13;   // reducido de 20
    this.state  = 'playing';

    this.items     = []; // {x, y, type: 'datos'|'energia'|'nodo'|'bonus', expiresAt?}
    this.powerups  = []; // {x, y, type: 'overclock'|'firewall'|'emp'}
    this.obstacles = []; // {x, y}  — fijos, aumentan con el nivel
    this.winner    = null;
    this.duration  = 0;
    this.tickCount = 0;
    this.level     = 1;
    this.powerupSpawnTimer = null;
    this.bonusCleanupTimer = null;

    this.initGame();
  }

  initGame() {
    this.players = this.playersList.map((p, idx) => {
      const isFirst = idx === 0;
      const startX  = isFirst ? 4 : this.width - 5;
      const startY  = Math.floor(this.height / 2);
      const initialDir = isFirst ? 'RIGHT' : 'LEFT';

      const segments = [];
      for (let i = 0; i < 3; i++) {
        segments.push({ x: startX - (isFirst ? i : -i), y: startY });
      }

      return {
        socketId: p.socketId,
        name: p.name,
        character: p.character,
        playerIndex: p.playerIndex,
        segments,
        dir: initialDir,
        nextDir: initialDir,
        score: 0,
        isDead: false,
        overclockTicks: 0,
        firewallTicks: 0,
        empTicks: 0,
        magnetTicks: 0,
        victories: 0
      };
    });

    this.obstacles = [];
    this.items     = [];
    this.powerups  = [];

    // Items iniciales
    for (let i = 0; i < 3; i++) this.spawnItem();
    this.spawnPowerup();
    // Obstáculos del nivel inicial (nivel 1 = 0 obstáculos)
    this._syncObstacles();
  }

  // ─── Obstáculos ────────────────────────────────────────────────────────────

  _syncObstacles() {
    const target = getLevelConfig(this.level).obstacles;
    // Agregar obstáculos si faltan
    while (this.obstacles.length < target) {
      const tile = this._getRandomFreeTileForObstacle();
      if (tile) this.obstacles.push(tile);
      else break; // tablero lleno
    }
    // No se quitan obstáculos (solo se agregan al subir de nivel)
  }

  _getRandomFreeTileForObstacle() {
    const safeZone = 5; // no spawnear cerca del centro ni de los extremos iniciales
    let x, y, attempts = 0;
    do {
      x = Math.floor(Math.random() * (this.width  - 4)) + 2;
      y = Math.floor(Math.random() * (this.height - 4)) + 2;
      attempts++;
      if (attempts > 200) return null;
    } while (
      this.isTileOccupied(x, y) ||
      this.isObstacle(x, y)     ||
      this.items.some(i  => i.x === x && i.y === y) ||
      this.powerups.some(p => p.x === x && p.y === y) ||
      // Zona segura alrededor del inicio de cada jugador
      this.players.some(p => {
        const hx = p.playerIndex === 0 ? 4 : this.width - 5;
        return Math.abs(x - hx) < safeZone && Math.abs(y - Math.floor(this.height / 2)) < 3;
      })
    );
    return { x, y };
  }

  isObstacle(x, y) {
    return this.obstacles.some(o => o.x === x && o.y === y);
  }

  // ─── Tiles libres ──────────────────────────────────────────────────────────

  isTileOccupied(x, y) {
    return this.players.some(p => p.segments.some(seg => seg.x === x && seg.y === y));
  }

  getRandomFreeTile() {
    let x, y, attempts = 0;
    do {
      x = Math.floor(Math.random() * (this.width  - 2)) + 1;
      y = Math.floor(Math.random() * (this.height - 2)) + 1;
      attempts++;
      if (attempts > 200) break;
    } while (
      this.isTileOccupied(x, y)  ||
      this.isObstacle(x, y)      ||
      this.items.some(i  => i.x === x && i.y === y) ||
      this.powerups.some(p => p.x === x && p.y === y)
    );
    return { x, y };
  }

  // ─── Items ─────────────────────────────────────────────────────────────────

  spawnItem() {
    const tile = this.getRandomFreeTile();
    const cfg  = getLevelConfig(this.level);
    const rand = Math.random();

    // Chance de item bonus temporal según nivel
    if (rand < cfg.bonusChance) {
      const ttl = 8000 + Math.random() * 4000; // 8–12 segundos
      this.items.push({ x: tile.x, y: tile.y, type: 'bonus', expiresAt: Date.now() + ttl });
      return;
    }

    const r2 = Math.random();
    let type = 'datos';
    if (r2 > 0.6 && r2 <= 0.9) type = 'energia';
    else if (r2 > 0.9)          type = 'nodo';
    this.items.push({ x: tile.x, y: tile.y, type });
  }

  _cleanExpiredBonus() {
    const now = Date.now();
    this.items = this.items.filter(i => !i.expiresAt || i.expiresAt > now);
  }

  spawnPowerup() {
    const tile  = this.getRandomFreeTile();
    const types = ['overclock', 'firewall', 'emp'];
    const type  = types[Math.floor(Math.random() * types.length)];
    this.powerups.push({ x: tile.x, y: tile.y, type });
  }

  schedulePowerupRespawn() {
    if (this.powerupSpawnTimer) clearTimeout(this.powerupSpawnTimer);
    this.powerupSpawnTimer = setTimeout(() => {
      if (this.state === 'playing') this.spawnPowerup();
    }, 8000);
  }

  // ─── Imán ──────────────────────────────────────────────────────────────────

  applyMagnetAttraction() {
    this.players.forEach(player => {
      if (player.isDead || !(player.magnetTicks > 0)) return;
      const head   = player.segments[0];
      const radius = 5.5;
      this.items.forEach(item => {
        let dx = head.x - item.x;
        let dy = head.y - item.y;
        if (dx >  this.width  / 2) dx -= this.width;
        if (dx < -this.width  / 2) dx += this.width;
        if (dy >  this.height / 2) dy -= this.height;
        if (dy < -this.height / 2) dy += this.height;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0 && dist <= radius) {
          const force = 0.15 + (1 - dist / radius) * 0.35;
          item.x += (dx / dist) * force;
          item.y += (dy / dist) * force;
          if (item.x < 0)             item.x += this.width;
          if (item.x >= this.width)   item.x -= this.width;
          if (item.y < 0)             item.y += this.height;
          if (item.y >= this.height)  item.y -= this.height;
        }
      });
    });
  }

  // ─── Tick ──────────────────────────────────────────────────────────────────

  tick() {
    if (this.state !== 'playing') return;

    this.tickCount++;

    // Duración: cada 10 ticks = 1 segundo (con tickInterval=100ms base)
    // Con tickInterval variable la duración usa tickCount proporcional
    if (this.tickCount % 10 === 0) {
      this.duration++;
      const newLevel = calcLevel(this.duration);
      if (newLevel !== this.level) {
        this.level = newLevel;
        this._syncObstacles();
      }
    }

    // Limpiar bonus expirados
    if (this.tickCount % 5 === 0) this._cleanExpiredBonus();

    this.applyMagnetAttraction();

    const cfg = getLevelConfig(this.level);

    this.players.forEach(player => {
      if (player.isDead) return;

      if (player.overclockTicks > 0) player.overclockTicks--;
      if (player.firewallTicks  > 0) player.firewallTicks--;
      if (player.empTicks > 0) {
        player.empTicks--;
        return; // congelado
      }
      if (player.magnetTicks > 0) player.magnetTicks--;

      // ── Control de velocidad ──────────────────────────────────────────────
      // moveEvery=1 → avanza cada tick; moveEvery=2 → cada 2 ticks
      // Overclock siempre avanza cada tick
      const moveEvery = player.overclockTicks > 0 ? 1 : cfg.moveEvery;
      if (this.tickCount % moveEvery !== 0) return;

      player.dir = player.nextDir;

      const head = { ...player.segments[0] };
      if (player.dir === 'UP')    head.y--;
      if (player.dir === 'DOWN')  head.y++;
      if (player.dir === 'LEFT')  head.x--;
      if (player.dir === 'RIGHT') head.x++;

      // Colisión con bordes
      let hitWall = head.x < 0 || head.x >= this.width || head.y < 0 || head.y >= this.height;
      if (hitWall) {
        if (player.firewallTicks > 0) {
          player.firewallTicks = 0;
          if (head.x < 0)              head.x = this.width  - 1;
          else if (head.x >= this.width)  head.x = 0;
          else if (head.y < 0)            head.y = this.height - 1;
          else if (head.y >= this.height) head.y = 0;
          hitWall = false;
        } else {
          player.isDead = true;
          return;
        }
      }

      // Colisión con obstáculos fijos
      if (this.isObstacle(head.x, head.y)) {
        if (player.firewallTicks > 0) {
          player.firewallTicks = 0; // escudo absorbe obstáculo
        } else {
          player.isDead = true;
          return;
        }
      }

      // Colisión con cables
      let hitCable = false;
      this.players.forEach(other => {
        other.segments.forEach((seg, sIdx) => {
          if (seg.x === head.x && seg.y === head.y) {
            if (other.socketId === player.socketId && sIdx === 0) return;
            hitCable = true;
          }
        });
      });

      if (hitCable) {
        if (player.firewallTicks > 0) {
          player.firewallTicks = 0;
        } else {
          player.isDead = true;
          return;
        }
      }

      player.segments.unshift(head);

      // Consumo de items
      let ate = false;
      const itemIdx = this.items.findIndex(item => {
        let dx = head.x - item.x;
        let dy = head.y - item.y;
        if (dx >  this.width  / 2) dx -= this.width;
        if (dx < -this.width  / 2) dx += this.width;
        if (dy >  this.height / 2) dy -= this.height;
        if (dy < -this.height / 2) dy += this.height;
        return Math.abs(dx) < 0.55 && Math.abs(dy) < 0.55;
      });

      if (itemIdx !== -1) {
        const item = this.items.splice(itemIdx, 1)[0];
        ate = true;

        let scoreAdd    = 10;
        let growSegments = 1;
        if (item.type === 'energia') { scoreAdd = 25;  growSegments = 2; }
        else if (item.type === 'nodo')   { scoreAdd = 50;  growSegments = 3; }
        else if (item.type === 'bonus')  { scoreAdd = 100; growSegments = 1; } // bonus alto

        player.score += scoreAdd;
        for (let i = 1; i < growSegments; i++) {
          player.segments.push({ ...player.segments[player.segments.length - 1] });
        }
        this.spawnItem();
      }

      // Consumo de powerups
      const puIdx = this.powerups.findIndex(pu => pu.x === head.x && pu.y === head.y);
      if (puIdx !== -1) {
        const pu = this.powerups.splice(puIdx, 1)[0];
        ate = true;

        if (pu.type === 'overclock') {
          player.overclockTicks = 50;
        } else if (pu.type === 'firewall') {
          player.firewallTicks = 80;
        } else if (pu.type === 'emp') {
          player.magnetTicks = 80;
          this.players.forEach(other => {
            if (other.socketId !== player.socketId) other.empTicks = 20;
          });
        }

        this.schedulePowerupRespawn();
      }

      if (!ate) player.segments.pop();
    });

    this.checkGameOver();
  }

  checkGameOver() {
    const alive = this.players.filter(p => !p.isDead);

    if (alive.length === 0) {
      this.state  = 'game_over';
      const p1 = this.players[0];
      const p2 = this.players[1];
      if (p1 && p2) {
        if      (p1.score > p2.score) this.winner = p1.socketId;
        else if (p2.score > p1.score) this.winner = p2.socketId;
        else                          this.winner = 'draw';
      }
    } else if (alive.length === 1 && this.players.length > 1) {
      this.state  = 'game_over';
      this.winner = alive[0].socketId;
    } else if (this.players.length === 1 && alive.length === 0) {
      this.state  = 'game_over';
      this.winner = 'none';
    }
  }

  getSerializedState() {
    return {
      width:     this.width,
      height:    this.height,
      state:     this.state,
      duration:  this.duration,
      level:     this.level,
      winner:    this.winner,
      items:     this.items.map(i => ({
        x: i.x, y: i.y, type: i.type,
        expiresAt: i.expiresAt || null
      })),
      powerups:  this.powerups,
      obstacles: this.obstacles,
      players:   this.players.map(p => ({
        socketId:    p.socketId,
        name:        p.name,
        character:   p.character,
        playerIndex: p.playerIndex,
        segments:    p.segments,
        dir:         p.dir,
        score:       p.score,
        isDead:      p.isDead,
        overclock:   p.overclockTicks > 0,
        firewall:    p.firewallTicks  > 0,
        emp:         p.empTicks       > 0,
        magnet:      p.magnetTicks    > 0
      }))
    };
  }
}

module.exports = { SnakeGame, getTickInterval };

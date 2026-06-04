/**
 * Configuración centralizada de cables para Cable Rush (Snake).
 * Una única fuente de verdad para sprites, colores y metadatos.
 */
const CABLES = {
  USB: {
    id: 'USB',
    name: 'Cable USB',
    desc: 'Conector\nUSB Type-A',
    color: '#00f0ff',
    glow: '#00f0ff',
    selColor: '#00f0ff',
    cabeza: '/assets/characters/azul.png',
    cola: '/assets/characters/colaazul.png',
    preview: '/assets/characters/azul.png'
  },
  HDMI: {
    id: 'HDMI',
    name: 'Cable HDMI',
    desc: 'Conector\nHDMI',
    color: '#bf00ff',
    glow: '#bf00ff',
    selColor: '#bf00ff',
    cabeza: '/assets/characters/violeta.png',
    cola: '/assets/characters/colavioleta.png',
    preview: '/assets/characters/violeta.png'
  },
  Ethernet: {
    id: 'Ethernet',
    name: 'Cable Ethernet',
    desc: 'Conector\nRJ-45',
    color: '#39ff14',
    glow: '#39ff14',
    selColor: '#39ff14',
    cabeza: '/assets/characters/verde.png',
    cola: '/assets/characters/colaverde.png',
    preview: '/assets/characters/verde.png'
  }
};

const CABLE_LIST = Object.values(CABLES);

/** Formato lobby — una sola fuente de verdad */
function getLobbyCharacters() {
  return CABLE_LIST.map((c) => ({
    id: c.id,
    name: c.name,
    desc: c.desc,
    color: c.color,
    selColor: c.selColor,
    img: c.preview.replace('/assets/characters/', '')
  }));
}

/** Obtiene la config de un cable por id; fallback USB */
function getCable(character) {
  return CABLES[character] || CABLES.USB;
}

/** Rota un vector de dirección de grid a ángulo en radianes (sprite base apunta hacia arriba) */
function dirToAngle(dir) {
  switch (dir) {
    case 'UP':    return 0;
    case 'RIGHT': return Math.PI / 2;
    case 'DOWN':  return Math.PI;
    case 'LEFT':  return -Math.PI / 2;
    default:      return 0;
  }
}

/** Dirección entre dos celdas adyacentes */
function vecToDir(dx, dy) {
  if (dx === 1)  return 'RIGHT';
  if (dx === -1) return 'LEFT';
  if (dy === 1)  return 'DOWN';
  if (dy === -1) return 'UP';
  return null;
}

/** Cable rival para modo local 2P */
function getRivalCable(character) {
  if (character === 'USB') return 'HDMI';
  if (character === 'HDMI') return 'Ethernet';
  return 'USB';
}

window.CABLES = CABLES;
window.CABLE_LIST = CABLE_LIST;
window.getCable = getCable;
window.dirToAngle = dirToAngle;
window.vecToDir = vecToDir;
window.getRivalCable = getRivalCable;
window.getLobbyCharacters = getLobbyCharacters;

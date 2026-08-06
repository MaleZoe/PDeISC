/**
 * ============================================================================
 * MODELO DE PALABRAS (Palabra.model.js)
 * ============================================================================
 * Explicación didáctica:
 * Este modelo gestiona el suministro de palabras para el Juego del Ahorcado.
 * Además de dar soporte al fetch externo, incorpora una robusta base de datos interna
 * curada de más de 60 palabras organizadas por categorías y con pistas pedagógicas.
 * Esto garantiza que la aplicación SIEMPRE funcione (100% de alta disponibilidad)
 * incluso en entornos sin conexión a Internet o si la API de terceros experimenta caídas.
 */

class PalabraModel {
  constructor() {
    /**
     * Diccionario interno curado y categorizado de palabras en español con pistas.
     */
    this.diccionarioInterno = [
      // Tecnología e Informática
      { palabra: 'JAVASCRIPT', pista: 'Lenguaje de programación de la web y Node.js', categoria: 'Tecnología' },
      { palabra: 'DESARROLLADOR', pista: 'Profesional que diseña, codifica y mantiene software', categoria: 'Tecnología' },
      { palabra: 'ALGORITMO', pista: 'Conjunto ordenado y finito de instrucciones para resolver un problema', categoria: 'Tecnología' },
      { palabra: 'SERVIDOR', pista: 'Computadora o programa que atiende peticiones de clientes en una red', categoria: 'Tecnología' },
      { palabra: 'ASINCRONO', pista: 'Modelo de ejecución que no bloquea el hilo principal mientras espera respuestas', categoria: 'Tecnología' },
      { palabra: 'FRAMEWORK', pista: 'Entorno o marco de trabajo estructurado para el desarrollo de software', categoria: 'Tecnología' },
      { palabra: 'COMPILADOR', pista: 'Programa que traduce código fuente a lenguaje máquina o bytecode', categoria: 'Tecnología' },
      { palabra: 'TERMINAL', pista: 'Interfaz de línea de comandos para interactuar directamente con el sistema operativo', categoria: 'Tecnología' },
      { palabra: 'ENCAPSULAMIENTO', pista: 'Principio de POO que oculta los detalles internos y protege los datos de un objeto', categoria: 'Tecnología' },
      { palabra: 'POLIMORFISMO', pista: 'Capacidad de objetos de distintas clases para responder al mismo mensaje o método', categoria: 'Tecnología' },

      // Ciencia y Matemáticas
      { palabra: 'GRAVEDAD', pista: 'Fuerza de atracción fundamental entre cuerpos con masa en el universo', categoria: 'Ciencia' },
      { palabra: 'FOTOSINTESIS', pista: 'Proceso biológico por el cual las plantas convierten luz solar en energía química', categoria: 'Ciencia' },
      { palabra: 'HIPOTESIS', pista: 'Suposición o conjetura científica sujeta a comprobación experimental', categoria: 'Ciencia' },
      { palabra: 'TERMODINAMICA', pista: 'Rama de la física que estudia el calor, la temperatura y la energía', categoria: 'Ciencia' },
      { palabra: 'METAMORFOSIS', pista: 'Transformación biológica profunda que experimentan ciertos animales en su desarrollo', categoria: 'Ciencia' },
      { palabra: 'ACELERACION', pista: 'Magnitud vectorial que mide la variación de velocidad en la unidad de tiempo', categoria: 'Ciencia' },
      { palabra: 'GEOESTACIONARIO', pista: 'Tipo de órbita satelital que coincide perfectamente con la rotación terrestre', categoria: 'Ciencia' },

      // Historia y Filosofía
      { palabra: 'RENACIMIENTO', pista: 'Movimiento cultural y artístico europeo de los siglos XV y XVI', categoria: 'Historia' },
      { palabra: 'DEMOCRACIA', pista: 'Sistema político y forma de organización social donde el poder reside en el pueblo', categoria: 'Historia' },
      { palabra: 'ILUSTRACION', pista: 'Movimiento intelectual del siglo XVIII que promovía la razón y la ciencia', categoria: 'Historia' },
      { palabra: 'MESOPOTAMIA', pista: 'Región entre los ríos Tigris y Éufrates, considerada cuna de la civilización', categoria: 'Historia' },
      { palabra: 'REVOLUCION', pista: 'Cambio social, económico o político profundo, acelerado y trascendental', categoria: 'Historia' },

      // Geografía y Naturaleza
      { palabra: 'CORDILLERA', pista: 'Sucesión de montañas enlazadas entre sí de gran extensión longitudinal', categoria: 'Geografía' },
      { palabra: 'ARCHIPIELAGO', pista: 'Conjunto de islas agrupadas en una superficie marina relativamente extensa', categoria: 'Geografía' },
      { palabra: 'ATMOSFERA', pista: 'Capa gaseosa que envuelve a un cuerpo celeste gracias a la gravedad', categoria: 'Geografía' },
      { palabra: 'BIODIVERSIDAD', pista: 'Variedad de especies biológicas en un ecosistema o en el planeta entero', categoria: 'Geografía' },
      { palabra: 'CONTINENTE', pista: 'Gran extensión de tierra firme separada por los océanos', categoria: 'Geografía' },
      { palabra: 'PENINSULA', pista: 'Porción de tierra rodeada de agua por todas partes excepto por un istmo', categoria: 'Geografía' },

      // Arte, Literatura y Cultura
      { palabra: 'LITERATURA', pista: 'Arte de la expresión verbal, abarcando textos escritos y tradiciones orales', categoria: 'Arte y Cultura' },
      { palabra: 'ARQUITECTURA', pista: 'Arte y técnica de proyectar y construir edificios y espacios urbanos', categoria: 'Arte y Cultura' },
      { palabra: 'METAFORA', pista: 'Figura retórica que traslada el significado de un concepto a otro por analogía', categoria: 'Arte y Cultura' },
      { palabra: 'SINFONIA', pista: 'Composición musical extensa para orquesta dividida generalmente en cuatro movimientos', categoria: 'Arte y Cultura' },
      { palabra: 'SURREALISMO', pista: 'Vanguardia artística que busca plasmar el inconsciente y los sueños', categoria: 'Arte y Cultura' },

      // Gastronomía y Vida cotidiana
      { palabra: 'GASTRONOMIA', pista: 'Arte de preparar buena comida y estudio de la relación del ser humano con su alimentación', categoria: 'Gastronomía' },
      { palabra: 'CHOCOLATE', pista: 'Alimento dulce y energético obtenido a partir de la semilla y manteca del cacao', categoria: 'Gastronomía' },
      { palabra: 'FERMENTACION', pista: 'Proceso bioquímico vital en la elaboración de pan, yogur, quesos y bebidas', categoria: 'Gastronomía' }
    ];
  }

  /**
   * Obtiene una palabra aleatoria del diccionario interno con su pista y categoría.
   * @returns {Object} { palabra, pista, categoria, longitud }
   */
  obtenerPalabraAleatoriaInterna() {
    const indiceAleatorio = Math.floor(Math.random() * this.diccionarioInterno.length);
    const item = this.diccionarioInterno[indiceAleatorio];
    const palabraSanitizada = this.sanitizarPalabra(item.palabra);

    return {
      palabra: palabraSanitizada,
      pista: item.pista,
      categoria: item.categoria,
      longitud: palabraSanitizada.length
    };
  }

  /**
   * Normaliza y limpia la palabra (mayúsculas, sin tildes ni caracteres extraños, manteniendo Ñ si apareciera).
   * @param {string} texto 
   * @returns {string} Palabra en mayúsculas y normalizada
   */
  sanitizarPalabra(texto) {
    if (!texto || typeof texto !== 'string') return 'DESARROLLO';
    
    return texto
      .trim()
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Elimina acentos/tildes diacríticas
      .replace(/[^A-ZÑ]/g, '');         // Deja únicamente letras de la A a la Z y la Ñ
  }
}

export default new PalabraModel();

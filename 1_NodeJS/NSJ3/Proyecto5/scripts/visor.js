
window.Visor = {
  actualizar,
  copiarAlPortapapeles
};

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnCopiar').addEventListener('click', copiarAlPortapapeles);
});

// Recibe el string HTML actual del canvas y actualiza el panel visor
function actualizar(htmlString) {
  const visor = document.getElementById('visorCodigo');
  
  // Limpiar el string de placeholders para la vista del código
  const htmlLimpio = limpiarHtml(htmlString);

  if (!htmlLimpio || htmlLimpio.trim() === '') {
    visor.innerHTML = '<span class="visor-vacio">// El canvas está vacío...</span>';
    visor.dataset.rawHtml = '';
    return;
  }

  const htmlFormateado = formatear(htmlLimpio);
  const htmlResaltado = resaltarSintaxis(htmlFormateado);
  
  visor.innerHTML = `<pre><code>${htmlResaltado}</code></pre>`;
  visor.dataset.rawHtml = htmlFormateado;
}

function limpiarHtml(html) {
  // Removemos el placeholder del canvas para que no aparezca en el visor
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  const placeholder = tempDiv.querySelector('#placeholderCanvas');
  if (placeholder) {
    placeholder.remove();
  }
  return tempDiv.innerHTML;
}

// Formatea el HTML con indentación básica para legibilidad
function formatear(htmlString) {
  let tab = '  ';
  let result = '';
  let indent = '';
  
  htmlString.split(/>\s*</).forEach(function(element) {
    if (element.match(/^\/\w/)) {
      indent = indent.substring(tab.length);
    }
    
    result += indent + '<' + element + '>\n';
    
    if (element.match(/^<?\w[^>]*[^\/]$/) && !element.startsWith("input") && !element.startsWith("img") && !element.startsWith("hr") && !element.startsWith("br")) {
      indent += tab;
    }
  });
  
  return result.substring(1, result.length - 2).trim();
}

// Aplica clases de color CSS a tags, atributos y valores
function resaltarSintaxis(htmlFormateado) {
  let codigo = htmlFormateado.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  // 1. Valores
  codigo = codigo.replace(/="([^"]*)"/g, '="<span class="hl-valor">$1</span>"');
  
  // 2. Atributos
  codigo = codigo.replace(/([a-zA-Z0-9\-]+)=/g, '<span class="hl-atributo">$1</span>=');
  
  // 3. Tags
  codigo = codigo.replace(/&lt;([a-zA-Z0-9\-]+)/g, '&lt;<span class="hl-tag">$1</span>');
  codigo = codigo.replace(/&lt;\/([a-zA-Z0-9\-]+)/g, '&lt;/<span class="hl-tag">$1</span>');
  
  // 4. Texto
  codigo = codigo.replace(/&gt;([^&]+)&lt;/g, '&gt;<span class="hl-texto">$1</span>&lt;');

  return codigo;
}

// Copia el innerHTML al portapapeles y muestra feedback breve
function copiarAlPortapapeles() {
  const visor = document.getElementById('visorCodigo');
  const btn = document.getElementById('btnCopiar');
  const texto = visor.dataset.rawHtml || '';
  
  if(!texto) return;
  
  navigator.clipboard.writeText(texto).then(() => {
    btn.textContent = '¡Copiado! ✓';
    setTimeout(() => {
      btn.textContent = '[ Copiar ]';
    }, 1500);
  }).catch(err => {
    console.error('Error al copiar: ', err);
  });
}

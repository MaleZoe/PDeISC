# Consigna 4 � Gestor de Atributos

Proyecto Express que crea nodos HTML din�micamente y modifica sus atributos mostrando cada cambio en pantalla.

## Requisitos cumplidos

1. **Bot�n "Crear nodos"** � genera 5 elementos distintos: `<a>`, `<img>`, `<button>`, `<input>`, `<div>`
2. **Bot�n "Modificar atributos"** � cambia un atributo de cada nodo (ej.: `href` de Google a Bing)
3. **Panel de cambios** � muestra din�micamente el atributo modificado y el valor anterior ? nuevo
4. **Feedback en cada nodo** � debajo de cada elemento aparece el cambio aplicado

## Atributos que se modifican

| Nodo | Atributo | Ejemplo de cambio |
|------|----------|-------------------|
| `<a>` | `href` | `https://www.google.com` ? `https://www.bing.com` |
| `<img>` | `src` | foto id/237 ? id/1025 |
| `<button>` | `disabled` | `false` ? `true` |
| `<input>` | `value` | `(vac�o)` ? `Valor modificado` |
| `<div>` | `id` | `mi-div-original` ? `mi-div-modificado` |

## C�mo correrlo

```bash
npm install
node server.js
# http://localhost:3004
```

## Uso

1. Click en **Crear nodos**
2. Click en **Modificar atributos**
3. Revisar el panel "Cambios realizados" y el texto bajo cada nodo

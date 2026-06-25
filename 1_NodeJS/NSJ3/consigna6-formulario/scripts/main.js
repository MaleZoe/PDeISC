import { initTheme, toggleTheme } from '../Context/theme.js';
import { validarNombre, validarEmail, validarEdad, calcularEdad, formatearFecha } from '../modules/validador.js';

initTheme();
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

// lógica del botón para subir arriba
const scrollBtn = document.getElementById('scroll-top');
if (scrollBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

const form = document.getElementById('form-reg');
const tabla = document.getElementById('tabla');
const inputs = form.querySelectorAll('input');

const counter = document.getElementById('counter');
const emptyState = document.getElementById('empty-state');

let data = [];
let editId = null;

const setError = (el, msg) => {
    const err = document.getElementById(`err-${el.id}`);
    if (msg) {
        el.classList.add('is-invalid');
        if (err) err.textContent = msg;
    } else {
        el.classList.remove('is-invalid');
        el.classList.add('is-valid');
    }
};

inputs.forEach(i => {
    i.addEventListener('input', () => {
        if (i.id === 'nombre') setError(i, validarNombre(i.value));
        if (i.id === 'email') setError(i, validarEmail(i.value));
        if (i.id === 'legajo') {
            const val = i.value;
            if (!val) setError(i, "Obligatorio");
            else if (val < 1) setError(i, "Mínimo 1");
            else setError(i, "");
        }
    });
});

const render = () => {
    tabla.innerHTML = '';
    if (data.length === 0) {
        tabla.appendChild(emptyState);
    } else {
        data.forEach(d => {
            const tr = document.createElement('tr');
            tr.className = 'fade-in';
            tr.innerHTML = `
                <td class="ps-4 text-muted small">#${d.legajo}</td>
                <td>
                    <div class="d-flex align-items-center gap-3">
                        <div class="avatar bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center" style="width: 35px; height: 35px;">
                            <i class="bi bi-person"></i>
                        </div>
                        <div>
                            <div class="fw-bold">${d.nombre}</div>
                            <div class="text-muted small">${d.email}</div>
                        </div>
                    </div>
                </td>
                <td><span class="badge bg-secondary-subtle">${d.materia}</span></td>
                <td class="text-end pe-4">
                    <button class="btn btn-sm btn-outline-secondary border-0 text-warning btn-edit" data-id="${d.id}" title="Editar">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary border-0 text-danger btn-del" data-id="${d.id}" title="Borrar">
                        <i class="bi bi-trash3"></i>
                    </button>
                </td>
            `;
            tabla.appendChild(tr);
        });
    }

    // Actualizar contador
    counter.textContent = `${data.length} Usuario${data.length !== 1 ? 's' : ''}`;

    // eventos
    tabla.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => edit(btn.dataset.id));
    });
    tabla.querySelectorAll('.btn-del').forEach(btn => {
        btn.addEventListener('click', () => del(btn.dataset.id));
    });
};

const del = (id) => {
    data = data.filter(d => d.id !== id);
    render();
};

const edit = (id) => {
    const d = data.find(x => x.id === id);
    if (d) {
        document.getElementById('nombre').value = d.nombre;
        document.getElementById('email').value = d.email;
        document.getElementById('legajo').value = d.legajo;
        document.getElementById('materia').value = d.materia;
        document.querySelector(`input[name="gen"][value="${d.genero}"]`).checked = true;
        editId = id;
        form.querySelector('button[type="submit"]').textContent = 'Actualizar';
    }
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombreVal = document.getElementById('nombre').value;
    const emailVal = document.getElementById('email').value;
    const legajoVal = document.getElementById('legajo').value;
    const materiaVal = document.getElementById('materia').value;

    const vN = validarNombre(nombreVal);
    let vE = validarEmail(emailVal);
    let vL = !legajoVal ? "Obligatorio" : (legajoVal < 1 ? "Mínimo 1" : "");

    // Validación de email duplicado
    if (!vE) {
        const existeEmail = data.find(x => x.email.toLowerCase() === emailVal.toLowerCase() && x.id !== editId);
        if (existeEmail) vE = "Email ya registrado";
    }

    // Validación de legajo duplicado
    if (!vL) {
        const existeLegajo = data.find(x => x.legajo === legajoVal && x.id !== editId);
        if (existeLegajo) vL = "Legajo ya registrado";
    }

    if (vN || vE || vL) {
        setError(document.getElementById('nombre'), vN);
        setError(document.getElementById('email'), vE);
        setError(document.getElementById('legajo'), vL);
        return;
    }

    const obj = {
        id: editId || Date.now().toString(),
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        legajo: document.getElementById('legajo').value,
        materia: document.getElementById('materia').value,
        genero: form.querySelector('input[name="gen"]:checked').value,
        creado: editId ? data.find(x => x.id === editId).creado : formatearFecha(new Date())
    };

    if (editId) {
        data = data.map(x => x.id === editId ? obj : x);
        editId = null;
    } else {
        data.push(obj);
    }
    form.reset();
    inputs.forEach(i => i.classList.remove('is-valid', 'is-invalid'));
    render();
});

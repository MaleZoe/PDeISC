// Estado inicial
const initialState = {
    theme: 'dark',
    user: {
        xp: 0,
        level: 1
    },
    tasks: [],
    habits: []
};

// Referencias a elementos del DOM
const DOM = {
    themeToggle: document.getElementById('theme-toggle'),
    menuToggle: document.getElementById('menu-toggle'),
    closeSidebar: document.getElementById('close-sidebar'),
    sidebar: document.getElementById('sidebar'),
    currentDate: document.getElementById('current-date'),
    
    // User Stats
    userLevel: document.getElementById('user-level'),
    userXp: document.getElementById('user-xp'),
    nextLevelXp: document.getElementById('next-level-xp'),
    xpBar: document.getElementById('xp-bar'),
    
    // Dashboard Stats
    statTasks: document.getElementById('stat-tasks'),
    statHabits: document.getElementById('stat-habits'),
    statStreak: document.getElementById('stat-streak'),
    statProductivity: document.getElementById('stat-productivity'),
    
    // Tasks
    taskForm: document.getElementById('task-form'),
    taskList: document.getElementById('task-list'),
    taskSearch: document.getElementById('task-search'),
    taskFilter: document.getElementById('task-filter'),
    
    // Habits
    btnAddHabit: document.getElementById('btn-add-habit'),
    habitCreator: document.getElementById('habit-creator'),
    habitForm: document.getElementById('habit-form'),
    btnCancelHabit: document.getElementById('btn-cancel-habit'),
    habitTableHeader: document.getElementById('habit-table-header'),
    habitTableBody: document.getElementById('habit-table-body'),
    
    // Toasts
    toastContainer: document.getElementById('toast-container')
};

// Variables Globales
let state = JSON.parse(localStorage.getItem('nexTrackState')) || initialState;
let charts = { compliance: null, weekly: null };
const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
const currentDay = new Date().getDate();

// Inicialización
function init() {
    setTheme(state.theme);
    updateDateDisplay();
    renderTasks();
    renderHabitTable();
    updateUserStats();
    initCharts();
    setupEventListeners();
    updateDashboardStats();
}

// Persistencia
function saveState() {
    localStorage.setItem('nexTrackState', JSON.stringify(state));
    updateUserStats();
    updateDashboardStats();
}

// --- UTILIDADES ---
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${message}</span>`;
    DOM.toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

function updateDateDisplay() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    DOM.currentDate.textContent = new Date().toLocaleDateString('es-ES', options);
}

function setTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    DOM.themeToggle.innerHTML = theme === 'dark' 
        ? '<i class="fa-solid fa-sun"></i> Modo Claro' 
        : '<i class="fa-solid fa-moon"></i> Modo Oscuro';
    saveState();
    if(charts.compliance) updateChartsColor();
}

function addXP(amount) {
    state.user.xp += amount;
    const xpNeeded = state.user.level * 100;
    
    if (state.user.xp >= xpNeeded) {
        state.user.level++;
        state.user.xp -= xpNeeded;
        showToast(`¡Subiste de nivel! Nivel ${state.user.level}`);
    }
    
    // Evitar XP negativo
    if (state.user.xp < 0) {
        if(state.user.level > 1) {
            state.user.level--;
            state.user.xp += (state.user.level * 100);
        } else {
            state.user.xp = 0;
        }
    }
    
    saveState();
}

function updateUserStats() {
    const xpNeeded = state.user.level * 100;
    DOM.userLevel.textContent = state.user.level;
    DOM.userXp.textContent = state.user.xp;
    DOM.nextLevelXp.textContent = xpNeeded;
    DOM.xpBar.style.width = `${(state.user.xp / xpNeeded) * 100}%`;
}

// --- TAREAS ---
function renderTasks() {
    DOM.taskList.innerHTML = '';
    const filter = DOM.taskFilter.value;
    const search = DOM.taskSearch.value.toLowerCase();
    
    let filteredTasks = state.tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(search);
        const matchesFilter = filter === 'all' ? true : 
                              filter === 'completed' ? task.completed : !task.completed;
        return matchesSearch && matchesFilter;
    });

    if (filteredTasks.length === 0) {
        DOM.taskList.innerHTML = `<p style="text-align:center; color:var(--text-secondary); padding: 20px;">No hay tareas que mostrar.</p>`;
        return;
    }

    filteredTasks.forEach(task => {
        const el = document.createElement('div');
        el.className = `task-item priority-${task.priority} ${task.completed ? 'completed' : ''}`;
        el.innerHTML = `
            <div class="task-content">
                <input type="checkbox" class="custom-checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask('${task.id}')">
                <div class="task-details">
                    <span class="task-title-text">${task.title}</span>
                    <div class="task-meta">
                        <span><i class="fa-solid fa-tag"></i> ${task.category}</span>
                        ${task.time ? `<span><i class="fa-regular fa-clock"></i> ${task.time}</span>` : ''}
                    </div>
                </div>
            </div>
            <div class="task-actions">
                <button class="btn-icon" onclick="deleteTask('${task.id}')"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        DOM.taskList.appendChild(el);
    });
}

function toggleTask(id) {
    const task = state.tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        if(task.completed) {
            addXP(10);
            showToast('Tarea completada +10 XP');
        } else {
            addXP(-10);
        }
        saveState();
        renderTasks();
    }
}

function deleteTask(id) {
    state.tasks = state.tasks.filter(t => t.id !== id);
    saveState();
    renderTasks();
}

// --- HÁBITOS ---
function renderHabitTable() {
    // Render Header
    let headers = '<th>Hábito</th>';
    for (let i = 1; i <= daysInMonth; i++) {
        headers += `<th style="${i === currentDay ? 'color: var(--accent-blue);' : ''}">${i}</th>`;
    }
    DOM.habitTableHeader.innerHTML = headers;

    // Render Body
    DOM.habitTableBody.innerHTML = '';
    
    if (state.habits.length === 0) {
        DOM.habitTableBody.innerHTML = `<tr><td colspan="${daysInMonth + 1}" style="text-align:center; color:var(--text-secondary);">No tienes hábitos registrados.</td></tr>`;
        return;
    }

    state.habits.forEach((habit, index) => {
        const tr = document.createElement('tr');
        
        let rowHtml = `
            <td class="habit-name-cell">
                <span>${habit.name}</span>
                <span class="habit-streak"><i class="fa-solid fa-fire"></i> ${habit.streak}</span>
            </td>
        `;
        
        for (let day = 1; day <= daysInMonth; day++) {
            const isDone = habit.history[day];
            const isFuture = day > currentDay;
            rowHtml += `
                <td>
                    <div class="habit-cell ${isDone ? 'done' : ''}" 
                         ${isFuture ? 'style="opacity: 0.2; cursor: not-allowed;"' : `onclick="toggleHabitDay(${index}, ${day})"`}>
                    </div>
                </td>
            `;
        }
        tr.innerHTML = rowHtml;
        DOM.habitTableBody.appendChild(tr);
    });
}

window.toggleHabitDay = function(habitIndex, day) {
    if (day > currentDay) return; // No marcar días futuros
    
    const habit = state.habits[habitIndex];
    habit.history[day] = !habit.history[day];
    
    // Recalcular racha (streak)
    let currentStreak = 0;
    for(let i = currentDay; i >= 1; i--) {
        if(habit.history[i]) {
            currentStreak++;
        } else {
            break;
        }
    }
    habit.streak = currentStreak;
    
    if(habit.history[day]) {
        addXP(15);
        showToast('Hábito cumplido +15 XP');
    } else {
        addXP(-15);
    }
    
    saveState();
    renderHabitTable();
};

// --- DASHBOARD & GRÁFICOS ---
function updateDashboardStats() {
    // Tareas hoy
    const totalTasks = state.tasks.length;
    const completedTasks = state.tasks.filter(t => t.completed).length;
    DOM.statTasks.textContent = `${completedTasks}/${totalTasks}`;
    
    // Hábitos hoy
    const totalHabits = state.habits.length;
    const completedHabitsToday = state.habits.filter(h => h.history[currentDay]).length;
    DOM.statHabits.textContent = `${completedHabitsToday}/${totalHabits}`;
    
    // Racha Total (mayor racha de hábitos)
    const maxStreak = state.habits.reduce((max, h) => Math.max(max, h.streak), 0);
    DOM.statStreak.textContent = `${maxStreak} Días`;
    
    // Productividad (mix de tareas y hábitos)
    const taskRatio = totalTasks === 0 ? 0 : completedTasks / totalTasks;
    const habitRatio = totalHabits === 0 ? 0 : completedHabitsToday / totalHabits;
    let prodPercentage = 0;
    if(totalTasks === 0 && totalHabits === 0) prodPercentage = 0;
    else if (totalTasks === 0) prodPercentage = habitRatio * 100;
    else if (totalHabits === 0) prodPercentage = taskRatio * 100;
    else prodPercentage = ((taskRatio + habitRatio) / 2) * 100;
    
    DOM.statProductivity.textContent = `${Math.round(prodPercentage)}%`;
    
    updateCharts(completedTasks, totalTasks - completedTasks, completedHabitsToday, totalHabits - completedHabitsToday);
}

function initCharts() {
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim();
    
    Chart.defaults.color = textColor;
    Chart.defaults.font.family = "'Inter', sans-serif";

    // Gráfico Circular (Cumplimiento General)
    const ctxPie = document.getElementById('complianceChart').getContext('2d');
    charts.compliance = new Chart(ctxPie, {
        type: 'doughnut',
        data: {
            labels: ['Completado', 'Pendiente'],
            datasets: [{
                data: [0, 1], // Datos falsos iniciales
                backgroundColor: ['#00ff88', 'rgba(255, 255, 255, 0.1)'],
                borderWidth: 0,
                cutout: '75%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } }
        }
    });

    // Gráfico de Barras (Semanal Falso para visualización)
    const ctxBar = document.getElementById('weeklyChart').getContext('2d');
    charts.weekly = new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            datasets: [{
                label: 'Productividad',
                data: [60, 80, 45, 90, 75, 40, 10], // Datos simulados para demo
                backgroundColor: '#00d2ff',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } },
                x: { grid: { display: false } }
            }
        }
    });
}

function updateCharts(tasksDone, tasksPending, habitsDone, habitsPending) {
    if(!charts.compliance) return;
    
    const totalDone = tasksDone + habitsDone;
    const totalPending = tasksPending + habitsPending;
    
    if (totalDone === 0 && totalPending === 0) {
        charts.compliance.data.datasets[0].data = [0, 1];
    } else {
        charts.compliance.data.datasets[0].data = [totalDone, totalPending];
    }
    charts.compliance.update();
}

function updateChartsColor() {
    const isDark = state.theme === 'dark';
    const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
    const emptyColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim();
    
    Chart.defaults.color = textColor;
    
    if(charts.compliance) {
        charts.compliance.data.datasets[0].backgroundColor[1] = emptyColor;
        charts.compliance.update();
    }
    
    if(charts.weekly) {
        charts.weekly.options.scales.y.grid.color = gridColor;
        charts.weekly.update();
    }
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
    // Theme
    DOM.themeToggle.addEventListener('click', () => {
        setTheme(state.theme === 'dark' ? 'light' : 'dark');
    });

    // Mobile Menu
    DOM.menuToggle.addEventListener('click', () => DOM.sidebar.classList.add('open'));
    DOM.closeSidebar.addEventListener('click', () => DOM.sidebar.classList.remove('open'));

    // Nav Items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            if(window.innerWidth <= 768) DOM.sidebar.classList.remove('open');
        });
    });

    // Tasks Form
    DOM.taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('task-title').value;
        const category = document.getElementById('task-category').value;
        const priority = document.getElementById('task-priority').value;
        const time = document.getElementById('task-time').value;

        if (!title.trim()) return;

        const newTask = {
            id: Date.now().toString(),
            title,
            category,
            priority,
            time,
            completed: false
        };

        state.tasks.push(newTask);
        saveState();
        renderTasks();
        DOM.taskForm.reset();
        showToast('Tarea agregada exitosamente');
    });

    DOM.taskSearch.addEventListener('input', renderTasks);
    DOM.taskFilter.addEventListener('change', renderTasks);

    // Habits Form
    DOM.btnAddHabit.addEventListener('click', () => {
        DOM.habitCreator.classList.remove('hidden');
    });

    DOM.btnCancelHabit.addEventListener('click', () => {
        DOM.habitCreator.classList.add('hidden');
        DOM.habitForm.reset();
    });

    DOM.habitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('habit-name').value;
        if (!name.trim()) return;

        const newHabit = {
            id: Date.now().toString(),
            name,
            streak: 0,
            history: {} // Objeto { 1: true, 2: false, 3: true, ... }
        };

        state.habits.push(newHabit);
        saveState();
        renderHabitTable();
        DOM.habitCreator.classList.add('hidden');
        DOM.habitForm.reset();
        showToast('Hábito creado exitosamente');
    });
}

// Arrancar app
init();

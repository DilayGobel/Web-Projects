document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    let currentFilter = 'all'; // 'all', 'active', 'completed'

    // --- LOCALSTORAGE DATA MANAGEMENT ---
    const getTasks = () => JSON.parse(localStorage.getItem('tasks')) || [];
    const saveTasks = (tasks) => localStorage.setItem('tasks', JSON.stringify(tasks));
    const getTotalTime = () => parseInt(localStorage.getItem('totalWorkTime')) || 0;
    const saveTotalTime = (time) => localStorage.setItem('totalWorkTime', time);
    const getActiveTimer = () => JSON.parse(localStorage.getItem('activeTimer'));
    const saveActiveTimer = (timerData) => localStorage.setItem('activeTimer', JSON.stringify(timerData));
    const clearActiveTimer = () => localStorage.removeItem('activeTimer');

    // --- PAGE ROUTING ---
    if (path.endsWith('index.html') || path.endsWith('/')) {
        if (!handleActiveTimerOnHomepage()) {
            displayTotalTime();
        }
        displayTasks();
        setupFilters();
    } else if (path.endsWith('gorev-ekle.html')) {
        setupAddTaskForm();
    } else if (path.endsWith('gorev-duzenle.html')) {
        setupEditTaskForm();
    } else if (path.endsWith('sayac.html')) {
        setupCounterPage();
    }

    // --- INDEX.HTML FUNCTIONS ---
    function handleActiveTimerOnHomepage() {
        const activeTimer = getActiveTimer();
        const summaryBox = document.querySelector('.summary-box');
        if (!activeTimer || !summaryBox) {
            return false; // Aktif sayaç yok, varsayılanı göster.
        }

        summaryBox.innerHTML = `
            <h2>Çalışma Devam Ediyor...</h2>
            <div id="home-timer-display" class="timer-display-home"></div>
            <a href="sayac.html" class="go-to-timer-btn">Sayaca Git</a>
        `;
        const display = document.getElementById('home-timer-display');
        let homeInterval;

        function updateHomeDisplay() {
            const currentTimer = getActiveTimer();
            if (!currentTimer) {
                clearInterval(homeInterval);
                window.location.reload(); // Sayaç durdu, sayfayı yenile.
                return;
            }

            const elapsedSeconds = Math.floor((Date.now() - currentTimer.startTime) / 1000);

            if (currentTimer.type === 'pomodoro') {
                const remainingSeconds = currentTimer.duration - elapsedSeconds;
                if (remainingSeconds < 0) {
                    clearInterval(homeInterval);
                    alert('Süre doldu!');
                    const minutesWorked = Math.ceil(currentTimer.duration / 60);
                    saveTotalTime(getTotalTime() + minutesWorked);
                    clearActiveTimer();
                } else {
                    const minutes = Math.floor(remainingSeconds / 60);
                    const seconds = remainingSeconds % 60;
                    display.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                }
            } else { // stopwatch
                const hours = Math.floor(elapsedSeconds / 3600);
                const minutes = Math.floor((elapsedSeconds % 3600) / 60);
                const seconds = elapsedSeconds % 60;
                display.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            }
        }

        updateHomeDisplay();
        homeInterval = setInterval(updateHomeDisplay, 1000);

        return true; // Aktif sayaç işleniyor.
    }

    function displayTotalTime() {
        const timeElement = document.getElementById('total-work-time');
        if (timeElement) {
            timeElement.textContent = getTotalTime();
        }
    }

    function displayTasks() {
        const taskList = document.getElementById('task-list');
        const noTasksMessage = document.getElementById('no-tasks-message');
        if (!taskList) return;

        const allTasks = getTasks();
        const filteredTasks = allTasks.filter(task => {
            if (currentFilter === 'active') return !task.completed;
            if (currentFilter === 'completed') return task.completed;
            return true; // for 'all'
        });

        taskList.innerHTML = '';

        if (filteredTasks.length === 0) {
            noTasksMessage.style.display = 'block';
            if (allTasks.length > 0) {
                noTasksMessage.textContent = 'Bu filtrede gösterilecek görev yok.';
            } else {
                noTasksMessage.textContent = 'Henüz görev eklenmemiş. İlk görevinizi ekleyin!';
            }
        } else {
            noTasksMessage.style.display = 'none';
            filteredTasks.forEach(task => {
                const li = document.createElement('li');
                li.className = `task-item ${task.completed ? 'completed' : ''}`;
                li.setAttribute('data-id', task.id);

                li.innerHTML = `
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                    <div class="task-content">
                        <div class="task-title">${escapeHTML(task.title)}</div>
                        <div class="task-details">${escapeHTML(task.details)}</div>
                    </div>
                    <div class="task-actions">
                        <a href="gorev-duzenle.html?id=${task.id}" class="edit-btn" title="Düzenle"><i class="fas fa-pencil-alt"></i></a>
                        <button class="delete-btn" title="Sil"><i class="fas fa-trash-alt"></i></button>
                    </div>
                `;
                taskList.appendChild(li);
            });
        }

        addEventListenersToTasks();
    }

    function addEventListenersToTasks() {
        document.querySelectorAll('.task-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const taskId = parseInt(e.target.closest('.task-item').dataset.id);
                toggleTaskCompletion(taskId);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const taskId = parseInt(e.target.closest('.task-item').dataset.id);
                if (confirm('Bu görevi silmek istediğinizden emin misiniz?')) {
                    deleteTask(taskId);
                }
            });
        });
    }

    function setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                currentFilter = button.dataset.filter;
                displayTasks();
            });
        });
    }

    function toggleTaskCompletion(id) {
        let tasks = getTasks();
        tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
        saveTasks(tasks);
        displayTasks();
    }

    function deleteTask(id) {
        let tasks = getTasks();
        tasks = tasks.filter(task => task.id !== id);
        saveTasks(tasks);
        displayTasks();
    }

    // --- GOREV-EKLE.HTML FUNCTIONS ---
    function setupAddTaskForm() {
        const form = document.getElementById('add-task-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('task-title').value;
            const details = document.getElementById('task-details').value;

            const newTask = {
                id: Date.now(),
                title,
                details,
                completed: false
            };

            const tasks = getTasks();
            tasks.push(newTask);
            saveTasks(tasks);

            alert('Görev başarıyla eklendi!');
            window.location.href = 'index.html';
        });
    }

    // --- GOREV-DUZENLE.HTML FUNCTIONS ---
    function setupEditTaskForm() {
        const form = document.getElementById('edit-task-form');
        const titleInput = document.getElementById('task-title');
        const detailsInput = document.getElementById('task-details');

        const params = new URLSearchParams(window.location.search);
        const taskId = parseInt(params.get('id'));

        const tasks = getTasks();
        const taskToEdit = tasks.find(task => task.id === taskId);

        if (!taskToEdit) {
            alert('Görev bulunamadı.');
            window.location.href = 'index.html';
            return;
        }

        titleInput.value = taskToEdit.title;
        detailsInput.value = taskToEdit.details;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            taskToEdit.title = titleInput.value;
            taskToEdit.details = detailsInput.value;

            const updatedTasks = tasks.map(task => task.id === taskId ? taskToEdit : task);
            saveTasks(updatedTasks);

            alert('Görev başarıyla güncellendi!');
            window.location.href = 'index.html';
        });
    }

    // --- SAYAC.HTML FUNCTIONS ---
    function setupCounterPage() {
        // Mode switching
        const pomodoroModeBtn = document.getElementById('pomodoro-mode-btn');
        const stopwatchModeBtn = document.getElementById('stopwatch-mode-btn');
        const pomodoroTimer = document.getElementById('pomodoro-timer');
        const stopwatchTimer = document.getElementById('stopwatch-timer');

        pomodoroModeBtn.addEventListener('click', () => {
            pomodoroTimer.classList.add('active');
            stopwatchTimer.classList.remove('active');
            pomodoroModeBtn.classList.add('active');
            stopwatchModeBtn.classList.remove('active');
        });

        stopwatchModeBtn.addEventListener('click', () => {
            stopwatchTimer.classList.add('active');
            pomodoroTimer.classList.remove('active');
            stopwatchModeBtn.classList.add('active');
            pomodoroModeBtn.classList.remove('active');
        });

        // Pomodoro Logic
        const pomodoroDisplay = document.getElementById('pomodoro-display');
        let pomodoroInterval;
        let pomodoroDuration = 25 * 60; // Mevcut oturumun süresi

        // Stopwatch Logic
        const stopwatchDisplay = document.getElementById('stopwatch-display');
        let stopwatchInterval;

        // --- PAYLAŞILAN SAYAÇ MANTIĞI ---
        function updateDisplays() {
            const activeTimer = getActiveTimer();
            if (!activeTimer) {
                clearInterval(pomodoroInterval);
                clearInterval(stopwatchInterval);
                return;
            }

            const elapsedSeconds = Math.floor((Date.now() - activeTimer.startTime) / 1000);

            if (activeTimer.type === 'pomodoro' && pomodoroTimer.classList.contains('active')) {
                const remainingSeconds = activeTimer.duration - elapsedSeconds;
                if (remainingSeconds >= 0) {
                    updatePomodoroDisplay(remainingSeconds);
                } else {
                    clearInterval(pomodoroInterval);
                    alert('Süre doldu!');
                    const minutesWorked = Math.ceil(activeTimer.duration / 60);
                    saveTotalTime(getTotalTime() + minutesWorked);
                    clearActiveTimer();
                    pomodoroDuration = 25 * 60; // Varsayılana dön
                    updatePomodoroDisplay(pomodoroDuration);
                }
            } else if (activeTimer.type === 'stopwatch' && stopwatchTimer.classList.contains('active')) {
                updateStopwatchDisplay(elapsedSeconds);
            }
        }

        function updatePomodoroDisplay(timeInSeconds) {
            const minutes = Math.floor(timeInSeconds / 60);
            const seconds = timeInSeconds % 60;
            pomodoroDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }

        function updateStopwatchDisplay(timeInSeconds) {
            const hours = Math.floor(timeInSeconds / 3600);
            const minutes = Math.floor((timeInSeconds % 3600) / 60);
            const seconds = timeInSeconds % 60;
            stopwatchDisplay.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }

        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                clearInterval(pomodoroInterval);
                clearActiveTimer();
                pomodoroDuration = parseInt(btn.dataset.time) * 60;
                updatePomodoroDisplay(pomodoroDuration);
            });
        });

        document.getElementById('pomodoro-start').addEventListener('click', () => {
            if (getActiveTimer()) return; // Başka bir sayaç çalışıyorsa başlatma
            saveActiveTimer({ type: 'pomodoro', startTime: Date.now(), duration: pomodoroDuration });
            clearInterval(pomodoroInterval);
            pomodoroInterval = setInterval(updateDisplays, 1000);
            updateDisplays();
        });

        document.getElementById('pomodoro-pause').addEventListener('click', () => {
            clearInterval(pomodoroInterval);
            clearActiveTimer();
        });

        document.getElementById('pomodoro-reset').addEventListener('click', () => {
            clearInterval(pomodoroInterval);
            clearActiveTimer();
            pomodoroDuration = 25 * 60;
            updatePomodoroDisplay(pomodoroDuration);
        });

        document.getElementById('stopwatch-start').addEventListener('click', () => {
            if (getActiveTimer()) return;
            saveActiveTimer({ type: 'stopwatch', startTime: Date.now() });
            clearInterval(stopwatchInterval);
            stopwatchInterval = setInterval(updateDisplays, 1000);
            updateDisplays();
        });

        document.getElementById('stopwatch-stop').addEventListener('click', () => {
            const activeTimer = getActiveTimer();
            if (activeTimer && activeTimer.type === 'stopwatch') {
                clearInterval(stopwatchInterval);
                const elapsedSeconds = Math.floor((Date.now() - activeTimer.startTime) / 1000);
                if (elapsedSeconds > 0) {
                    const minutesWorked = Math.ceil(elapsedSeconds / 60);
                    saveTotalTime(getTotalTime() + minutesWorked);
                    alert(`${minutesWorked} dakika çalışma süreniz kaydedildi.`);
                }
                clearActiveTimer();
                updateStopwatchDisplay(0);
            }
        });

        document.getElementById('stopwatch-reset').addEventListener('click', () => {
            clearInterval(stopwatchInterval);
            clearActiveTimer();
            updateStopwatchDisplay(0);
        });

        // Sayfa yüklendiğinde aktif bir sayaç var mı kontrol et
        const activeTimer = getActiveTimer();
        if (activeTimer) {
            if (activeTimer.type === 'pomodoro') {
                pomodoroTimer.classList.add('active');
                stopwatchTimer.classList.remove('active');
                pomodoroModeBtn.classList.add('active');
                stopwatchModeBtn.classList.remove('active');
                pomodoroDuration = activeTimer.duration;
                pomodoroInterval = setInterval(updateDisplays, 1000);
                updateDisplays();
            } else {
                stopwatchTimer.classList.add('active');
                pomodoroTimer.classList.remove('active');
                stopwatchModeBtn.classList.add('active');
                pomodoroModeBtn.classList.remove('active');
                stopwatchInterval = setInterval(updateDisplays, 1000);
                updateDisplays();
            }
        }
    }

    // --- UTILITY FUNCTIONS ---
    function escapeHTML(str) {
        if (str === null || str === undefined) return '';
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }
});
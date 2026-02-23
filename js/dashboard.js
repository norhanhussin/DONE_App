// 1. مصفوفة الرسائل التشجيعية الفضائية
const spaceMessages = [
    "بطل! لقد انطلقت بمهمتك إلى المجرّة 🚀",
    "مذهل! لقد تجاوزت سرعة الضوء في الإنجاز ✨",
    "رائع! أنت الآن نجم ساطع في سماء الإنتاجية 🌟",
    "تمت المهمة بنجاح.. المحطة القادمة هي المريخ! 👨‍🚀",
    "أداء فضائي لا يعلى عليه! استمر في التحليق 🛰️",
    "قوة الدفع لديك مذهلة! لقد هبطت المهمة بسلام 🛸"
];

// 2. جلب البيانات والاسم من LocalStorage
let tasks = JSON.parse(localStorage.getItem('done_tasks')) || [];
let userName = localStorage.getItem('done_user_name');

// 3. تشغيل الدوال الأساسية عند تحميل الصفحة
window.onload = () => {
    checkUser();                // التأكد من الاسم (يا عسل)
    renderTasks();              // عرض المهام بالحركات
    requestNotificationPermission(); // طلب إذن الإشعارات
};

// 4. دالة التأكد من اسم المستخدم (نظام الترحيب الشخصي)
function checkUser() {
    if (!userName) {
        Swal.fire({
            title: 'أهلاً بكِ في مَجرتنا! 🌌',
            text: 'اسمك إيه يا عسل؟',
            input: 'text',
            inputPlaceholder: 'اكتبي اسمك هنا...',
            allowOutsideClick: false,
            background: '#0f172a',
            color: '#fff',
            confirmButtonText: 'انطلاق 🚀',
            confirmButtonColor: '#3b82f6',
            showClass: { popup: 'animate__animated animate__zoomIn' },
            preConfirm: (name) => {
                if (!name) {
                    Swal.showValidationMessage('لازم تقولي اسمك عشان نبدأ الرحلة!');
                }
                return name;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                userName = result.value;
                localStorage.setItem('done_user_name', userName);
                updateGreeting();
            }
        });
    } else {
        updateGreeting();
    }
}

function updateGreeting() {
    const greetingEl = document.getElementById('userGreeting');
    if (greetingEl) {
        greetingEl.innerHTML = `قائد الرحلة: ${userName} 👋`;
    }
}

// 5. نظام الإشعارات
function requestNotificationPermission() {
    if ("Notification" in window) {
        if (Notification.permission !== "granted" && Notification.permission !== "denied") {
            Notification.requestPermission();
        }
    }
}

function sendSpaceNotification(title, body) {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, {
            body: body,
            icon: 'https://cdn-icons-png.flaticon.com/512/2026/2026510.png'
        });
    }
}

// 6. دالة عرض المهام (مع إضافة الأنيميشن الاحترافي)
function renderTasks() {
    const todoList = document.getElementById('todoList');
    const doingList = document.getElementById('doingList');
    const doneList = document.getElementById('doneList');

    todoList.innerHTML = '';
    doingList.innerHTML = '';
    doneList.innerHTML = '';

    // حالة لو مفيش مهام (Empty State)
    if (tasks.length === 0) {
        todoList.innerHTML = `
            <div class="text-center py-4 animate__animated animate__fadeIn">
                <dotlottie-player src="https://lottie.host/7e997621-1250-48e0-8809-543503299719/N1V8B5m3V2.json" background="transparent" speed="1" style="width: 150px; height: 150px; margin: 0 auto;" loop autoplay></dotlottie-player>
                <p class="text-info mt-2 small">المجرة هادئة اليوم.. لا توجد أهداف!</p>
            </div>`;
    }

    tasks.forEach((task, index) => {
        const isDone = task.status === 'done';
        const iconClass = isDone ? 'fas fa-check-circle text-success' : 'fas fa-rocket text-primary';
        
        // أضفنا كلاس animate__backInUp عشان الكروت تطلع بشكل احترافي
        const taskHTML = `
            <div class="task-card priority-${task.priority} animate__animated animate__backInUp" style="animation-delay: ${index * 0.1}s">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <div class="task-title ${isDone ? 'text-decoration-line-through opacity-50' : ''}">${task.title}</div>
                    <i class="${iconClass}" style="filter: drop-shadow(0 0 5px currentColor);"></i>
                </div>
                <p class="task-desc mb-3 ${isDone ? 'opacity-50' : ''}">${task.desc}</p>
                <div class="d-flex justify-content-between align-items-center border-top pt-3 border-secondary border-opacity-25">
                    <small class="text-info opacity-75"><i class="far fa-calendar-alt me-1"></i> ${task.date}</small>
                    <div class="task-actions">
                        ${!isDone ? `
                        <button class="btn btn-sm btn-outline-info rounded-pill border-0" onclick="changeStatus(${task.id})">
                            <i class="fas fa-arrow-left"></i>
                        </button>` : ''}
                        <button class="btn btn-sm btn-outline-danger rounded-pill border-0 ms-1" onclick="deleteTask(${task.id})">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        if (task.status === 'todo') todoList.innerHTML += taskHTML;
        else if (task.status === 'doing') doingList.innerHTML += taskHTML;
        else if (task.status === 'done') doneList.innerHTML += taskHTML;
    });

    updateStats();
    localStorage.setItem('done_tasks', JSON.stringify(tasks));
}

// 7. إضافة مهمة جديدة
function addNewTask() {
    Swal.fire({
        title: 'بروتوكول مهمة جديدة',
        html: `
            <input type="text" id="tTitle" class="swal2-input" placeholder="عنوان الهدف">
            <textarea id="tDesc" class="swal2-textarea" placeholder="وصف الإحداثيات"></textarea>
            <select id="tPriority" class="swal2-input">
                <option value="low">أولوية: منخفضة</option>
                <option value="medium">أولوية: متوسطة</option>
                <option value="high">أولوية: قصوى 🔥</option>
            </select>
        `,
        confirmButtonText: 'إطلاق 🚀',
        background: '#0f172a',
        color: '#fff',
        showClass: { popup: 'animate__animated animate__fadeInDown' },
        preConfirm: () => {
            const title = document.getElementById('tTitle').value;
            if (!title) return Swal.showValidationMessage('يجب تسمية الهدف أولاً!');
            return { title, desc: document.getElementById('tDesc').value, priority: document.getElementById('tPriority').value };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            tasks.push({
                id: Date.now(),
                ...result.value,
                status: 'todo',
                date: new Date().toLocaleDateString('ar-EG')
            });
            renderTasks();
        }
    });
}

// 8. تغيير الحالة والإشعارات
function changeStatus(id) {
    const idx = tasks.findIndex(t => t.id === id);
    
    if (tasks[idx].status === 'todo') {
        tasks[idx].status = 'doing';
    } else if (tasks[idx].status === 'doing') {
        tasks[idx].status = 'done';
        
        const msg = spaceMessages[Math.floor(Math.random() * spaceMessages.length)];
        
        Swal.fire({
            title: 'تم الهبوط بنجاح ✅',
            text: msg,
            icon: 'success',
            background: '#0f172a',
            color: '#fff',
            timer: 2500,
            showConfirmButton: false,
            showClass: { popup: 'animate__animated animate__tada' } // حركة احتفالية
        });

        sendSpaceNotification("مهمة مكتملة! 🚀", `عاش يا ${userName}! ${msg}`);
    }
    renderTasks();
}

// 9. حذف المهمة مع أنيميشن خروج
function deleteTask(id) {
    Swal.fire({
        title: 'هل تريد إلغاء المهمة؟',
        text: "لا يمكن استعادة البيانات من الثقب الأسود!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#3b82f6',
        confirmButtonText: 'حذف النهائياً',
        cancelButtonText: 'تراجع',
        background: '#0f172a',
        color: '#fff'
    }).then((result) => {
        if (result.isConfirmed) {
            tasks = tasks.filter(t => t.id !== id);
            renderTasks();
        }
    });
}

// 10. تحديث الأرقام
function updateStats() {
    document.getElementById('totalTasks').innerText = tasks.length;
    document.getElementById('doingTasks').innerText = tasks.filter(t => t.status === 'doing').length;
    document.getElementById('doneTasks').innerText = tasks.filter(t => t.status === 'done').length;
    
    document.getElementById('todoCount').innerText = tasks.filter(t => t.status === 'todo').length;
    document.getElementById('doingCount').innerText = tasks.filter(t => t.status === 'doing').length;
    document.getElementById('doneCount').innerText = tasks.filter(t => t.status === 'done').length;
}
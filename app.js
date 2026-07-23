// ========== متغیرهای سراسری ==========
let currentUser = null;
const defaultUsername = 'admin';
const defaultPassword = '12345';

// ========== بارگذاری داده‌ها از localStorage ==========
function loadData() {
    return {
        credentials: JSON.parse(localStorage.getItem('credentials')) || {
            username: defaultUsername,
            password: defaultPassword
        },
        projects: JSON.parse(localStorage.getItem('projects')) || [],
        skills: JSON.parse(localStorage.getItem('skills')) || [
            {
                category: '🔒 Security',
                items: ['Penetration Testing', 'Vulnerability Assessment', 'Web App Security']
            },
            {
                category: '💻 Programming',
                items: ['Python', 'JavaScript', 'Bash/Shell', 'SQL']
            },
            {
                category: '🛠️ Tools',
                items: ['Burp Suite', 'Metasploit', 'Wireshark', 'OWASP ZAP']
            }
        ],
        about: localStorage.getItem('about') || 'سلام، من Shadow هستم. یک Security Researcher و Bug Bounty Hunter با تجربه در شناسایی آسیب‌پذیری‌ها.',
        contact: JSON.parse(localStorage.getItem('contact')) || {
            email: 'shadow@example.com',
            phone: '+98 901 234 5678',
            twitter: 'https://twitter.com',
            linkedin: 'https://linkedin.com',
            github: 'https://github.com'
        }
    };
}

// ========== منو هامبرگری ==========
function initMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // بستن منو روی کلیک لینک
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
}

// ========== لاگین ==========
function initMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // بستن منو روی کلیک لینک
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // بستن منو روی کلیک بیرون
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }
}

// ========== بررسی لاگین ==========
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || !user.loggedIn) {
        if (window.location.pathname.includes('admin-dashboard')) {
            window.location.href = 'login.html';
        }
        return false;
    }
    currentUser = user;
    return true;
}

// ========== خروج ==========
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// ========== پروژه‌ها ==========
function showProjectForm() {
    document.getElementById('projectForm').style.display = 'block';
    document.getElementById('projectForm').scrollIntoView({ behavior: 'smooth' });
}

function hideProjectForm() {
    document.getElementById('projectForm').style.display = 'none';
}function handleProjectSubmit(e) {
    e.preventDefault();
    const project = {
        id: Date.now(),
        name: document.getElementById('projectName').value,
        description: document.getElementById('projectDesc').value,
        date: document.getElementById('projectDate').value,
        link: document.getElementById('projectLink').value,
        works: document.getElementById('projectWorks').value.split('\n').filter(w => w.trim())
    };let projects = JSON.parse(localStorage.getItem('projects')) || [];
    projects.push(project);
    localStorage.setItem('projects', JSON.stringify(projects));

    showProjectsList();
    document.getElementById('projectForm').reset();
    hideProjectForm();
}

function showProjectsList() {
    const data = loadData();
    const container = document.getElementById('projectsList');
    
    if (!container) return;

    container.innerHTML = data.projects.map(p => 
        <div class="project-card" onclick="openProjectModal(${p.id})">
            <h3>${p.name}</h3>
            <p>${p.description.substring(0, 100)}...</p>
            <p class="project-date">📅 ${new Date(p.date).toLocaleDateString('fa-IR')}</p>
        </div>
    ).join('');
}

function openProjectModal(id) {
    const data = loadData();
    const project = data.projects.find(p => p.id === id);
    
    if (!project) return;

    const modal = document.getElementById('projectModal');
    const details = document.getElementById('projectDetails');

    details.innerHTML = 
        <h2>${project.name}</h2>
        <p><strong>📝 توضیح:</strong> ${project.description}</p>
        <p><strong>📅 تاریخ:</strong> ${new Date(project.date).toLocaleDateString('fa-IR')}</p>
        <p><strong>🔗 لینک:</strong> <a href="${project.link}" target="_blank" style="color: var(--primary);">${project.link}</a></p>
        <p><strong>✅ کارهای انجام شده:</strong></p>
        <ul style="margin-left: 1.5rem; color: var(--text-light);">
            ${project.works.map(w => <li>• ${w}</li>).join('')}
        </ul>
    ;

    modal.classList.add('active');
}

function closeProjectModal() {
    document.getElementById('projectModal').classList.remove('active');
}

function deleteProject(id) {
    if (confirm('آیا مطمئن هستی؟')) {
        let projects = JSON.parse(localStorage.getItem('projects')) || [];
        projects = projects.filter(p => p.id !== id);
        localStorage.setItem('projects', JSON.stringify(projects));
        showProjectsList();
    }
}

// ========== مهارت‌ها ==========
function showSkillForm() {
    document.getElementById('skillForm').style.display = 'block';
}

function hideSkillForm() {
    document.getElementById('skillForm').style.display = 'none';
}

function handleSkillSubmit(e) {
    e.preventDefault();
    const skill = {
        category: document.getElementById('skillCategory').value,
        items: document.getElementById('skillItems').value.split('\n').filter(i => i.trim())
    };

    let skills = JSON.parse(localStorage.getItem('skills')) || [];
    skills.push(skill);
    localStorage.setItem('skills', JSON.stringify(skills));

    showSkillsList();
    document.getElementById('skillForm').reset();
    hideSkillForm();
}

function showSkillsList() {
    const data = loadData();
    const container = document.getElementById('skillsList');

    if (!container) return;

    if (checkAuth()) {
        container.innerHTML = data.skills.map((s, idx) => 
            <div class="admin-item">
                <div>
                    <strong>${s.category}</strong>
                    <p>${s.items.join(', ')}</p>
                </div>
                <div class="admin-item-actions">
                    <button class="btn-delete" onclick="deleteSkill(${idx})">حذف</button>
                </div>
            </div>
        ).join('');
    } else {
        container.innerHTML = <div class="skills-grid">${
            data.skills.map(s => 
                <div class="skill-category">
                    <h3>${s.category}</h3>
                    <ul>
                        ${s.items.map(item => <li>${item}</li>).join('')}
                    </ul>
                </div>
            ).join('')
        }</div>;
    }
}

function deleteSkill(idx) {
    if (confirm('آیا مطمئن هستی؟')) {
        let skills = JSON.parse(localStorage.getItem('skills')) || [];
        skills.splice(idx, 1);
        localStorage.setItem('skills', JSON.stringify(skills));
        showSkillsList();
    }
}const settingsForm = document.getElementById('settingsForm');
        if (settingsForm) settingsForm.addEventListener('submit', handleSettingsSubmit);

        switchTab('projects');
    }

    // صفحه پروژه‌ها
    if (document.getElementById('projectsList') && !checkAuth()) {
        showProjectsList();
    }

    // صفحه مهارت‌ها
    if (document.getElementById('skillsList')) {
        showSkillsList();
    }

    // صفحه درباره من
    if (document.getElementById('aboutContent')) {
        showAboutContent();
    }

    // صفحه تماس
    if (document.getElementById('contactContent')) {
        showContactContent();
    }

    // بستن Modal روی کلیک بیرون
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
});

// بستن منو روی ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('projectModal');
        if (modal) modal.classList.remove('active');
    }
});// ========== درباره من ==========
function showAboutContent() {
    const data = loadData();
    const container = document.getElementById('aboutContent');

    if (!container) return;

    if (checkAuth()) {
        container.innerHTML = 
            <div class="admin-item">
                <p>${data.about}</p>
            </div>
        ;
    } else {
        container.innerHTML = <p>${data.about}</p>;
    }
}

function handleAboutSubmit(e) {
    e.preventDefault();
    const about = document.getElementById('aboutText').value;
    localStorage.setItem('about', about);
    showAboutContent();
    alert('✅ ذخیره شد!');
}

// ========== تماس ==========
function showContactContent() {
    const data = loadData();
    const container = document.getElementById('contactContent');

    if (!container) return;

    container.innerHTML = 
        <div class="contact-link">
            <span>📧</span>
            <a href="mailto:${data.contact.email}">${data.contact.email}</a>
        </div>
        <div class="contact-link">
            <span>📞</span>
            <a href="tel:${data.contact.phone}">${data.contact.phone}</a>
        </div>
        <div class="contact-link">
            <span>𝕏</span>
            <a href="${data.contact.twitter}" target="_blank">Twitter</a>
        </div>
        <div class="contact-link">
            <span>💼</span>
            <a href="${data.contact.linkedin}" target="_blank">LinkedIn</a>
        </div>
        <div class="contact-link">
            <span>🐙</span>
            <a href="${data.contact.github}" target="_blank">GitHub</a>
        </div>
    ;
}

function handleContactSubmit(e) {
    e.preventDefault();
    const contact = {
        email: document.getElementById('contactEmail').value,
        phone: document.getElementById('contactPhone').value,
        twitter: document.getElementById('contactTwitter').value,
        linkedin: document.getElementById('contactLinkedin').value,
        github: document.getElementById('contactGithub').value
    };

    localStorage.setItem('contact', JSON.stringify(contact));
    showContactContent();
    alert('✅ ذخیره شد!');
}

// ========== تنظیمات ==========
function handleSettingsSubmit(e) {
    e.preventDefault();
    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;

    localStorage.setItem('credentials', JSON.stringify({
        username: newUsername,
        password: newPassword
    }));

    alert('✅ تنظیمات به‌روز شد! لطفا دوباره وارد شو');
    logout();
}

// ========== سوئیچ تب ==========
function switchTab(tab) {
    document.querySelectorAll('.tab-content').forEach(t => {
        t.style.display = 'none';
    });

    const element = document.getElementById(tab + '-tab');
    if (element) {
        element.style.display = 'block';

        if (tab === 'projects') showProjectsList();
        if (tab === 'skills') showSkillsList();
        if (tab === 'about') showAboutContent();
        if (tab === 'contact') showContactContent();
    }
}

// ========== شروع برنامه ==========
document.addEventListener('DOMContentLoaded', () => {
    initMenu();

    // صفحه لاگین
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // داشبورد مدیر
    if (checkAuth()) {
        const projectForm = document.getElementById('projectForm');
        if (projectForm) projectForm.addEventListener('submit', handleProjectSubmit);

        const skillForm = document.getElementById('skillForm');
        if (skillForm) skillForm.addEventListener('submit', handleSkillSubmit);

        const aboutForm = document.getElementById('aboutForm');
        if (aboutForm) aboutForm.addEventListener('submit', handleAboutSubmit);

        const contactForm = document.getElementById('contactForm');
        if (contactForm) contactForm.addEventListener('submit', handleContactSubmit);
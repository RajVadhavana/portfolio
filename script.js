// ==================== JSONBIN CONFIG ====================
const JSONBIN_BIN_ID = '6a22d155f5f4af5e29bdfbed';
const JSONBIN_API_KEY = '$2a$10$XPTWO75QiCFZgF.qausImu.TzBzhg5WBfqOYtbWFu5KNVoGUBwNlK';
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`;

// ==================== YOUR EMAIL (Contact form emails aayenge yahan) ====================
// TODO: Apna email yahan dalo — jaise: 'rajvadhavana@gmail.com'
const MY_EMAIL = 'rajvadhavana64@gmail.com';

// ==================== LOAD DATA FROM JSONBIN ====================
async function loadPortfolioData() {
    let data = null;
    try {
        const res = await fetch(JSONBIN_URL, {
            headers: { 'X-Access-Key': JSONBIN_API_KEY }
        });
        if (res.ok) {
            const json = await res.json();
            if (json && json.record) {
                data = json.record;
                localStorage.setItem('portfolioData', JSON.stringify(data));
            }
        }
    } catch(e) {
        console.warn('JSONbin fetch failed, using cache:', e.message);
    }

    // Fallback: use localStorage cache
    if (!data) {
        const cached = localStorage.getItem('portfolioData');
        if (cached) {
            try { data = JSON.parse(cached); } catch(e) {}
        }
    }

    // Render if we have data
    if (data) {
        try { renderHero(data.hero); }       catch(e) {}
        try { renderAbout(data.about); }      catch(e) {}
        try { renderSkills(data.skills); }    catch(e) {}
        try { renderProjects(data.projects); } catch(e) {}
        try { renderExperience(data.experience, data.education); } catch(e) {}
        initTyped(data.hero?.roles || ['Frontend Developer', 'Web Designer']);
    } else {
        initTyped(['Frontend Developer', 'Web Designer']);
    }
}

// ==================== RENDER FUNCTIONS ====================
function renderHero(hero) {
    if (!hero) return;
    const greeting = document.getElementById('hero-greeting');
    const name     = document.getElementById('hero-name');
    const tagline  = document.getElementById('hero-tagline');
    const cvBtn    = document.getElementById('cv-btn');

    if (greeting) greeting.textContent = hero.greeting || "Hello, I'm Raj";
    if (name)     name.textContent     = hero.name     || 'Raj Vadhavana';
    if (tagline)  tagline.textContent  = hero.tagline  || '';
    if (cvBtn && hero.cv) cvBtn.href   = hero.cv;

    setHref('link-linkedin',   hero.linkedin);
    setHref('link-instagram',  hero.instagram);
    setHref('link-github',     hero.github);
    setHref('footer-linkedin', hero.linkedin);
    setHref('footer-instagram',hero.instagram);
    setHref('footer-github',   hero.github);
}

function setHref(id, url) {
    const el = document.getElementById(id);
    if (el && url) el.href = url;
}

function renderAbout(about) {
    if (!about) return;
    const title = document.getElementById('about-title');
    const short  = document.getElementById('about-short');
    const long   = document.getElementById('about-long');
    if (title) title.textContent = about.title || 'Frontend Developer';
    if (short) short.textContent = about.short || '';
    if (long)  long.textContent  = about.long  || '';
}

function renderSkills(skills) {
    if (!skills || !skills.length) return;
    const container = document.getElementById('skills-container');
    if (!container) return;
    container.innerHTML = skills.map(skill => `
        <div class="skill-box">
            <img src="${skill.icon}" alt="${skill.alt}" class="skill-icon" />
            <span>${skill.name}</span>
        </div>
    `).join('');
}

function renderProjects(projects) {
    if (!projects || !projects.length) return;
    const container = document.getElementById('projects-container');
    if (!container) return;
    container.innerHTML = projects.map(proj => {
        const techArr = Array.isArray(proj.tech)
            ? proj.tech
            : (typeof proj.tech === 'string' ? proj.tech.split(/[,\s]+/).filter(Boolean) : []);
        return `
        <div class="project-card">
            <div class="project-icon"><i class='${proj.icon || "bx bx-code-alt"}'></i></div>
            <h3>${proj.title}</h3>
            <p>${proj.description}</p>
            <div class="project-tech">
                ${techArr.map(t => `<span class="tech-badge">${t}</span>`).join('')}
            </div>
            <div class="project-links">
                ${proj.github && proj.github !== '#' ? `<a href="${proj.github}" target="_blank"><i class='bx bxl-github'></i> GitHub</a>` : ''}
                ${proj.live   && proj.live   !== '#' ? `<a href="${proj.live}"   target="_blank"><i class='bx bx-link-external'></i> Live</a>` : ''}
            </div>
        </div>`;
    }).join('');
}

function renderExperience(experience, education) {
    const expContainer = document.getElementById('experience-container');
    const eduContainer = document.getElementById('education-container');

    if (expContainer && experience && experience.length) {
        expContainer.innerHTML = experience.map(exp => `
            <div class="timeline-item">
                <div class="timeline-icon"><i class='${exp.icon || "bx bx-briefcase"}'></i></div>
                <h4>${exp.role}</h4>
                <div class="company">${exp.company}</div>
                <div class="duration">${exp.duration}</div>
                <p>${exp.description}</p>
            </div>
        `).join('');
    }

    if (eduContainer && education && education.length) {
        eduContainer.innerHTML = education.map(edu => `
            <div class="timeline-item">
                <div class="timeline-icon"><i class='${edu.icon || "bx bx-graduation"}'></i></div>
                <h4>${edu.degree}</h4>
                <div class="company">${edu.institution}</div>
                <div class="duration">${edu.year}</div>
            </div>
        `).join('');
    }
}

function initTyped(roles) {
    if (typeof Typed === 'undefined') { setTimeout(() => initTyped(roles), 500); return; }
    const el = document.querySelector('.multiple-text');
    if (!el) return;
    new Typed('.multiple-text', {
        strings: roles && roles.length ? roles : ['Frontend Developer', 'Web Designer'],
        typeSpeed: 75, backSpeed: 50, backDelay: 1400, loop: true,
    });
}

// ==================== CONTACT FORM (Email via mailto) ====================
const contactForm = document.getElementById('contact-form');
const sendBtn     = document.getElementById('send-btn');
const successMsg  = document.getElementById('success-msg');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const name    = document.getElementById('contact-name')?.value.trim();
        const email   = document.getElementById('contact-email')?.value.trim();
        const phone   = document.getElementById('contact-phone')?.value.trim();
        const subject = document.getElementById('contact-subject')?.value.trim();
        const message = document.getElementById('contact-message')?.value.trim();

        if (!name || !email || !message) {
            alert('Please fill in Name, Email and Message fields.');
            return;
        }

        // Show loading
        sendBtn.disabled = true;
        sendBtn.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i> Sending...`;

        // Build mailto link — opens Raj's default email client
        const emailSubject = subject || `Portfolio Contact from ${name}`;
        const emailBody = 
`New message from your portfolio website!

────────────────────────
From:    ${name}
Email:   ${email}
Phone:   ${phone || 'Not provided'}
Subject: ${subject || 'General Inquiry'}
────────────────────────

Message:
${message}

────────────────────────
Sent from: rajjjportfolio.netlify.app
Reply to: ${email}`;

        const mailtoLink = `mailto:${MY_EMAIL}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

        // Small delay for UX
        await new Promise(r => setTimeout(r, 800));

        // Show success to sender
        successMsg.style.display = 'block';
        contactForm.reset();
        sendBtn.disabled = false;
        sendBtn.innerHTML = `<i class='bx bx-send'></i> Send Message`;

        // Open Raj's email client in browser (logged-in Gmail etc)
        window.open(mailtoLink, '_blank');

        // Hide success after 6 seconds
        setTimeout(() => { successMsg.style.display = 'none'; }, 6000);
    });
}

// ==================== MOBILE MENU ====================
const menu    = document.querySelector('#menu-icon');
const navbar  = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.navbar a');

if (menu) {
    menu.onclick = () => {
        menu.classList.toggle('bx-x');
        navbar.classList.toggle('active');
    };
}
window.onscroll = () => {
    if (menu)   menu.classList.remove('bx-x');
    if (navbar) navbar.classList.remove('active');
};
navLinks.forEach(link => {
    link.addEventListener("click", () => {
        if (menu)   menu.classList.remove("bx-x");
        if (navbar) navbar.classList.remove("active");
    });
});

// ==================== READ MORE ====================
const readMoreBtn = document.querySelector(".read-more-btn");
const aboutPara   = document.querySelector(".about-para");
if (readMoreBtn) {
    readMoreBtn.addEventListener("click", function(e) {
        e.preventDefault();
        if (aboutPara) aboutPara.classList.toggle("hidden");
        const isHidden = aboutPara && aboutPara.classList.contains("hidden");
        readMoreBtn.innerHTML = isHidden
            ? `Read More <i class='bx bx-chevron-down'></i>`
            : `Read Less <i class='bx bx-chevron-up'></i>`;
    });
}

// ==================== SCROLL REVEAL ====================
window.addEventListener('load', () => {
    if (typeof ScrollReveal !== 'undefined') {
        ScrollReveal({ reset: false, distance: '50px', duration: 900, delay: 150 });
        ScrollReveal().reveal('.home-content, .section-badge', { origin: 'top' });
        ScrollReveal().reveal('.home-visual', { origin: 'bottom', delay: 300 });
        ScrollReveal().reveal('.about-content', { origin: 'left' });
        ScrollReveal().reveal('.about-img', { origin: 'right' });
        ScrollReveal().reveal('.skill-box', { origin: 'bottom', interval: 80 });
        ScrollReveal().reveal('.project-card', { origin: 'bottom', interval: 120 });
        ScrollReveal().reveal('.timeline-item', { origin: 'left', interval: 150 });
        ScrollReveal().reveal('.contact-info', { origin: 'left' });
        ScrollReveal().reveal('.contact-form', { origin: 'right' });
        ScrollReveal().reveal('.footer', { origin: 'bottom' });
    }
});

// ==================== INIT ====================
loadPortfolioData();

// ==================== LIVE UPDATE (LOCAL STORAGE) ====================
window.addEventListener('storage', (e) => {
    if (e.key === 'portfolioData' && e.newValue) {
        try {
            const data = JSON.parse(e.newValue);
            if (data) {
                renderHero(data.hero);
                renderAbout(data.about);
                renderSkills(data.skills);
                renderProjects(data.projects);
                renderExperience(data.experience, data.education);
            }
        } catch(err) {}
    }
});
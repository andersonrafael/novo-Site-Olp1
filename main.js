// year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// mobile menu toggle
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');
if (toggle) {
    toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!expanded));
        if (nav.style.display === 'flex') {
            nav.style.display = '';
        } else {
            nav.style.display = 'flex';
            nav.style.flexDirection = 'column';
            nav.style.position = 'absolute';
            nav.style.right = '20px';
            nav.style.top = '72px';
            nav.style.background = 'white';
            nav.style.padding = '12px';
            nav.style.borderRadius = '10px';
            nav.style.boxShadow = '0 8px 24px rgba(11,27,43,0.12)';
        }
    })
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href.length > 1) {
            e.preventDefault();
            const el = document.querySelector(href);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    })
})

// Reveal on scroll using IntersectionObserver
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target);
        }
    })
}, { threshold: 0.12 });
reveals.forEach(r => io.observe(r));

// Slight parallax on hero background (subtle, only on desktop)
const hero = document.querySelector('.hero');
if (hero && window.innerWidth > 800) {
    window.addEventListener('mousemove', (ev) => {
        const x = (ev.clientX / window.innerWidth - 0.5) * 8; // -4..4
        const y = (ev.clientY / window.innerHeight - 0.5) * 6; // -3..3
        hero.style.backgroundPosition = `${50 - x}% ${50 - y}%`;
    })
}

// Accessibility: close mobile menu on resize to desktop
window.addEventListener('resize', () => {
    if (window.innerWidth > 700) {
        nav.style.display = '';
    }
})

// Order form: open WhatsApp with prefilled message, and send fallback email (mailto)
function encodeBody(formData) {
    const lines = [];
    lines.push(`Novo pedido pelo site:`);
    lines.push(`Nome: ${formData.name}`);
    lines.push(`Telefone: ${formData.phone}`);
    lines.push(`Produto: ${formData.product}`);
    lines.push(`Quantidade: ${formData.quantity}`);
    lines.push(`Detalhes: ${formData.details}`);
    return lines.join('\n');
}

const form = document.getElementById('orderForm');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = {
            name: form.querySelector('[name="name"]').value.trim(),
            phone: form.querySelector('[name="phone"]').value.trim(),
            product: form.querySelector('[name="product"]').value,
            quantity: form.querySelector('[name="quantity"]').value,
            details: form.querySelector('[name="details"]').value.trim()
        };

        // Validation simple
        if (!data.name || !data.phone) {
            alert('Por favor informe nome e telefone.');
            return;
        }

        // WhatsApp open
        const message = encodeURIComponent(encodeBody(data));
        const waNumber = '558599024521'; // ajuste se necessário
        const waUrl = `https://wa.me/${waNumber}?text=${message}`;

        // Also prepare email fallback
        const mailTo = `mailto:contato@ohlalha.com?subject=${encodeURIComponent('Novo pedido')}&body=${encodeURIComponent(encodeBody(data))}`;

        // Ask user how to send
        const choice = confirm('Deseja enviar o pedido pelo WhatsApp? (OK = WhatsApp, Cancelar = Email)');
        if (choice) {
            window.open(waUrl, '_blank');
        } else {
            window.location.href = mailTo;
        }

        // Optional: clear form
        form.reset();
    })
}

// If you want to integrate with Google Sheets via Apps Script, replace the confirm block and use fetch() with your script URL.

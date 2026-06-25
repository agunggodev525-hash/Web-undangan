// --- Opening Screen & Music ---
const urlParams = new URLSearchParams(window.location.search);
const toParam = urlParams.get('to');
if (toParam && toParam.trim() !== '') {
    document.getElementById('guest-name').textContent = toParam.trim();
}

// --- Music Control Logic ---
const btnMusicPlay = document.getElementById('btn-music-play');
const iconPlay = document.getElementById('icon-play');
const iconPause = document.getElementById('icon-pause');
const volumeSlider = document.getElementById('volume-slider');

btnMusicPlay.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play();
        iconPlay.style.display = 'none';
        iconPause.style.display = 'block';
    } else {
        bgMusic.pause();
        iconPlay.style.display = 'block';
        iconPause.style.display = 'none';
    }
});

volumeSlider.addEventListener('input', (e) => {
    bgMusic.volume = e.target.value;
});

// --- Lenis Smooth Scrolling ---
const lenis = new Lenis({
  duration: 1.5,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  smoothTouch: true,
  touchMultiplier: 2
});

// Setup GSAP & ScrollTrigger with Lenis
gsap.registerPlugin(ScrollTrigger);

// Stop scroll on initial load (opening screen active)
lenis.stop();
document.body.style.overflow = 'hidden';

// Handling Opening Screen Click
const btnOpenEnvelope = document.getElementById('btn-open-envelope');
const openingScreen = document.getElementById('opening-screen');
const bgMusic = document.getElementById('bg-music');

btnOpenEnvelope.addEventListener('click', () => {
    // Play Music
    bgMusic.play().catch(e => console.log("Audio failed to play", e));
    
    // Animate Opening Screen out
    gsap.to(openingScreen, {
        opacity: 0,
        y: '-5%', 
        duration: 1.2,
        ease: "power2.inOut",
        onComplete: () => {
            openingScreen.style.display = 'none';
            document.body.style.overflow = '';
            lenis.start(); // Enable scroll
            
            // Show music control
            document.getElementById('music-control').classList.remove('hidden');
            
            // Trigger Hero Cinematic Animation
            gsap.fromTo('.reveal-text', 
                { y: 100, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 1.5, stagger: 0.2, ease: "power4.out" }
            );
        }
    });
});

lenis.on('scroll', ScrollTrigger.update);

// --- Premium Mouse Glow Effect ---
const mouseGlow = document.getElementById('mouse-glow');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let glowX = mouseX;
let glowY = mouseY;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if(mouseGlow.style.opacity === '0' || mouseGlow.style.opacity === '') {
        mouseGlow.style.opacity = '1';
    }
});
document.addEventListener('mouseleave', () => {
    mouseGlow.style.opacity = '0';
});

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
  
  // Smoothly interpolate mouse glow position
  glowX += (mouseX - glowX) * 0.15;
  glowY += (mouseY - glowY) * 0.15;
  mouseGlow.style.transform = `translate(calc(${glowX}px - 50%), calc(${glowY}px - 50%))`;
});
gsap.ticker.lagSmoothing(0);

// Intercept anchor clicks untuk integrasi animasi Lenis scrollTo
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = this.getAttribute('href');
        if(target && target !== '#') {
            lenis.scrollTo(target, { offset: -80 }); // Offset dikurangi tinggi navbar
        }
    });
});

// --- GSAP ScrollTrigger Animations ---
const animateElements = () => {
    // Reveal Fade Up
    ScrollTrigger.batch('.gsap-fade-up', {
        start: "top 85%",
        onEnter: batch => gsap.fromTo(batch, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out", overwrite: true })
    });

    // Reveal Slide Right (from left to right)
    ScrollTrigger.batch('.gsap-slide-right', {
        start: "top 85%",
        onEnter: batch => gsap.fromTo(batch, { opacity: 0, x: -80 }, { opacity: 1, x: 0, duration: 1.2, stagger: 0.15, ease: "power3.out", overwrite: true })
    });

    // Reveal Slide Left (from right to left)
    ScrollTrigger.batch('.gsap-slide-left', {
        start: "top 85%",
        onEnter: batch => gsap.fromTo(batch, { opacity: 0, x: 80 }, { opacity: 1, x: 0, duration: 1.2, stagger: 0.15, ease: "power3.out", overwrite: true })
    });

    // Reveal Zoom In
    ScrollTrigger.batch('.gsap-zoom-in', {
        start: "top 85%",
        onEnter: batch => gsap.fromTo(batch, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1, stagger: 0.15, ease: "power3.out", overwrite: true })
    });

    // Parallax Elements
    gsap.utils.toArray('.gsap-parallax').forEach(el => {
        const speed = el.getAttribute('data-speed') || 0.1;
        gsap.to(el, {
            y: () => -100 * speed * 15,
            ease: "none",
            scrollTrigger: {
                trigger: el.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });
};

// Initialize animations shortly after load to ensure DOM parsing is fully complete
setTimeout(animateElements, 50);

// --- Countdown Timer Logic ---
// Target Date: December 12, 2026 08:00:00
const countDownDate = new Date("Dec 12, 2026 08:00:00").getTime();

// --- RSVP Form to Google Sheets ---
const scriptURL = 'YOUR_GOOGLE_SCRIPT_URL_HERE'; // GANTI DENGAN URL WEB APP ANDA
const rsvpForm = document.getElementById('rsvpForm');
const btnSubmitRsvp = rsvpForm.querySelector('button[type="submit"]');

rsvpForm.addEventListener('submit', e => {
    e.preventDefault();
    
    // Loading state
    const originalText = btnSubmitRsvp.innerHTML;
    btnSubmitRsvp.innerHTML = 'Mengirim...';
    btnSubmitRsvp.disabled = true;
    
    const formData = new FormData(rsvpForm);
    // Tambahkan Waktu Submit
    formData.append('Waktu Submit', new Date().toLocaleString('id-ID'));

    if (scriptURL === 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
        // Simulasi jika belum ada URL
        setTimeout(() => {
            Swal.fire({
                title: "Simulasi Berhasil!",
                text: "Data (Nama: " + formData.get('Nama') + ") tercatat. Masukkan URL Web App asli Anda di script.js.",
                icon: "info",
                confirmButtonColor: "#D4AF37",
                background: "rgba(11, 19, 43, 0.95)",
                color: "#FFF",
                backdrop: "rgba(0,0,0,0.8)"
            });
            btnSubmitRsvp.innerHTML = originalText;
            btnSubmitRsvp.disabled = false;
            rsvpForm.reset();
        }, 1000);
        return;
    }

    fetch(scriptURL, { method: 'POST', body: formData })
        .then(response => {
            Swal.fire({
                title: "Terima Kasih!",
                text: "Konfirmasi kehadiran Anda telah kami terima.",
                icon: "success",
                confirmButtonColor: "#D4AF37",
                background: "rgba(11, 19, 43, 0.95)",
                color: "#FFF",
                backdrop: "rgba(0,0,0,0.8)"
            });
            rsvpForm.reset();
        })
        .catch(error => {
            console.error('Error!', error.message);
            Swal.fire({
                title: "Gagal Mengirim",
                text: "Maaf, terjadi kesalahan teknis. Silakan coba lagi.",
                icon: "error",
                confirmButtonColor: "#D4AF37",
                background: "rgba(11, 19, 43, 0.95)",
                color: "#FFF"
            });
        })
        .finally(() => {
            btnSubmitRsvp.innerHTML = originalText;
            btnSubmitRsvp.disabled = false;
        });
});

function updateFlipCard(id, newValue) {
    const container = document.getElementById(id);
    if(!container) return;
    const topFace = container.querySelector('.is-top span');
    const bottomFace = container.querySelector('.is-bottom span');
    
    if (topFace.innerText === newValue) return;

    const currentValue = topFace.innerText;

    const flipTop = document.createElement('div');
    flipTop.className = 'card-face is-top flipping';
    flipTop.innerHTML = `<span>${currentValue}</span>`;
    
    const flipBottom = document.createElement('div');
    flipBottom.className = 'card-face is-bottom flipping-bottom';
    flipBottom.innerHTML = `<span>${newValue}</span>`;

    container.appendChild(flipTop);
    container.appendChild(flipBottom);

    bottomFace.innerText = newValue;

    setTimeout(() => {
        topFace.innerText = newValue;
        flipTop.remove();
        flipBottom.remove();
    }, 800);
}

// Update the count down every 1 second
const x = setInterval(function() {
    const now = new Date().getTime();
    const distance = countDownDate - now;
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    const dStr = days < 10 ? '0' + days : days.toString();
    const hStr = hours < 10 ? '0' + hours : hours.toString();
    const mStr = minutes < 10 ? '0' + minutes : minutes.toString();
    const sStr = seconds < 10 ? '0' + seconds : seconds.toString();
    
    updateFlipCard('flip-days', dStr);
    updateFlipCard('flip-hours', hStr);
    updateFlipCard('flip-minutes', mStr);
    updateFlipCard('flip-seconds', sStr);
    
    if (distance < 0) {
        clearInterval(x);
        document.getElementById("timer").innerHTML = "<div class='time-box' style='width: auto; padding: 0 1rem;'><span class='time-num' style='color:var(--gold);font-family:var(--font-heading);font-size:2rem;'>Acara Telah Dimulai</span></div>";
    }
}, 1000);


// --- RSVP Form Submission ---
document.getElementById('rsvpForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    alert(`Terima kasih, ${name}! Konfirmasi kehadiran Anda telah dikirim.`);
    this.reset();
});

// --- Wishes Form Submission ---
document.getElementById('wishForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('wishName').value;
    const message = document.getElementById('wishMessage').value;
    
    const wishesList = document.getElementById('wishesList');
    
    const newWish = document.createElement('div');
    newWish.classList.add('wish-item');
    newWish.innerHTML = `
        <h4 class="wish-name">${name}</h4>
        <p class="wish-text">${message}</p>
    `;
    
    // Insert at top
    wishesList.insertBefore(newWish, wishesList.firstChild);
    
    // Reset form
    this.reset();
});


// --- Copy Rekening to Clipboard ---
function copyRekening() {
    const rekeningText = document.getElementById('rekening').innerText;
    navigator.clipboard.writeText(rekeningText).then(() => {
        alert("Nomor rekening berhasil disalin: " + rekeningText);
    }).catch(err => {
        alert("Gagal menyalin nomor rekening.");
    });
}

// --- Premium Gold Dust Particles (Canvas) ---
const canvas = document.createElement('canvas');
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100vw';
canvas.style.height = '100vh';
canvas.style.zIndex = '900'; // Melayang di atas semua elemen tapi di bawah Navbar
canvas.style.pointerEvents = 'none'; // Tidak mengganggu klik pengguna
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
let width, height;
let particles = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5 + 0.5; // Partikel kecil elegan
        this.speedX = Math.random() * 0.4 - 0.2; 
        this.speedY = Math.random() * -0.6 - 0.2; // Bergerak perlahan ke atas
        this.opacity = Math.random() * 0.5 + 0.1; // Transparan
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Looping partikel
        if (this.y < 0) this.y = height;
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
    }
    draw() {
        ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`; // Warna Emas Premium
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    // Menyesuaikan jumlah partikel untuk performa mobile
    const particleCount = window.innerWidth < 768 ? 40 : 80;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}
initParticles();

// Menggunakan GSAP ticker agar sangat mulus dan sinkron dengan animasi lain
gsap.ticker.add(() => {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
});

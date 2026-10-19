/* ============================================================
   i owe you a softer love.
   Semua interaksi ada di sini. Sederhana & bisa diedit.
   ============================================================ */

// ---- PENGATURAN YANG BISA KAMU UBAH ----
// Isi dengan URL audio yang BOLEH kamu pakai (mis. lagu buatan sendiri / bebas royalti).
// Kalau dikosongkan (""), pemutar musik disembunyikan total.
const MUSIC_URL = "";

const DUST_COUNT = 14;       // jumlah debu halus di ruangan
const ENVELOPE_DELAY = 1700; // ms: lama animasi amplop sebelum pindah halaman

// Tandai JS aktif supaya animasi hanya jalan kalau script berhasil dimuat.
document.documentElement.classList.add("js");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---- Elemen ----
const intro = document.getElementById("intro");
const envelope = document.getElementById("envelope");
const openBtn = document.getElementById("openBtn");
const letter = document.getElementById("letter");
const progress = document.getElementById("progress");
const player = document.getElementById("player");

// ---- 1. Buka amplop ----
let opened = false;
openBtn.addEventListener("click", () => {
  if (opened) return;
  opened = true;
  openBtn.disabled = true;
  envelope.classList.add("open");

  setTimeout(showLetter, reduceMotion ? 100 : ENVELOPE_DELAY);
});

function showLetter() {
  intro.classList.add("leaving");
  setTimeout(() => {
    intro.hidden = true;
    letter.hidden = false;
    progress.hidden = false;
    if (MUSIC_URL) player.hidden = false;
    window.scrollTo(0, 0);
    setupReveal();
    setupProgress();
    setupFlower();
    makeDust();
    const first = document.getElementById("t-admit");
    if (first) { first.setAttribute("tabindex", "-1"); first.focus({ preventScroll: true }); }
  }, reduceMotion ? 50 : 1100);
}

// ---- 2. Teks muncul pelan saat masuk layar ----
function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("show"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });
  items.forEach((el) => io.observe(el));
}

// ---- Indikator progres (titik kecil di sisi kanan) ----
function setupProgress() {
  const links = [...progress.querySelectorAll("a")];
  const chapters = [...document.querySelectorAll(".chapter")];
  if (!("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const idx = chapters.indexOf(entry.target);
      links.forEach((a, i) => {
        a.classList.toggle("active", i === idx);
        if (i === idx) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      });
    });
  }, { threshold: 0.5 });
  chapters.forEach((c) => io.observe(c));
}

// ---- 4. Bunga tumbuh saat bagian itu terlihat ----
function setupFlower() {
  const flower = document.getElementById("flower");
  if (!flower) return;
  if (!("IntersectionObserver" in window)) { flower.classList.add("grow"); return; }
  const io = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      flower.classList.add("grow");
      io.disconnect();
    }
  }, { threshold: 0.6 });
  io.observe(flower);
}

// ---- 3. Debu melayang di ruangan ----
function makeDust() {
  const box = document.getElementById("dust");
  if (!box || reduceMotion) return;
  for (let i = 0; i < DUST_COUNT; i++) {
    const s = document.createElement("span");
    const size = 2 + Math.random() * 3;
    s.style.width = s.style.height = size + "px";
    s.style.left = Math.random() * 100 + "%";
    s.style.top = 20 + Math.random() * 70 + "%";
    s.style.setProperty("--d", 18 + Math.random() * 16 + "s");
    s.style.setProperty("--delay", -Math.random() * 20 + "s");
    box.appendChild(s);
  }
}

// ---- 6. Musik (opsional, hanya mulai setelah tombol ditekan) ----
(function setupMusic() {
  if (!MUSIC_URL) return; // pemutar tetap tersembunyi
  const audio = document.getElementById("audio");
  const btn = document.getElementById("playBtn");
  const label = document.getElementById("playLabel");
  audio.src = MUSIC_URL;
  audio.volume = 0.5;

  btn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().then(() => setState(true)).catch(() => setState(false));
    } else {
      audio.pause();
      setState(false);
    }
  });

  function setState(playing) {
    player.classList.toggle("playing", playing);
    btn.setAttribute("aria-pressed", String(playing));
    btn.setAttribute("aria-label", playing ? "Jeda musik" : "Putar musik");
    label.textContent = playing ? "pause" : "play";
  }
})();

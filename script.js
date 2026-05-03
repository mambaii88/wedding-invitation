// 1. Mengambil Nama Tamu dari URL (misal: index.html?to=Imam+Baidhawi)
const urlParams = new URLSearchParams(window.location.search);
const guestName = urlParams.get('to') || 'Tamu Undangan';
document.getElementById('guest-name').innerText = guestName;

// 2. Logika "Buka Undangan" & Putar Musik
const btnOpen = document.getElementById('open-invitation');
const coverPage = document.getElementById('cover-page');
const mainContent = document.getElementById('main-content');
const bgMusic = document.getElementById('bg-music');

btnOpen.addEventListener('click', () => {
    // Sembunyikan cover dengan animasi sederhana
    coverPage.classList.add('transition-opacity', 'duration-700', 'opacity-0');
    
    setTimeout(() => {
        coverPage.classList.add('hidden');
        mainContent.classList.remove('hidden');
        // Play musik (browser mengizinkan karena ada interaksi klik dari user)
        bgMusic.play().catch(error => console.log("Auto-play dicegah oleh browser"));
    }, 700);
});

// 3. Logika "Copy to Clipboard" untuk Rekening Bank
function copyRekening() {
    const rekening = document.getElementById('rekening').innerText;
    navigator.clipboard.writeText(rekening).then(() => {
        alert('Nomor rekening berhasil disalin!');
    }).catch(err => {
        console.error('Gagal menyalin teks: ', err);
    });
}

// 4. Handle Form Submission RSVP ke Supabase (Database SQL)
document.getElementById('rsvp-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = 'Mengirim...';
    submitBtn.disabled = true;

    const data = {
        nama: document.getElementById('nama').value,
        kehadiran: document.getElementById('kehadiran').value,
        ucapan: document.getElementById('ucapan').value
    };

    // --- KONEKSI DATABASE (Sesuaikan dengan kredensial Supabase Anda) ---
    const SUPABASE_URL = 'https://jtqqfwowhjowmxzquzkr.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_Aq4_fdAB7q4ZhWpy9RTvsg_hlGIASlt';

    try {

        const response = await fetch(`${SUPABASE_URL}/rest/v1/guestbook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Gagal menyimpan data');

        // Simulasi sukses untuk keperluan prototipe saat ini:
        setTimeout(() => {
            alert('Terima kasih! RSVP dan ucapan Anda berhasil dikirim.');
            this.reset();
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }, 1000);

    } catch (error) {
        alert('Terjadi kesalahan koneksi. Silakan coba lagi.');
        console.error(error);
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    }
});
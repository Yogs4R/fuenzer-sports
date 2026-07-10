export const id = {
  navbar: {
    home: "Beranda",
    standings: "Standings",
    history: "History",
    signIn: "Masuk",
    signUp: "Daftar",
  },
  notifications: {
    title: "Catatan Perubahan & Pembaruan",
    empty: "Tidak ada notifikasi baru",
    updates: [
      {
        date: "6 Juli 2026",
        title: "Migrasi Vite & Tailwind CSS v4",
        description: "Berhasil melakukan migrasi ke React 18, Vite 8, dan Tailwind CSS v4. Sistem visual Strict Dark Mode dikonfigurasi."
      },
      {
        date: "5 Juli 2026",
        title: "Desain Awal Monte Carlo Engine",
        description: "Menerapkan simulasi dasar menggunakan backend Python dan FastAPI, dioptimalkan dengan NumPy."
      }
    ]
  },
  pages: {
    history: {
      title: "History",
      subtitle: "Akses simulasi turnamen dan sesi obrolan Anda sebelumnya di sini. Semua data riwayat Anda disimpan secara lokal untuk akses cepat.",
      empty: "Belum ada riwayat simulasi. Coba jalankan simulasi turnamen!"
    },
    standings: {
      title: "Standings",
      subtitle: "Jelajahi babak grup turnamen dan klasemen yang disimulasikan oleh Monte Carlo AI.",
      soon: "segera",
      best3rdTitle: "Klasemen Peringkat 3 Terbaik",
      best3rdDesc: "8 tim peringkat ketiga teratas lolos ke babak gugur (ditandai dengan warna hijau)."
    },
    terms: {
      title: "Syarat & Ketentuan",
      lastUpdated: "Terakhir diperbarui: 7 Juli 2026",
      p1: "Selamat datang di Fuenzer Sports. Dengan mengakses dan menggunakan sports.fuenzer.web.id, Anda menerima dan setuju untuk terikat oleh syarat dan ketentuan perjanjian ini.",
      h1: "1. Lisensi Penggunaan & Hak Kekayaan Intelektual",
      p2: "Fuenzer Sports memberi Anda lisensi sementara dan pribadi untuk menjalankan simulasi olahraga Monte Carlo untuk tujuan analisis dan hiburan. Semua output analitik, model logika simulasi, dan desain visual tetap menjadi milik Fuenzer Sports.",
      h2: "2. Penafian Simulasi",
      p3: "Semua prediksi turnamen, probabilitas klasemen, dan hasil pertandingan yang disimulasikan dihitung menggunakan pemodelan statistik acak (metode Monte Carlo). Fuenzer Sports tidak menjamin akurasi prediktif 100%. Output JANGAN digunakan sebagai nasihat keuangan, taruhan, atau investasi.",
      h3: "3. Batas Penggunaan API",
      p4: "Anda setuju untuk tidak mengeksploitasi, melakukan spam, scraping, atau serangan denial-of-service pada endpoint FastAPI backend kami. Kebijakan pembatasan laju (rate limiting) diberlakukan pada profil tamu dan anggota."
    },
    privacy: {
      title: "Kebijakan Privasi",
      lastUpdated: "Terakhir diperbarui: 7 Juli 2026",
      p1: "Di Fuenzer Sports (dapat diakses dari sports.fuenzer.web.id), kami memprioritaskan privasi pengguna kami. Kebijakan Privasi ini mendokumentasikan jenis informasi yang kami kumpulkan dan catat, serta bagaimana kami menggunakannya.",
      h1: "1. Penyimpanan Lokal & Arsitektur Guest First",
      p2Part1: "Aplikasi kami dirancang dengan arsitektur ",
      guestFirst: "Guest-First",
      p2Part2: ". Ini berarti bahwa semua input simulasi pertandingan, preferensi, dan pengaturan ruang kerja Anda disimpan secara lokal di ",
      p2Part3: " perangkat Anda. Tidak ada data identifikasi pribadi atau log kueri pencarian yang diunggah atau disimpan di server kami kecuali Anda mendaftar untuk akun pengguna secara eksplisit.",
      h2: "2. Cookie",
      p3: "Seperti situs web lainnya, Fuenzer Sports menggunakan cookie sesi jika Anda memilih untuk mengautentikasi (Masuk). Cookie ini hanya digunakan untuk mengelola sesi login Anda dan mengamankan ruang kerja kustom Anda. Kami tidak menggunakan cookie pelacakan atau periklanan pihak ketiga.",
      h3: "3. Pembaruan Kebijakan",
      p4: "Kami berhak mengubah Kebijakan Privasi ini kapan saja. Setiap perubahan akan diperbarui di halaman ini dengan tanggal modifikasi yang diperbarui."
    }
  },
  components: {
    hero: {
      title: "Tanyakan Apapun. Simulasikan Semuanya.",
      subtitle: "Didukung oleh algoritma Monte Carlo canggih untuk prediksi olahraga terbaik.",
      placeholder: "Simulasikan pertandingan Grup A World Cup 2026...",
      model: "Model",
      mode: "Mode",
      style: "Style"
    },
    belowTheFold: {
      supportedBy: "Didukung & Ditenagai oleh",
      watchDemo: "Tonton Demo Platform",
      stats: {
        iterations: "Iterasi Monte Carlo",
        teams: "Tim Disimulasikan",
        time: "Total Simulasi Dijalankan",
        accuracy: "Kecepatan Prediksi AI",
        accuracyValue: "Instan"
      },
      currentStandings: {
        title: "Klasemen Saat Ini",
        subtitle: "Simulasi langsung dari turnamen global teratas.",
        viewAll: "Lihat Semua"
      },
      features: {
        title: "Kemampuan Tanpa Batas",
        subtitle: "Jelajahi fitur lanjutan yang memberi Anda kekuatan untuk memprediksi, menganalisis, dan mensimulasikan dunia olahraga dengan akurasi tinggi.",
        aiTitle: "Analitik Bertenaga AI",
        aiDesc: "Model AI kami memproses jutaan titik data historis dan real-time untuk mengungkap pola tersembunyi yang menentukan hasil pertandingan.",
        liveTitle: "Simulasi Langsung",
        liveDesc: "Jalankan simulasi skenario \"Bagaimana jika\" dalam hitungan detik. Ubah formasi, cederai pemain, atau ubah cuaca, dan lihat dampaknya secara instan.",
        chartsTitle: "Grafik Interaktif",
        chartsDesc: "Visualisasikan data kompleks melalui bagan dan peta panas yang mudah dipahami, memberi Anda wawasan taktis mendalam di setiap sudut lapangan."
      },
      whyChooseUs: {
        title: "Mengapa Fuenzer Sports?",
        desc: "Tumpukan simulasi kami dibangun di AMD Cloud menggunakan akselerator MI300X berkinerja tinggi. Bersamaan dengan kerangka kerja inferensi Google Gemma 4 dan Fireworks AI, kami melakukan ribuan hasil Monte Carlo yang kompleks dalam hitungan milidetik.",
        feat1: "Vectorized NumPy Engine",
        feat2: "Real-time API Integration",
        feat3: "Strict FIFA Rules Engine",
        nextGenTitle: "Kekuatan Simulasi Generasi Berikutnya",
        nextGenDesc: "Dioptimalkan untuk throughput komputasi maksimum, mesin Monte Carlo tervektorisasi kami melakukan ribuan simulasi pertandingan yang kompleks dalam hitungan milidetik, meninggalkan pesaing jauh di belakang."
      },
      faq: {
        title: "Pertanyaan yang Sering Diajukan",
        subtitle: "Punya pertanyaan? Kami punya jawabannya."
      },
      cta: {
        title: "Siap Melihat Masa Depan?",
        subtitle: "Bergabunglah dengan ribuan analis dan penggemar yang telah memanfaatkan kekuatan AI untuk prediksi olahraga.",
        button: "Mulai Simulasi Sekarang"
      }
    },
    footer: {
      description: "Platform kecerdasan olahraga terkemuka. Mensimulasikan hasil pertandingan dengan kekuatan komputasi AI modern untuk memberikan wawasan tanpa batas.",
      navTitle: "Navigasi",
      legalTitle: "Legal",
      contactTitle: "Kontak",
      githubRepo: "Repositori GitHub",
      allRightsReserved: "Hak cipta dilindungi undang-undang.",
      version: "Versi",
      serverStatus: "Status Server:",
      online: "Online"
    },
    playground: {
      leftPanel: {
        placeholder: "Tanya apa saja tentang olahraga...",
        untitled: "Simulasi Tanpa Judul",
        rename: "Ubah Nama",
        clearChat: "Hapus Obrolan",
        copied: "Tersalin!",
        copyResponse: "Salin respons",
        selectEngine: "Pilih Engine AI",
        promptStyle: "Gaya Prompt",
        readyToExplore: "Siap untuk mengeksplorasi?",
        readyDesc: "Ajukan pertanyaan lanjutan atau sesuaikan skenario untuk melihat bagaimana simulasi merespons.",
        you: "Anda",
        ai: "Fuenzer AI",
        voiceInput: "Input Suara"
      },
      rightPanel: {
        groupStageComplete: "Babak Grup telah selesai! Gunakan mode 'From Scratch' untuk mengulang simulasi grup, atau beralih ke Knockout Bracket untuk menyimulasikan sisa turnamen.",
        runningSim: "Menjalankan Simulasi Monte Carlo...",
        playSim: "Jalankan Simulasi",
        simBracket: "Menyimulasikan Bagan...",
        simKnockout: "Simulasikan Knockout",
        hideMetrics: "Sembunyikan Metrik",
        showMetrics: "Tampilkan Metrik",
        sort: "Urutkan:",
        defaultSort: "Bawaan (Grup)",
        highest1st: "Juara 1 Tertinggi",
        lowest1st: "Juara 1 Terendah",
        highestAdv: "Lolos Tertinggi",
        lowestAdv: "Lolos Terendah",
        searchTeam: "Cari tim...",
        filter: "Filter",
        showGroups: "Tampilkan Grup",
        clearAll: "Hapus Semua",
        selectAll: "Pilih Semua",
        probOverview: "Ikhtisar Probabilitas",
        loadingStadium: "Memuat data stadion...",
        noGroupsMatch: "Tidak ada grup yang cocok dengan filter yang dipilih.",
        groupStandings: "Group Standings",
        knockoutBracket: "Knockout Bracket",
        preTournament: "Pre-Tournament",
        liveProgression: "Live Progression",
        matchday: "Matchday"
      },
      bracket: {
        winProb: "PROBABILITAS KEMENANGAN",
        thirdPlace: "Perebutan Juara 3",
        hypothetical: "PERINGATAN: Hasil simulasi murni hipotesis dan didasarkan pada perhitungan Monte Carlo.",
        noData: "Tidak ada data bagan yang tersedia.",
        runSimulation: "Jalankan simulasi babak grup 'From Scratch' terlebih dahulu.",
        showMetrics: "Tampilkan Metrik",
        hideMetrics: "Sembunyikan Metrik"
      },
      processing: {
        step1: "Mengumpulkan data skuad terbaru...",
        step2: "Menjalankan 10.000 iterasi Monte Carlo...",
        step3: "Menghitung probabilitas pertandingan...",
        step4: "Menghasilkan komentar AI...",
        viewThoughtProcess: "Lihat proses pemikiran",
        complete: "Pemrosesan Selesai",
        processing: "Memproses"
      }
    }
  }
};


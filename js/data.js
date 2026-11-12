// ==========================================
// JOBREADY - Realistic Initial Dummy Data
// ==========================================

const INITIAL_USER = {
  id: 'usr_001',
  name: 'Alvin',
  email: 'alvin@email.com',
  phone: '0812 3456 7890',
  location: 'Jakarta, Indonesia',
  title: 'Fresh Graduate & Frontend Enthusiast',
  avatar: 'assets/images/avatar_alvin.svg',
  bio: 'Lulusan baru Teknik Informatika yang berfokus pada pengembangan antarmuka web modern, interaktif, dan mudah digunakan. Terampil dalam ekosistem JavaScript modern, React, dan UI/UX Design.',
  education: {
    degree: 'S1 Teknik Informatika',
    institution: 'Universitas Indonesia',
    period: '2020 - 2024',
    gpa: '3.82 / 4.00'
  },
  skills: [
    'React.js',
    'JavaScript (ES6+)',
    'TypeScript',
    'Tailwind CSS',
    'Figma & UI/UX',
    'HTML5 & CSS3',
    'Git & GitHub',
    'RESTful API',
    'Responsive Web'
  ],
  experiences: [
    {
      role: 'Frontend Developer Intern',
      company: 'Nusantara Tech Studio',
      period: 'Jul 2023 - Des 2023',
      description: 'Mengembangkan komponen antarmuka web responsif dan integrasi API untuk platform e-commerce.'
    },
    {
      role: 'Freelance UI/UX Designer',
      company: 'Creative Digital Studio',
      period: 'Jan 2023 - Sekarang',
      description: 'Mendesain wireframe, mockup, dan prototype interaktif berbasis Figma untuk 5+ klien UMKM.'
    }
  ],
  cv: {
    fileName: 'CV_Alvin.pdf',
    fileSize: '2.1 MB',
    uploadedAt: '10 Mei 2025'
  },
  settings: {
    emailNotif: true,
    statusNotif: true,
    jobAlerts: true,
    pushNotif: true
  }
};

const INITIAL_JOBS = [
  {
    id: 'job_001',
    title: 'Frontend Developer',
    company: 'TechCorp Indonesia',
    companyLogoBg: '#2563EB',
    companyLogoText: 'T',
    location: 'Jakarta, Indonesia',
    type: 'Full-Time',
    workplace: 'Remote',
    salary: 'IDR 8 - 15 Jt',
    salaryMin: 8000000,
    salaryMax: 15000000,
    category: 'Teknologi',
    postedDate: '12 Jun 2025',
    isNew: true,
    isFeatured: true,
    companyAbout: 'TechCorp Indonesia adalah perusahaan pengembang solusi software enterprise dan aplikasi cloud terkemuka di Asia Tenggara dengan lebih dari 500 karyawan.',
    description: 'Bergabunglah dengan tim engineering kami untuk membangun antarmuka aplikasi web modern kelas enterprise yang cepat, responsif, dan memberikan pengalaman pengguna terbaik.',
    qualifications: [
      'Minimal S1 Teknik Informatika, Sistem Informasi, atau bidang terkait (Fresh Graduate dipersilakan)',
      'Pengalaman 0-2 tahun dalam pengembangan web frontend',
      'Menguasai React.js, JavaScript modern (ES6+), dan TypeScript',
      'Memahami implementasi styling modern dengan Tailwind CSS atau CSS Modules',
      'Familiar dengan Git, REST API, dan optimasi performa web',
      'Memiliki portofolio proyek web yang dapat didemonstrasikan'
    ],
    requirements: [
      'Kemampuan problem solving dan komunikasi tim yang baik',
      'Mampu bekerja secara mandiri maupun kolaboratif dalam lingkungan remote',
      'Disiplin waktu dan terbiasa dengan metodologi Agile/Scrum'
    ],
    benefits: [
      'Gaji kompetitif + Tunjangan WFH bulanan',
      'Asuransi kesehatan swasta (BPJS & Private Healthcare)',
      'Laptop kerja spesifikasi tinggi (MacBook Pro / ThinkPad)',
      'Budget tahunan untuk sertifikasi dan kursus online',
      'Waktu kerja fleksibel dan cuti tahunan 15 hari'
    ]
  },
  {
    id: 'job_002',
    title: 'UI/UX Designer',
    company: 'FutureHub',
    companyLogoBg: '#0284C7',
    companyLogoText: 'Fast',
    location: 'Jakarta, Indonesia',
    type: 'Full-Time',
    workplace: 'Hybrid',
    salary: 'IDR 7 - 12 Jt',
    salaryMin: 7000000,
    salaryMax: 12000000,
    category: 'Desain',
    postedDate: '11 Jun 2025',
    isNew: true,
    isFeatured: true,
    companyAbout: 'FutureHub adalah inkubator produk digital masa depan yang menghadirkan solusi SaaS inovatif untuk ribuan bisnis di Indonesia.',
    description: 'Kami mencari UI/UX Designer kreatif yang antusias merancang pengalaman digital yang intuitif, memukau, dan berdampak nyata bagi pengguna kami.',
    qualifications: [
      'Minimal D3/S1 Desain Komunikasi Visual, Desain Produk, atau bidang terkait',
      'Menguasai Figma secara mendalam (Auto-layout, Components, Variables, Prototype)',
      'Memiliki portofolio studi kasus UI/UX yang menunjukkan proses user research dan problem solving',
      'Memahami prinsip User-Centered Design, Design System, dan Accessibility',
      'Mampu berkolaborasi erat dengan Product Manager dan Tim Developer'
    ],
    requirements: [
      'Portofolio wajib disertakan (link Behance/Dribbble/Notion)',
      'Kreatif, analitis, dan memiliki perhatian tinggi terhadap detail visual'
    ],
    benefits: [
      'Skema kerja hybrid fleksibel (2 hari kantor, 3 hari remote)',
      'Budget peralatan kerja dan subscription design tools',
      'Asuransi kesehatan lengkap',
      'Bonus performa semesteran'
    ]
  },
  {
    id: 'job_003',
    title: 'Backend Developer',
    company: 'TechCorp Indonesia',
    companyLogoBg: '#1D4ED8',
    companyLogoText: 'T',
    location: 'Jakarta, Indonesia',
    type: 'Full-Time',
    workplace: 'On-site',
    salary: 'IDR 10 - 18 Jt',
    salaryMin: 10000000,
    salaryMax: 18000000,
    category: 'Teknologi',
    postedDate: '09 Jun 2025',
    isNew: false,
    isFeatured: false,
    companyAbout: 'TechCorp Indonesia mengembangkan infrastruktur digital backend dengan reliabilitas tinggi untuk sektor finansial dan logistik.',
    description: 'Membangun arsitektur backend scalable, mengelola API microservices, dan memastikan integritas data serta keamanan sistem.',
    qualifications: [
      'Pengalaman dengan Node.js, Go, atau Python',
      'Pemahaman kuat tentang database relasional (PostgreSQL/MySQL) dan NoSQL (Redis/MongoDB)',
      'Memahami konsep RESTful API, gRPC, dan arsitektur microservices',
      'Terbiasa dengan containerization (Docker) dan Git'
    ],
    requirements: [
      'Pengalaman kerja minimal 1 tahun di posisi sejenis',
      'Mampu menulis unit test dan dokumentasi API yang rapi'
    ],
    benefits: [
      'Gaji dan bonus performa menarik',
      'Asuransi kesehatan keluarga',
      'Subsidi makan siang & transport'
    ]
  },
  {
    id: 'job_004',
    title: 'Data Analyst',
    company: 'DataPro',
    companyLogoBg: '#F59E0B',
    companyLogoText: '📊',
    location: 'Bandung, Indonesia',
    type: 'Full-Time',
    workplace: 'On-site',
    salary: 'IDR 7 - 11 Jt',
    salaryMin: 7000000,
    salaryMax: 11000000,
    category: 'Data',
    postedDate: '08 Jun 2025',
    isNew: false,
    isFeatured: false,
    companyAbout: 'DataPro adalah perusahaan riset analitik dan konsultan business intelligence yang membantu perusahaan mengambil keputusan berbasis data.',
    description: 'Menganalisis tren pasar, membuat dashboard interaktif untuk stakeholder, dan menggali insight data berharga untuk pertumbuhan bisnis.',
    qualifications: [
      'Keahlian tinggi dalam SQL dan manipulasi data dengan Python / R',
      'Mahir mengoperasikan visualisasi data seperti Tableau, Power BI, atau Metabase',
      'Kemampuan statistika deskriptif dan inferensial',
      'Kemampuan komunikasi storytelling data yang baik kepada non-teknis'
    ],
    requirements: [
      'Terbuka untuk Fresh Graduate dengan portofolio analisis data'
    ],
    benefits: [
      'Lingkungan kerja suportif dan penuh pembelajaran',
      'Akses ke kursus data science premium',
      'Asuransi kesehatan dan BPJS'
    ]
  },
  {
    id: 'job_005',
    title: 'Marketing Specialist',
    company: 'GrowthHub',
    companyLogoBg: '#10B981',
    companyLogoText: 'G',
    location: 'Jakarta, Indonesia',
    type: 'Full-Time',
    workplace: 'Hybrid',
    salary: 'IDR 6 - 9 Jt',
    salaryMin: 6000000,
    salaryMax: 9000000,
    category: 'Marketing',
    postedDate: '07 Jun 2025',
    isNew: false,
    isFeatured: false,
    companyAbout: 'GrowthHub adalah digital growth agency yang membesarkan puluhan brand startup ternama di Indonesia.',
    description: 'Merancang kampanye digital marketing, mengelola iklan berbayar (Meta & Google Ads), serta menganalisis conversion rate funnels.',
    qualifications: [
      'Pengalaman dalam Digital Ads, Content Strategy, dan SEO dasar',
      'Terbiasa dengan tools analitik seperti Google Analytics 4',
      'Kreatif dan mampu menyusun copywriting persuasif'
    ],
    requirements: [
      'Pendidikan S1 Komunikasi, Manajemen, atau bidang terkait'
    ],
    benefits: [
      'Insentif kampanye dan target pencapaian',
      'Fleksibilitas kerja hybrid',
      'BPJS Ketenagakerjaan dan Kesehatan'
    ]
  },
  {
    id: 'job_006',
    title: 'UI/UX Designer',
    company: 'NextGen',
    companyLogoBg: '#EF4444',
    companyLogoText: 'N',
    location: 'Surabaya, Indonesia',
    type: 'Full-Time',
    workplace: 'On-site',
    salary: 'IDR 7 - 13 Jt',
    salaryMin: 7000000,
    salaryMax: 13000000,
    category: 'Desain',
    postedDate: '05 Jun 2025',
    isNew: false,
    isFeatured: false,
    companyAbout: 'NextGen memproduksi aplikasi mobile inovatif untuk segmen edukasi dan produktivitas generasi muda.',
    description: 'Membuat user flows, wireframes, prototype interaktif, serta melakukan usability testing untuk produk mobile kami.',
    qualifications: [
      'Pengalaman 1+ tahun dalam desain aplikasi iOS dan Android',
      'Mahir Figma dan prototyping interaktif',
      'Memahami Material 3 dan Apple Human Interface Guidelines'
    ],
    requirements: [
      'Menyertakan link portofolio aktif'
    ],
    benefits: [
      'Tunjangan gadget tahunan',
      'Cuti 14 hari',
      'Ruang kerja modern dan kasual'
    ]
  },
  {
    id: 'job_007',
    title: 'Mobile App Developer (Flutter)',
    company: 'InnoTech Labs',
    companyLogoBg: '#6366F1',
    companyLogoText: 'I',
    location: 'Jakarta, Indonesia',
    type: 'Full-Time',
    workplace: 'Remote',
    salary: 'IDR 9 - 16 Jt',
    salaryMin: 9000000,
    salaryMax: 16000000,
    category: 'Teknologi',
    postedDate: '04 Jun 2025',
    isNew: false,
    isFeatured: false,
    companyAbout: 'InnoTech Labs fokus pada pengembangan mobile fintech solutions.',
    description: 'Mengembangkan aplikasi cross-platform berkinerja tinggi dengan Flutter untuk jutaan nasabah aktif.',
    qualifications: [
      'Pengalaman dengan Flutter & Dart',
      'State management (Bloc/Provider/Riverpod)',
      'Integrasi REST API dan secure storage'
    ],
    requirements: ['Fresh graduate dengan proyek Flutter dipersilakan melamar'],
    benefits: ['100% Remote, tunjangan listrik & internet']
  },
  {
    id: 'job_008',
    title: 'Product Management Intern',
    company: 'Unicorn Nusantara',
    companyLogoBg: '#8B5CF6',
    companyLogoText: 'U',
    location: 'Jakarta, Indonesia',
    type: 'Internship',
    workplace: 'Hybrid',
    salary: 'IDR 4 - 6 Jt',
    salaryMin: 4000000,
    salaryMax: 6000000,
    category: 'Manajemen',
    postedDate: '03 Jun 2025',
    isNew: false,
    isFeatured: false,
    companyAbout: 'Platform teknologi terdepan yang menghubungkan jutaan pengguna di seluruh Indonesia.',
    description: 'Membantu Product Manager dalam user research, penyusunan Product Requirement Document (PRD), dan testing rilis fitur.',
    qualifications: [
      'Mahasiswa tingkat akhir atau Fresh Graduate dari semua jurusan',
      'Rasa ingin tahu tinggi terhadap produk digital',
      'Komunikasi terstruktur dan kemampuan analitis kuat'
    ],
    requirements: ['Bersedia magang selama minimal 6 bulan'],
    benefits: ['Uang saku bulanan, sertifikat resmi, mentorship 1-on-1 dengan Senior PM']
  },
  {
    id: 'job_009',
    title: 'Content Creator & Social Media',
    company: 'CreativePulse',
    companyLogoBg: '#EC4899',
    companyLogoText: 'CP',
    location: 'Bandung, Indonesia',
    type: 'Part-Time',
    workplace: 'Remote',
    salary: 'IDR 3.5 - 5 Jt',
    salaryMin: 3500000,
    salaryMax: 5000000,
    category: 'Marketing',
    postedDate: '02 Jun 2025',
    isNew: false,
    isFeatured: false,
    companyAbout: 'Media digital independen yang berfokus pada konten karier anak muda dan lifestyle.',
    description: 'Memproduksi konten video pendek (TikTok & Reels), konten carousel edukatif, dan meningkatkan engagement komunitas.',
    qualifications: [
      'Up-to-date dengan tren media sosial terkini',
      'Mampu mengedit video menggunakan CapCut / Premiere',
      'Percaya diri tampil di depan kamera'
    ],
    requirements: ['Menyertakan link akun media sosial atau portofolio konten'],
    benefits: ['Jam kerja sangat fleksibel, bonus viralitas konten']
  },
  {
    id: 'job_010',
    title: 'Data Scientist',
    company: 'DataPro',
    companyLogoBg: '#059669',
    companyLogoText: 'DS',
    location: 'Jakarta, Indonesia',
    type: 'Full-Time',
    workplace: 'Remote',
    salary: 'IDR 11 - 19 Jt',
    salaryMin: 11000000,
    salaryMax: 19000000,
    category: 'Data',
    postedDate: '01 Jun 2025',
    isNew: false,
    isFeatured: false,
    companyAbout: 'DataPro menghadirkan solusi Machine Learning dan AI prediksi untuk industri finansial dan logistik.',
    description: 'Membangun model predictive analytics, NLP, dan mengimplementasikan pipeline data untuk automasi keputusan bisnis.',
    qualifications: [
      'Keahlian kuat dalam Python (Scikit-Learn, Pandas, PyTorch)',
      'Pemahaman mendalam tentang algoritma Machine Learning',
      'Pengalaman deploy model menggunakan FastAPI atau Flask'
    ],
    requirements: ['S1/S2 Statistik, Matematika, Ilmu Komputer, atau setara'],
    benefits: ['Tunjangan remote penuh, akses komputasi GPU cloud, asuransi premium']
  }
];

const INITIAL_APPLICATIONS = [
  {
    id: 'app_001',
    jobId: 'job_001',
    title: 'Frontend Developer',
    company: 'TechCorp Indonesia',
    companyLogoBg: '#2563EB',
    companyLogoText: 'T',
    location: 'Jakarta, Indonesia',
    salary: 'IDR 8 - 15 Jt',
    appliedDate: '12 Jun 2025',
    status: 'Diterima', // Options: 'Terkirim', 'Dalam Proses', 'Wawancara', 'Diterima', 'Ditolak'
    coverLetter: 'Dengan latar belakang Teknik Informatika dan pengalaman membangun web app modern dengan React & Tailwind, saya yakin dapat berkontribusi optimal bagi TechCorp.',
    timeline: [
      { step: 'Lamaran Dikirim', date: '12 Jun 2025', status: 'done', note: 'Berkas CV dan portofolio diterima oleh sistem.' },
      { step: 'Seleksi Berkas', date: '13 Jun 2025', status: 'done', note: 'Profil sesuai kualifikasi dan lolos ke tahap berikutnya.' },
      { step: 'Wawancara Teknis', date: '15 Jun 2025', status: 'done', note: 'Sesi wawancara teknis dan live coding bersama Tech Lead.' },
      { step: 'Offering & Diterima', date: '17 Jun 2025', status: 'current', note: 'Selamat! Surat penawaran kerja resmi telah dikirim ke email Anda.' }
    ]
  },
  {
    id: 'app_002',
    jobId: 'job_010',
    title: 'Data Scientist',
    company: 'DataPro',
    companyLogoBg: '#059669',
    companyLogoText: 'DS',
    location: 'Jakarta, Indonesia',
    salary: 'IDR 11 - 19 Jt',
    appliedDate: '10 Jun 2025',
    status: 'Dalam Proses',
    coverLetter: 'Saya antusias menerapkan analisis data dan machine learning untuk memecahkan persoalan bisnis di DataPro.',
    timeline: [
      { step: 'Lamaran Dikirim', date: '10 Jun 2025', status: 'done', note: 'Lamaran Anda telah terkirim ke HR DataPro.' },
      { step: 'Sedang Ditinjau', date: '11 Jun 2025', status: 'current', note: 'Tim Talent Acquisition sedang meninjau berkas CV dan pengalaman Anda.' },
      { step: 'Wawancara HR', date: 'Menunggu', status: 'pending', note: 'Jadwal akan diinfokan jika berkas lolos seleksi.' },
      { step: 'Keputusan Akhir', date: 'Menunggu', status: 'pending', note: 'Hasil evaluasi akhir.' }
    ]
  },
  {
    id: 'app_003',
    jobId: 'job_005',
    title: 'Marketing Specialist',
    company: 'GrowthHub',
    companyLogoBg: '#10B981',
    companyLogoText: 'G',
    location: 'Jakarta, Indonesia',
    salary: 'IDR 6 - 9 Jt',
    appliedDate: '01 Jun 2025',
    status: 'Ditolak',
    coverLetter: 'Mengajukan lamaran untuk posisi marketing specialist dengan fokus data-driven digital ads.',
    timeline: [
      { step: 'Lamaran Dikirim', date: '01 Jun 2025', status: 'done', note: 'Lamaran berhasil dikirim.' },
      { step: 'Screening Berkas', date: '03 Jun 2025', status: 'done', note: 'Proses verifikasi pengalaman.' },
      { step: 'Keputusan Akhir', date: '05 Jun 2025', status: 'rejected', note: 'Terima kasih atas minat Anda. Saat ini kriteria belum sesuai kebutuhan posisi ini.' }
    ]
  },
  {
    id: 'app_004',
    jobId: 'job_006',
    title: 'UI/UX Designer',
    company: 'NextGen',
    companyLogoBg: '#EF4444',
    companyLogoText: 'N',
    location: 'Surabaya, Indonesia',
    salary: 'IDR 7 - 13 Jt',
    appliedDate: '28 Mei 2025',
    status: 'Dalam Proses',
    coverLetter: 'Portofolio desain UI/UX mobile saya mencakup riset pengguna hingga pembuatan design system.',
    timeline: [
      { step: 'Lamaran Dikirim', date: '28 Mei 2025', status: 'done', note: 'Berkas portofolio diterima.' },
      { step: 'Review Portofolio', date: '30 Mei 2025', status: 'current', note: 'Portofolio sedang dievaluasi oleh Lead Designer.' },
      { step: 'Wawancara Desain', date: 'Menunggu', status: 'pending', note: 'Presentasi studi kasus.' },
      { step: 'Keputusan Akhir', date: 'Menunggu', status: 'pending', note: 'Pengumuman hasil akhir.' }
    ]
  },
  {
    id: 'app_005',
    jobId: 'job_003',
    title: 'Backend Developer',
    company: 'TechCorp Indonesia',
    companyLogoBg: '#1D4ED8',
    companyLogoText: 'T',
    location: 'Jakarta, Indonesia',
    salary: 'IDR 10 - 18 Jt',
    appliedDate: '20 Mei 2025',
    status: 'Ditolak',
    coverLetter: 'Berminat bergabung di bagian backend engineering.',
    timeline: [
      { step: 'Lamaran Dikirim', date: '20 Mei 2025', status: 'done', note: 'Lamaran terkirim.' },
      { step: 'Keputusan Akhir', date: '24 Mei 2025', status: 'rejected', note: 'Posisi telah terisi oleh kandidat senior.' }
    ]
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif_001',
    title: 'Selamat! Lamaran Diterima 🎉',
    message: 'TechCorp Indonesia telah menerima lamaran Anda untuk posisi Frontend Developer! Silakan periksa email Anda untuk rincian penawaran resmi.',
    time: '12 Jun 2025, 14:30',
    read: false,
    type: 'success'
  },
  {
    id: 'notif_002',
    title: 'Sedang Diproses ⏳',
    message: 'Lamaran Anda untuk Data Scientist di DataPro telah masuk tahap peninjauan oleh tim rekruter.',
    time: '10 Jun 2025, 09:15',
    read: false,
    type: 'warning'
  },
  {
    id: 'notif_003',
    title: 'Lamaran Berhasil Dikirim 🚀',
    message: 'Lamaran Anda untuk posisi Frontend Developer di TechCorp Indonesia telah berhasil dikirimkan.',
    time: '12 Jun 2025, 10:00',
    read: true,
    type: 'info'
  },
  {
    id: 'notif_004',
    title: 'Rekomendasi Lowongan Baru 💼',
    message: 'Ada lowongan baru: UI/UX Designer di FutureHub yang sangat cocok dengan minat dan keahlian Anda.',
    time: '11 Jun 2025, 16:45',
    read: true,
    type: 'info'
  }
];

const CAREER_ARTICLES = [
  {
    id: 'art_001',
    title: '7 Rahasia Lolos CV ATS-Friendly untuk Fresh Graduate 2025',
    category: 'Tips CV & Portofolio',
    readTime: '4 menit baca',
    snippet: 'Pahami cara kerja sistem ATS dan buat resume yang langsung lolos tahap seleksi HR tanpa hambatan algoritma.',
    content: 'Gunakan format satu kolom dengan judul bagian yang jelas seperti Pengalaman, Pendidikan, dan Keahlian. Sesuaikan kata kunci dengan deskripsi lowongan secara jujur, tulis pencapaian dengan hasil yang terukur, dan hindari tabel, grafik, atau informasi penting di header dan footer. Simpan sebagai PDF yang teksnya dapat diseleksi, lalu periksa kembali sebelum mengirim.'
  },
  {
    id: 'art_002',
    title: 'Panduan Menjawab Pertanyaan Wawancara dengan Metode STAR',
    category: 'Persiapan Interview',
    readTime: '6 menit baca',
    snippet: 'Kuasai teknik Situation, Task, Action, Result untuk menceritakan pengalamanmu secara memukau dan terstruktur.',
    content: 'Situation: jelaskan konteks secara singkat. Task: ceritakan tanggung jawab atau targetmu. Action: uraikan tindakan spesifik yang kamu lakukan dan alasan memilihnya. Result: tutup dengan dampak yang bisa diukur serta pelajaran yang didapat. Gunakan contoh nyata dari magang, organisasi, kuliah, atau proyek pribadi.'
  },
  {
    id: 'art_003',
    title: 'Gaji Pertama & Negosiasi Benefit yang Tepat bagi Pemula',
    category: 'Strategi Karier',
    readTime: '5 menit baca',
    snippet: 'Jangan takut negosiasi! Ketahui standar gaji industri, tunjangan penting, dan etika bernegosiasi secara profesional.',
    content: 'Cari kisaran gaji untuk posisi, lokasi, dan tingkat pengalaman yang sebanding. Pertimbangkan kompensasi total seperti asuransi, bonus, tunjangan, dan pola kerja. Sampaikan ekspektasi dalam rentang yang realistis berdasarkan riset, jelaskan pertimbangannya dengan sopan, dan konfirmasikan rincian penawaran tertulis sebelum mengambil keputusan.'
  }
];

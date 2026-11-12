// ========================================================
// JOBREADY - Main Application Logic & Interactivity
// ========================================================

const App = {
  currentView: 'landing',
  activeJobFilter: 'Semua',
  activeTrackingStatus: 'Semua',
  searchQuery: '',
  pendingApplyJobId: null,
  selectedJobForDetail: null,
  selectedJobForApply: null,

  init() {
    const auth = StorageService.getAuth();
    // Keep protected routes behind login, including URLs saved before logout.
    const hash = window.location.hash.replace('#', '');
    if (hash && ['landing', 'dashboard', 'jobs', 'tracking', 'profile', 'settings'].includes(hash)) {
      this.currentView = (!auth.isLoggedIn && hash !== 'landing' && hash !== 'jobs') ? 'landing' : hash;
    } else {
      this.currentView = auth.isLoggedIn ? 'dashboard' : 'landing';
    }

    this.bindEvents();
    this.render();
  },

  navigate(viewName) {
    const auth = StorageService.getAuth();
    if (!auth.isLoggedIn && (viewName === 'dashboard' || viewName === 'tracking' || viewName === 'profile' || viewName === 'settings')) {
      this.openAuthModal('login');
      this.showToast('Silakan login terlebih dahulu untuk mengakses fitur ini.', 'warning');
      return;
    }

    this.currentView = viewName;
    window.location.hash = viewName;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.render();

    // Close mobile sidebar if open
    const sidebar = document.getElementById('appSidebar');
    if (sidebar) sidebar.classList.remove('mobile-open');
  },

  bindEvents() {
    // Global ESC key to close any active modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (document.getElementById('authModal')?.classList.contains('active')) {
          this.pendingApplyJobId = null;
        }
        this.closeAllModals();
      }
    });

    // Close modal on backdrop click
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          if (modal.id === 'authModal') this.pendingApplyJobId = null;
          this.closeAllModals();
        }
      });
    });

    // Notification dropdown close on outer click
    document.addEventListener('click', (e) => {
      const dropdown = document.getElementById('notifDropdown');
      const bellBtn = document.getElementById('notifBellBtn');
      if (dropdown && dropdown.classList.contains('show')) {
        if (!dropdown.contains(e.target) && !bellBtn.contains(e.target)) {
          dropdown.classList.remove('show');
        }
      }
    });
  },

  render() {
    this.updateNavigationUI();
    this.renderViewContent();
    this.updateNotificationsUI();
    this.updateUserProfileHeader();
  },

  updateNavigationUI() {
    const auth = StorageService.getAuth();
    const isLanding = this.currentView === 'landing';

    const landingNav = document.getElementById('landingNav');
    const appContainer = document.getElementById('appContainer');
    const appSidebar = document.getElementById('appSidebar');
    const appHeader = document.getElementById('appHeader');

    if (isLanding) {
      if (landingNav) landingNav.style.display = 'flex';
      if (appSidebar) appSidebar.style.display = 'none';
      if (appHeader) appHeader.style.display = 'none';
      if (appContainer) appContainer.style.display = 'block';

      // Update landing nav active states
      document.querySelectorAll('.landing-nav-item').forEach(el => {
        el.classList.toggle('active', el.dataset.nav === 'landing');
      });

      // Update auth buttons in landing nav
      const landingAuthContainer = document.getElementById('landingAuthActions');
      if (landingAuthContainer) {
        if (auth.isLoggedIn) {
          const user = StorageService.getUser();
          landingAuthContainer.innerHTML = `
            <button class="btn btn-primary btn-sm" onclick="App.navigate('dashboard')">
              <span>Ke Dashboard</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <div class="user-profile-chip" onclick="App.navigate('profile')">
              <img src="${user.avatar || 'assets/images/avatar_alvin.svg'}" class="user-avatar-sm" alt="${user.name}">
              <span class="user-name-mini" style="font-size:0.8rem; margin-right:4px;">${user.name}</span>
            </div>
          `;
        } else {
          landingAuthContainer.innerHTML = `
            <button class="btn btn-outline btn-sm" onclick="App.openAuthModal('login')">Masuk</button>
            <button class="btn btn-primary btn-sm" onclick="App.openAuthModal('register')">Daftar Akun</button>
          `;
        }
      }
    } else {
      // In Dashboard / App Shell
      if (landingNav) landingNav.style.display = 'none';
      if (appSidebar) appSidebar.style.display = 'flex';
      if (appHeader) appHeader.style.display = 'flex';
      if (appContainer) appContainer.style.display = 'flex';

      // Update active sidebar menu item
      document.querySelectorAll('.sidebar-link').forEach(link => {
        const targetView = link.dataset.view;
        link.classList.toggle('active', targetView === this.currentView);
      });

      // Update sidebar badge for applications
      const apps = StorageService.getApplications();
      const badgeElem = document.getElementById('sidebarAppCount');
      if (badgeElem) badgeElem.textContent = apps.length;
    }
  },

  renderViewContent() {
    const mainViewEl = document.getElementById('mainViewContainer');
    if (!mainViewEl) return;

    switch (this.currentView) {
      case 'landing':
        mainViewEl.innerHTML = this.templateLanding();
        this.renderLandingJobs();
        break;
      case 'dashboard':
        mainViewEl.innerHTML = this.templateDashboard();
        break;
      case 'jobs':
        mainViewEl.innerHTML = this.templateJobs();
        this.renderJobsList();
        break;
      case 'tracking':
        mainViewEl.innerHTML = this.templateTracking();
        this.renderTrackingList();
        break;
      case 'profile':
        mainViewEl.innerHTML = this.templateProfile();
        break;
      case 'settings':
        mainViewEl.innerHTML = this.templateSettings();
        break;
      default:
        mainViewEl.innerHTML = this.templateDashboard();
    }
  },

  // ==========================================
  // TEMPLATES
  // ==========================================

  templateLanding() {
    const searchValue = this.searchQuery
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return `
      <!-- Hero Section -->
      <section class="landing-hero">
        <div class="hero-card">
          <div class="hero-content">
            <h1>Temukan Peluang Karier Terbaik di <span style="color:#2563EB;">JOBREADY</span></h1>
            <p>Jelajahi ribuan lowongan kerja dari perusahaan ternama dan lacak lamaranmu dengan mudah dalam satu platform terpadu!</p>
            
            <div class="hero-search-bar">
              <span class="search-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </span>
              <input type="text" id="landingHeroSearchInput" value="${searchValue}" placeholder="Cari posisi, perusahaan, atau kata kunci..." oninput="App.handleLandingJobSearch(this.value)" onkeypress="if(event.key==='Enter') App.handleLandingSearch()">
              <button class="btn btn-primary" onclick="App.handleLandingSearch()">Cari</button>
            </div>
            
            <div style="margin-top: 20px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <span style="font-size: 0.8rem; font-weight: 600; color: #64748B;">Pencarian Populer:</span>
              <span class="pill-filter" style="font-size: 0.75rem; padding: 4px 12px;" onclick="App.quickSearch('Frontend Developer')">Frontend Developer</span>
              <span class="pill-filter" style="font-size: 0.75rem; padding: 4px 12px;" onclick="App.quickSearch('UI/UX Designer')">UI/UX Designer</span>
              <span class="pill-filter" style="font-size: 0.75rem; padding: 4px 12px;" onclick="App.quickSearch('Data Analyst')">Data Analyst</span>
              <span class="pill-filter" style="font-size: 0.75rem; padding: 4px 12px;" onclick="App.quickSearch('Remote')">Remote</span>
            </div>
          </div>

          <div class="hero-image-wrap">
            <img src="assets/images/hero_illustration.svg" alt="Ilustrasi Pencari Kerja JOBREADY">
          </div>
        </div>
      </section>

      <!-- Mengapa JOBREADY? -->
      <section class="section-features">
        <h2 class="section-title">Mengapa JOBREADY?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            </div>
            <div class="feature-info">
              <h4>Lowongan Terpercaya</h4>
              <p>Dari Perusahaan Ternama & terverifikasi resmi tanpa biaya tersembunyi.</p>
            </div>
          </div>

          <div class="feature-card">
            <div class="feature-icon-box" style="background:#EFF6FF; color:#2563EB;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </div>
            <div class="feature-info">
              <h4>Proses Melamar Mudah</h4>
              <p>Satu klik dengan profil tersimpan dan CV ATS-ready.</p>
            </div>
          </div>

          <div class="feature-card">
            <div class="feature-icon-box" style="background:#FFFBEB; color:#F59E0B;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            </div>
            <div class="feature-info">
              <h4>Notifikasi Update Real-Time</h4>
              <p>Pantau status lamaran mulai dari seleksi berkas hingga wawancara.</p>
            </div>
          </div>

          <div class="feature-card">
            <div class="feature-icon-box" style="background:#ECFDF5; color:#10B981;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m16 12-4-4-4 4M12 16V9"/></svg>
            </div>
            <div class="feature-info">
              <h4>Dukung Langkah Kariermu</h4>
              <p>Tips persiapan karier, rekomendasi pekerjaan personal, dan kurasi fresh grad.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Jobs Preview on Landing -->
      <section class="section-features" style="padding-top: 0;">
        <div class="section-header-row">
          <div>
            <h3 style="font-size: 1.4rem;">Lowongan Kerja</h3>
            <p style="color: #64748B; font-size: 0.9rem;">Temukan posisi yang sesuai, lihat detail, lalu lamar langsung dari halaman ini.</p>
          </div>
        </div>

        <div id="landingJobsSection" style="scroll-margin-top: 140px;">
          <div class="filter-bar-container" style="margin-top: 16px;">
            <div class="search-input-field">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input type="search" id="landingJobsSearchInput" value="${searchValue}" placeholder="Cari posisi atau perusahaan..." oninput="App.handleLandingJobSearch(this.value)">
            </div>
          </div>
          <div id="landingJobsList" class="jobs-list-container"></div>
        </div>
      </section>

      <!-- Career Tips Section -->
      <section class="section-features" id="careerTipsSection" style="padding-top: 0; scroll-margin-top: 140px;">
        <h2 class="section-title">Tips Karier & Artikel Terkini</h2>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
          ${CAREER_ARTICLES.map(art => `
            <div class="stat-card" style="flex-direction: column; align-items: flex-start;">
              <span class="badge-tag" style="background:#EFF6FF; color:#2563EB;">${art.category}</span>
              <h4 style="font-size: 1.05rem; margin-top: 10px; color: #172554;">${art.title}</h4>
              <p style="font-size: 0.85rem; color: #64748B; margin-top: 8px;">${art.snippet}</p>
              <div style="display: flex; align-items: center; width: 100%; margin-top: 14px; font-size: 0.78rem; color: #94A3B8;">
                <span>${art.readTime}</span>
              </div>
              <details style="width: 100%; margin-top: 10px; font-size: 0.85rem; color: #475569;">
                <summary style="color: #2563EB; font-weight: 600; cursor: pointer;">Baca Selengkapnya</summary>
                <p style="margin-top: 8px; line-height: 1.6;">${art.content}</p>
              </details>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Landing Footer -->
      <footer style="background: #FFFFFF; border-top: 1px solid #E2E8F0; padding: 48px 40px 32px 40px; margin-top: 40px;">
        <div style="max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 40px;">
          <div>
            <img src="assets/images/logo.svg" alt="JOBREADY Logo" style="height: 38px; margin-bottom: 14px;">
            <p style="font-size: 0.9rem; color: #64748B; line-height: 1.6; max-width: 320px;">
              Langkah tepat menuju karier impianmu. Platform pencarian lowongan kerja terpercaya dan pelacakan proses lamaran terpadu.
            </p>
          </div>
          <div>
            <h5 style="font-size: 0.95rem; color: #172554; margin-bottom: 14px;">Untuk Pencari Kerja</h5>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 0.88rem; color: #64748B;">
              <li style="cursor: pointer;" onclick="App.scrollToLandingSection('landingJobsSection')">Eksplorasi Lowongan</li>
              <li style="cursor: pointer;" onclick="App.navigate('tracking')">Lacak Status Lamaran</li>
              <li style="cursor: pointer;" onclick="App.navigate('profile')">Buat CV ATS-Friendly</li>
              <li style="cursor: pointer;" onclick="App.showToast('Tips interview segera tersedia!', 'info')">Simulasi Wawancara</li>
            </ul>
          </div>
          <div>
            <h5 style="font-size: 0.95rem; color: #172554; margin-bottom: 14px;">Kategori Populer</h5>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 0.88rem; color: #64748B;">
              <li style="cursor: pointer;" onclick="App.quickSearch('Frontend')">Software Engineering</li>
              <li style="cursor: pointer;" onclick="App.quickSearch('Desain')">UI/UX & Product Design</li>
              <li style="cursor: pointer;" onclick="App.quickSearch('Data')">Data Science & Analytics</li>
              <li style="cursor: pointer;" onclick="App.quickSearch('Marketing')">Digital Marketing</li>
            </ul>
          </div>
          <div>
            <h5 id="aboutSection" style="font-size: 0.95rem; color: #172554; margin-bottom: 14px; scroll-margin-top: 140px;">Tentang JOBREADY</h5>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 0.88rem; color: #64748B;">
              <li>Tentang Perusahaan</li>
              <li>Pusat Bantuan</li>
              <li>Kebijakan Privasi</li>
              <li>Syarat & Ketentuan</li>
            </ul>
          </div>
        </div>
        <div style="max-width: 1280px; margin: 0 auto; border-top: 1px solid #F1F5F9; padding-top: 24px; display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem; color: #94A3B8;">
          <span>&copy; 2025 JOBREADY. Hak Cipta Dilindungi Undang-Undang.</span>
          <span>Didesain dengan dominasi Biru (#2563EB) & Navy (#172554)</span>
        </div>
      </footer>
    `;
  },

  templateDashboard() {
    const user = StorageService.getUser();
    const apps = StorageService.getApplications();
    const totalApps = apps.length;
    const acceptedApps = apps.filter(a => a.status === 'Diterima').length;
    const inProgressApps = apps.filter(a => a.status === 'Dalam Proses' || a.status === 'Terkirim' || a.status === 'Wawancara').length;

    const recommendedJobs = StorageService.getJobs().slice(0, 2);
    const recentApplications = apps.slice(0, 3);

    return `
      <!-- 3 Stat Cards Matching Mockup -->
      <div class="stats-grid">
        <!-- Total Lamaran -->
        <div class="stat-card">
          <div class="stat-icon-wrapper stat-icon-blue">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
          </div>
          <div class="stat-content">
            <div class="stat-label">Total Lamaran</div>
            <div class="stat-value">${totalApps}</div>
            <div class="stat-trend positive">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>
              <span>+1 dari bulan lalu</span>
            </div>
          </div>
        </div>

        <!-- Lamaran Diterima -->
        <div class="stat-card">
          <div class="stat-icon-wrapper stat-icon-green">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <div class="stat-content">
            <div class="stat-label">Lamaran Diterima</div>
            <div class="stat-value">${acceptedApps}</div>
            <div class="stat-trend neutral">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>
              <span>+0 dari bulan lalu</span>
            </div>
          </div>
        </div>

        <!-- Dalam Proses -->
        <div class="stat-card">
          <div class="stat-icon-wrapper stat-icon-amber">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div class="stat-content">
            <div class="stat-label">Dalam Proses</div>
            <div class="stat-value">${inProgressApps}</div>
            <div class="stat-trend positive">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>
              <span>+1 dari bulan lalu</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Rekomendasi Lowongan & Status Lamaran Terbaru (Dual Column) -->
      <div class="dashboard-grid-dual">
        <!-- Rekomendasi Lowongan -->
        <div>
          <div class="section-header-row">
            <h3>Rekomendasi Lowongan</h3>
            <span class="link-view-all" onclick="App.navigate('jobs')">Lihat Semua &rarr;</span>
          </div>

          <div class="recommend-cards-list">
            ${recommendedJobs.map(job => `
              <div class="job-card-horizontal">
                <div class="job-card-left">
                  <div class="company-logo-box" style="background: ${job.companyLogoBg};">${job.companyLogoText}</div>
                  <div>
                    <div class="job-title-row">
                      <h4>${job.title}</h4>
                      ${job.isNew ? '<span class="badge-tag badge-new">Baru</span>' : ''}
                    </div>
                    <div class="job-company-name">${job.company}</div>
                    <div class="job-meta-row">
                      <span class="badge-location">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        ${job.location}
                      </span>
                      <span class="badge-tag badge-primary">${job.workplace}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <button class="btn btn-primary btn-sm" onclick="App.openJobDetail('${job.id}')">Lamar Sekarang</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Status Lamaran Terbaru -->
        <div>
          <div class="section-header-row">
            <h3>Status Lamaran Terbaru</h3>
            <span class="link-view-all" onclick="App.navigate('tracking')">Lihat Semua &rarr;</span>
          </div>

          <div class="timeline-card">
            <div class="timeline-recent-list">
              ${recentApplications.map(app => {
                let dotColor = 'amber';
                let statusLabel = 'Sedang Diproses';
                if (app.status === 'Diterima') {
                  dotColor = 'green';
                  statusLabel = 'Lamaran Diterima';
                } else if (app.status === 'Ditolak') {
                  dotColor = 'red';
                  statusLabel = 'Lamaran Ditolak';
                } else if (app.status === 'Terkirim') {
                  dotColor = 'blue';
                  statusLabel = 'Lamaran Dikirim';
                }

                return `
                  <div class="timeline-item" style="cursor: pointer;" onclick="App.navigate('tracking')">
                    <div class="timeline-dot ${dotColor}"></div>
                    <div class="timeline-info">
                      <div class="timeline-status-title">${statusLabel}</div>
                      <div class="timeline-job-target">${app.title} (${app.company})</div>
                      <div class="timeline-date-stamp">${app.appliedDate}</div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  templateJobs() {
    return `
      <div class="page-title-group">
        <h2>Lowongan Kerja</h2>
        <p>Temukan pekerjaan yang sesuai dengan minat dan keahlianmu.</p>
      </div>

      <!-- Filter & Search Bar Container -->
      <div class="filter-bar-container">
        <div class="search-input-wrapper">
          <div class="search-input-field">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input type="text" id="jobsSearchInput" placeholder="Cari posisi atau perusahaan..." oninput="App.handleJobSearch(this.value)">
          </div>

          <select class="form-control" style="width: 170px;" id="jobsCategoryFilter" onchange="App.handleCategoryFilter(this.value)">
            <option value="Semua">Semua Kategori</option>
            <option value="Teknologi">Teknologi</option>
            <option value="Desain">Desain</option>
            <option value="Data">Data</option>
            <option value="Marketing">Marketing</option>
            <option value="Manajemen">Manajemen</option>
          </select>

          <select class="form-control" style="width: 170px;" id="jobsLocationFilter" onchange="App.handleLocationFilter(this.value)">
            <option value="Semua">Semua Lokasi</option>
            <option value="Jakarta">Jakarta</option>
            <option value="Bandung">Bandung</option>
            <option value="Surabaya">Surabaya</option>
            <option value="Remote">Remote</option>
          </select>
        </div>

        <!-- Filter Pills Matching Mockup -->
        <div class="filter-pills-row">
          <button class="pill-filter ${this.activeJobFilter === 'Semua' ? 'active' : ''}" onclick="App.filterJobType('Semua')">Semua</button>
          <button class="pill-filter ${this.activeJobFilter === 'Full-Time' ? 'active' : ''}" onclick="App.filterJobType('Full-Time')">Full-Time</button>
          <button class="pill-filter ${this.activeJobFilter === 'Part-Time' ? 'active' : ''}" onclick="App.filterJobType('Part-Time')">Part-Time</button>
          <button class="pill-filter ${this.activeJobFilter === 'Internship' ? 'active' : ''}" onclick="App.filterJobType('Internship')">Internship</button>
          <button class="pill-filter ${this.activeJobFilter === 'Remote' ? 'active' : ''}" onclick="App.filterJobType('Remote')">Remote</button>
          <button class="pill-filter ${this.activeJobFilter === 'Hybrid' ? 'active' : ''}" onclick="App.filterJobType('Hybrid')">Hybrid</button>
          <button class="pill-filter ${this.activeJobFilter === 'On-site' ? 'active' : ''}" onclick="App.filterJobType('On-site')">On-site</button>
        </div>
      </div>

      <!-- Jobs List Render Container -->
      <div id="jobsListRenderContainer" class="jobs-list-container">
        <!-- Rendered dynamically -->
      </div>
    `;
  },

  renderLandingJobs() {
    const container = document.getElementById('landingJobsList');
    if (!container) return;

    const query = this.searchQuery.toLowerCase().trim();
    const jobs = StorageService.getJobs().filter(job => {
      return !query || [job.title, job.company, job.description, job.location, job.category]
        .some(value => value.toLowerCase().includes(query));
    });

    if (jobs.length === 0) {
      container.innerHTML = `
        <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:16px; padding:36px 24px; text-align:center;">
          <h4 style="font-size:1.1rem; color:#172554;">Tidak ada lowongan yang cocok</h4>
          <p style="color:#64748B; font-size:0.9rem; margin-top:4px;">Coba kata kunci lain.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = jobs.map(job => {
      const isSaved = StorageService.isJobSaved(job.id);
      return `
        <div class="job-card-rich" onclick="App.openJobDetail('${job.id}')">
          <div class="job-card-main-info">
            <div class="company-logo-box" style="background:${job.companyLogoBg};">${job.companyLogoText}</div>
            <div>
              <div class="job-title-row">
                <h4>${job.title}</h4>
                ${job.isNew ? '<span class="badge-tag badge-new">Baru</span>' : ''}
              </div>
              <div class="job-company-name">${job.company}</div>
              <div class="job-meta-row">
                <span class="badge-location">${job.location}</span>
                <span class="badge-tag badge-primary">${job.type}</span>
                <span class="badge-tag" style="background:#F1F5F9; color:#475569;">${job.workplace}</span>
              </div>
            </div>
          </div>
          <div class="job-card-actions" onclick="event.stopPropagation()">
            <div class="job-salary-tag">${job.salary}</div>
            <button class="btn-icon-only" title="${isSaved ? 'Hapus dari Simpanan' : 'Simpan Lowongan'}" onclick="App.toggleSaveJob('${job.id}', event)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${isSaved ? '#EF4444' : 'none'}" stroke="${isSaved ? '#EF4444' : 'currentColor'}" stroke-width="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
            </button>
            <button class="btn btn-outline btn-sm" onclick="App.openJobDetail('${job.id}')">Detail</button>
            <button class="btn btn-primary btn-sm" onclick="App.openApplyModal('${job.id}')">Lamar</button>
          </div>
        </div>
      `;
    }).join('');
  },

  renderJobsList() {
    const container = document.getElementById('jobsListRenderContainer');
    if (!container) return;

    let jobs = StorageService.getJobs();
    const query = this.searchQuery.toLowerCase().trim();
    const cat = document.getElementById('jobsCategoryFilter') ? document.getElementById('jobsCategoryFilter').value : 'Semua';
    const loc = document.getElementById('jobsLocationFilter') ? document.getElementById('jobsLocationFilter').value : 'Semua';

    if (query) {
      jobs = jobs.filter(j => j.title.toLowerCase().includes(query) || j.company.toLowerCase().includes(query) || j.description.toLowerCase().includes(query));
    }

    if (this.activeJobFilter !== 'Semua') {
      jobs = jobs.filter(j => j.type === this.activeJobFilter || j.workplace === this.activeJobFilter);
    }

    if (cat !== 'Semua') {
      jobs = jobs.filter(j => j.category === cat);
    }

    if (loc !== 'Semua') {
      if (loc === 'Remote') {
        jobs = jobs.filter(j => j.workplace === 'Remote');
      } else {
        jobs = jobs.filter(j => j.location.toLowerCase().includes(loc.toLowerCase()));
      }
    }

    if (jobs.length === 0) {
      container.innerHTML = `
        <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:16px; padding:48px 24px; text-align:center;">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="1.8" style="margin-bottom:12px;"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <h4 style="font-size:1.1rem; color:#172554;">Tidak ada lowongan yang cocok</h4>
          <p style="color:#64748B; font-size:0.9rem; margin-top:4px;">Coba gunakan kata kunci lain atau ubah filter pencarian Anda.</p>
          <button class="btn btn-outline btn-sm" style="margin-top:16px;" onclick="App.resetJobFilters()">Reset Filter</button>
        </div>
      `;
      return;
    }

    container.innerHTML = jobs.map(job => {
      const isSaved = StorageService.isJobSaved(job.id);
      return `
        <div class="job-card-rich" onclick="App.openJobDetail('${job.id}')">
          <div class="job-card-main-info">
            <div class="company-logo-box" style="background: ${job.companyLogoBg};">${job.companyLogoText}</div>
            <div>
              <div class="job-title-row">
                <h4>${job.title}</h4>
                ${job.isNew ? '<span class="badge-tag badge-new">Baru</span>' : ''}
              </div>
              <div class="job-company-name">${job.company}</div>
              <div class="job-meta-row">
                <span class="badge-location">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  ${job.location}
                </span>
                <span class="badge-tag badge-primary">${job.type}</span>
                <span class="badge-tag" style="background:#F1F5F9; color:#475569;">${job.workplace}</span>
              </div>
            </div>
          </div>

          <div class="job-card-actions" onclick="event.stopPropagation()">
            <div class="job-salary-tag">${job.salary}</div>
            <button class="btn-icon-only" title="${isSaved ? 'Hapus dari Simpanan' : 'Simpan Lowongan'}" onclick="App.toggleSaveJob('${job.id}', event)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${isSaved ? '#EF4444' : 'none'}" stroke="${isSaved ? '#EF4444' : 'currentColor'}" stroke-width="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
            </button>
            <button class="btn btn-primary btn-sm" onclick="App.openJobDetail('${job.id}')">Detail</button>
          </div>
        </div>
      `;
    }).join('');
  },

  handleJobSearch(val) {
    this.searchQuery = val;
    this.renderJobsList();
  },

  handleCategoryFilter() {
    this.renderJobsList();
  },

  handleLocationFilter() {
    this.renderJobsList();
  },

  filterJobType(type) {
    this.activeJobFilter = type;
    document.querySelectorAll('.pill-filter').forEach(btn => {
      btn.classList.toggle('active', btn.textContent.trim() === type);
    });
    this.renderJobsList();
  },

  resetJobFilters() {
    this.searchQuery = '';
    this.activeJobFilter = 'Semua';
    const searchInput = document.getElementById('jobsSearchInput');
    if (searchInput) searchInput.value = '';
    const cat = document.getElementById('jobsCategoryFilter');
    if (cat) cat.value = 'Semua';
    const loc = document.getElementById('jobsLocationFilter');
    if (loc) loc.value = 'Semua';
    this.filterJobType('Semua');
  },

  templateTracking() {
    const apps = StorageService.getApplications();
    const totalCount = apps.length;
    const processCount = apps.filter(a => a.status === 'Dalam Proses' || a.status === 'Terkirim' || a.status === 'Wawancara').length;
    const acceptedCount = apps.filter(a => a.status === 'Diterima').length;
    const rejectedCount = apps.filter(a => a.status === 'Ditolak').length;

    return `
      <div class="page-title-group" style="margin-bottom: 24px;">
        <h2>Lamaran Saya</h2>
        <p>Pantau status dan perkembangan setiap lamaran pekerjaanmu secara real-time.</p>
      </div>

      <!-- Filter Tabs Matching Mockup -->
      <div class="tracking-tabs-header">
        <div class="tracking-tab ${this.activeTrackingStatus === 'Semua' ? 'active' : ''}" onclick="App.filterTrackingStatus('Semua')">Semua (${totalCount})</div>
        <div class="tracking-tab ${this.activeTrackingStatus === 'Dalam Proses' ? 'active' : ''}" onclick="App.filterTrackingStatus('Dalam Proses')">Dalam Proses (${processCount})</div>
        <div class="tracking-tab ${this.activeTrackingStatus === 'Diterima' ? 'active' : ''}" onclick="App.filterTrackingStatus('Diterima')">Diterima (${acceptedCount})</div>
        <div class="tracking-tab ${this.activeTrackingStatus === 'Ditolak' ? 'active' : ''}" onclick="App.filterTrackingStatus('Ditolak')">Ditolak (${rejectedCount})</div>
      </div>

      <!-- Application Tracking Cards List -->
      <div id="trackingListContainer">
        <!-- Rendered dynamically -->
      </div>
    `;
  },

  renderTrackingList() {
    const container = document.getElementById('trackingListContainer');
    if (!container) return;

    let apps = StorageService.getApplications();

    if (this.activeTrackingStatus !== 'Semua') {
      if (this.activeTrackingStatus === 'Dalam Proses') {
        apps = apps.filter(a => a.status === 'Dalam Proses' || a.status === 'Terkirim' || a.status === 'Wawancara');
      } else {
        apps = apps.filter(a => a.status === this.activeTrackingStatus);
      }
    }

    if (apps.length === 0) {
      container.innerHTML = `
        <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:16px; padding:48px 24px; text-align:center;">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="1.8" style="margin-bottom:12px;"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          <h4 style="font-size:1.1rem; color:#172554;">Belum ada lamaran pada status ini</h4>
          <p style="color:#64748B; font-size:0.9rem; margin-top:4px;">Jelajahi lowongan yang sesuai minatmu dan mulai kirimkan lamaran.</p>
          <button class="btn btn-primary btn-sm" style="margin-top:16px;" onclick="App.navigate('jobs')">Cari Lowongan</button>
        </div>
      `;
      return;
    }

    container.innerHTML = apps.map(app => {
      let badgeClass = 'dalam-proses';
      if (app.status === 'Diterima') badgeClass = 'diterima';
      else if (app.status === 'Ditolak') badgeClass = 'ditolak';
      else if (app.status === 'Terkirim') badgeClass = 'terkirim';
      else if (app.status === 'Wawancara') badgeClass = 'wawancara';

      return `
        <div class="app-tracking-card">
          <div class="app-tracking-header">
            <div style="display: flex; align-items: center; gap: 16px;">
              <div class="company-logo-box" style="background: ${app.companyLogoBg || '#2563EB'};">${app.companyLogoText || 'J'}</div>
              <div>
                <h4 style="font-size: 1.1rem; color: #172554; font-weight: 700;">${app.title}</h4>
                <div style="font-size: 0.9rem; color: #64748B; margin-top: 2px;">${app.company} &bull; ${app.location}</div>
                <div style="font-size: 0.8rem; color: #94A3B8; margin-top: 4px;">Dilamar pada: <strong>${app.appliedDate}</strong></div>
              </div>
            </div>

            <div style="text-align: right;">
              <span class="status-badge ${badgeClass}">${app.status}</span>
              <div style="margin-top: 6px; font-size: 0.82rem; font-weight: 600; color: #2563EB;">${app.salary || ''}</div>
            </div>
          </div>

          <!-- Dynamic Timeline -->
          <div class="tracking-timeline-bar">
            ${(app.timeline || []).map((step, idx) => `
              <div class="step-node ${step.status}">
                <div class="step-header">
                  <div class="step-dot">${idx + 1}</div>
                  <div class="step-title">${step.step}</div>
                </div>
                <div class="step-desc">${step.date} - ${step.note}</div>
              </div>
            `).join('')}
          </div>

          <!-- Actions Bar -->
          <div class="app-actions-bar">
            <button class="btn btn-outline btn-sm" onclick="App.openJobDetail('${app.jobId}')">Lihat Lowongan</button>
          </div>
        </div>
      `;
    }).join('');
  },

  filterTrackingStatus(status) {
    this.activeTrackingStatus = status;
    document.querySelectorAll('.tracking-tab').forEach(tab => {
      tab.classList.toggle('active', tab.textContent.startsWith(status));
    });
    this.renderTrackingList();
  },

  templateProfile() {
    const user = StorageService.getUser();
    return `
      <div class="page-title-group">
        <h2>Profil Saya</h2>
        <p>Kelola data profil, keahlian, pengalaman, dan dokumen CV Anda.</p>
      </div>

      <div class="profile-layout">
        <!-- Main Card Matching Mockup Left -->
        <div class="profile-card-main">
          <img src="${user.avatar || 'assets/images/avatar_alvin.svg'}" class="profile-avatar-large" alt="${user.name}">
          <h3 class="profile-name">${user.name}</h3>
          <p class="profile-email">${user.email}</p>
          <p style="font-size: 0.85rem; color: #64748B; margin-bottom: 20px;">${user.title}</p>
          <button class="btn btn-primary btn-sm" style="width: 100%;" onclick="App.openEditProfileModal()">Edit Profil</button>

          <!-- CV Document Card Matching Mockup -->
          <div style="width: 100%; margin-top: 28px; text-align: left;">
            <label style="font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: #64748B;">Dokumen CV</label>
            <div class="cv-file-card">
              <div class="cv-file-left">
                <div class="cv-icon-box">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div>
                  <div class="cv-file-name">${user.cv.fileName}</div>
                  <div class="cv-file-size">${user.cv.fileSize} &bull; Diunggah ${user.cv.uploadedAt}</div>
                </div>
              </div>

              <div class="cv-file-actions">
                <a href="assets/documents/CV_Alvin.pdf" download="CV_Alvin.pdf" class="btn-icon-only" title="Unduh CV">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                </a>
                <button class="btn-icon-only" title="Unggah CV Baru" onclick="document.getElementById('uploadCvInput').click()">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                </button>
                <input type="file" id="uploadCvInput" style="display:none;" accept=".pdf" onchange="App.handleUploadCv(event)">
              </div>
            </div>
          </div>
        </div>

        <!-- Details Card Matching Mockup Right -->
        <div class="profile-details-card">
          <div class="profile-section-title">Informasi Pribadi</div>
          <div class="info-grid-2col">
            <div class="info-item">
              <label>Nama Lengkap</label>
              <span>${user.name}</span>
            </div>
            <div class="info-item">
              <label>Email</label>
              <span>${user.email}</span>
            </div>
            <div class="info-item">
              <label>No. Telepon</label>
              <span>${user.phone}</span>
            </div>
            <div class="info-item">
              <label>Lokasi</label>
              <span>${user.location}</span>
            </div>
          </div>

          <div class="profile-section-title" style="margin-top: 10px;">Ringkasan Profil</div>
          <p style="font-size: 0.95rem; color: #475569; line-height: 1.6; margin-bottom: 24px;">
            ${user.bio}
          </p>

          <div class="profile-section-title">Pendidikan</div>
          <div style="margin-bottom: 24px;">
            <h4 style="font-size: 1rem; color: #172554;">${user.education.degree}</h4>
            <p style="font-size: 0.88rem; color: #64748B;">${user.education.institution} &bull; ${user.education.period}</p>
            <p style="font-size: 0.82rem; color: #10B981; font-weight: 600; margin-top: 2px;">IPK: ${user.education.gpa}</p>
          </div>

          <div class="profile-section-title">Pengalaman Kerja</div>
          <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px;">
            ${user.experiences.map(exp => `
              <div style="border-left: 2px solid #2563EB; padding-left: 14px;">
                <h4 style="font-size: 0.95rem; color: #172554;">${exp.role}</h4>
                <div style="font-size: 0.85rem; color: #64748B;">${exp.company} &bull; ${exp.period}</div>
                <div style="font-size: 0.85rem; color: #475569; margin-top: 4px;">${exp.description}</div>
              </div>
            `).join('')}
          </div>

          <div class="profile-section-title">Keahlian</div>
          <div class="skills-tags-wrap">
            ${user.skills.map(sk => `
              <span class="skill-pill">${sk}</span>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  templateSettings() {
    const user = StorageService.getUser();
    return `
      <div class="page-title-group">
        <h2>Pengaturan</h2>
        <p>Konfigurasi akun, preferensi notifikasi, dan reset data simulasi.</p>
      </div>

      <div style="max-width: 800px; display: flex; flex-direction: column; gap: 24px;">
        <!-- Pengaturan Akun -->
        <div class="profile-details-card">
          <div class="profile-section-title">Pengaturan Akun</div>
          <form onsubmit="App.saveAccountSettings(event)">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Nama Lengkap</label>
                <input type="text" class="form-control" id="settingsName" value="${user.name}" required>
              </div>
              <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" id="settingsEmail" value="${user.email}" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">No. Telepon</label>
                <input type="text" class="form-control" id="settingsPhone" value="${user.phone}" required>
              </div>
              <div class="form-group">
                <label class="form-label">Lokasi Domisili</label>
                <input type="text" class="form-control" id="settingsLocation" value="${user.location}" required>
              </div>
            </div>
            <button type="submit" class="btn btn-primary btn-sm">Simpan Perubahan Akun</button>
          </form>
        </div>

        <!-- Ubah Password -->
        <div class="profile-details-card">
          <div class="profile-section-title">Ubah Password</div>
          <form onsubmit="App.saveNewPassword(event)">
            <div class="form-group">
              <label class="form-label">Password Saat Ini</label>
              <input type="password" class="form-control" placeholder="Masukkan password saat ini" required>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Password Baru</label>
                <input type="password" class="form-control" id="newPassInput" placeholder="Minimal 8 karakter" required>
              </div>
              <div class="form-group">
                <label class="form-label">Konfirmasi Password Baru</label>
                <input type="password" class="form-control" id="newPassConfirmInput" placeholder="Ulangi password baru" required>
              </div>
            </div>
            <button type="submit" class="btn btn-primary btn-sm">Perbarui Password</button>
          </form>
        </div>

        <!-- Preferensi Notifikasi -->
        <div class="profile-details-card">
          <div class="profile-section-title">Preferensi Notifikasi</div>
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
              <input type="checkbox" checked style="width: 18px; height: 18px;">
              <span style="font-size: 0.95rem; color: #172554;">Notifikasi email saat status lamaran berubah</span>
            </label>
            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
              <input type="checkbox" checked style="width: 18px; height: 18px;">
              <span style="font-size: 0.95rem; color: #172554;">Rekomendasi lowongan mingguan berdasarkan keahlian</span>
            </label>
            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
              <input type="checkbox" checked style="width: 18px; height: 18px;">
              <span style="font-size: 0.95rem; color: #172554;">Notifikasi pop-up real-time di aplikasi</span>
            </label>
          </div>
        </div>

        <!-- Demo Reset -->
        <div class="profile-details-card" style="border-color: #FECACA; background: #FFF5F5;">
          <div class="profile-section-title" style="color: #991B1B; border-bottom-color: #FEE2E2;">Data Demo & Prototype</div>
          <p style="font-size: 0.88rem; color: #7F1D1D; margin-bottom: 16px;">
            Ingin mengembalikan data prototype lamaran, notifikasi, dan profil ke kondisi default awal?
          </p>
          <button class="btn btn-danger btn-sm" onclick="App.handleResetDemoData()">Reset Data Prototype ke Semula</button>
        </div>
      </div>
    `;
  },

  // ==========================================
  // DETAIL LOWONGAN & APPLY MODAL
  // ==========================================

  openJobDetail(jobId) {
    const job = StorageService.getJobById(jobId);
    if (!job) return;

    this.selectedJobForDetail = job;
    const isSaved = StorageService.isJobSaved(job.id);
    const modalEl = document.getElementById('jobDetailModal');
    const contentEl = document.getElementById('jobDetailContent');

    contentEl.innerHTML = `
      <!-- Back button and top action row matching Mockup 5 -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
        <button class="btn btn-secondary btn-sm" onclick="App.closeAllModals()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          <span>Detail Lowongan</span>
        </button>

        <div style="display: flex; gap: 8px;">
          <button class="btn-icon-only" title="Simpan Lowongan" onclick="App.toggleSaveJob('${job.id}', event)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isSaved ? '#EF4444' : 'none'}" stroke="${isSaved ? '#EF4444' : 'currentColor'}" stroke-width="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
          </button>
          <button class="btn-icon-only" title="Bagikan Lowongan" onclick="App.shareJob('${job.title}', '${job.company}')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          </button>
        </div>
      </div>

      <!-- Job Header Card -->
      <div style="display: flex; align-items: center; gap: 18px; margin-bottom: 22px;">
        <div class="company-logo-box" style="background: ${job.companyLogoBg}; width: 64px; height: 64px; font-size: 1.6rem;">${job.companyLogoText}</div>
        <div>
          <h2 style="font-size: 1.4rem; color: #172554;">${job.title}</h2>
          <div style="font-size: 1rem; color: #64748B; font-weight: 500;">${job.company}</div>
          <div style="display: flex; align-items: center; gap: 10px; margin-top: 8px; flex-wrap: wrap;">
            <span class="badge-tag badge-primary">${job.type}</span>
            <span class="badge-tag" style="background: #F1F5F9; color: #475569;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 4px;"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              ${job.location}
            </span>
            <span class="badge-tag" style="background: #ECFDF5; color: #065F46; font-weight: 700;">${job.salary}</span>
          </div>
        </div>
      </div>

      <div style="border-top: 1px solid #F1F5F9; padding-top: 18px; margin-bottom: 20px;">
        <h4 style="font-size: 1.05rem; color: #172554; margin-bottom: 8px;">Deskripsi Pekerjaan</h4>
        <p style="font-size: 0.95rem; color: #475569; line-height: 1.6;">${job.description}</p>
      </div>

      <div style="margin-bottom: 20px;">
        <h4 style="font-size: 1.05rem; color: #172554; margin-bottom: 8px;">Kualifikasi</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px;">
          ${job.qualifications.map(q => `
            <li style="display: flex; align-items: flex-start; gap: 10px; font-size: 0.92rem; color: #334155;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="3" style="flex-shrink:0; margin-top:2px;"><polyline points="20 6 9 17 4 12"/></svg>
              <span>${q}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <div style="margin-bottom: 20px;">
        <h4 style="font-size: 1.05rem; color: #172554; margin-bottom: 8px;">Benefit & Fasilitas</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px;">
          ${job.benefits.map(b => `
            <li style="display: flex; align-items: flex-start; gap: 10px; font-size: 0.92rem; color: #334155;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.5" style="flex-shrink:0; margin-top:2px;"><polyline points="20 6 9 17 4 12"/></svg>
              <span>${b}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
        <h4 style="font-size: 0.95rem; color: #172554; margin-bottom: 4px;">Tentang Perusahaan</h4>
        <p style="font-size: 0.85rem; color: #64748B; line-height: 1.5;">${job.companyAbout}</p>
      </div>

      <!-- Footer CTA Buttons Matching Mockup 5 -->
      <div style="display: flex; align-items: center; gap: 12px; position: sticky; bottom: 0; background: #FFFFFF; padding: 16px 0 0 0; border-top: 1px solid #E2E8F0;">
        <button class="btn btn-primary" style="flex: 1;" onclick="App.openApplyModal('${job.id}')">
          <span>Lamar Sekarang</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
        <button class="btn-icon-only" style="padding: 12px;" title="Simpan Lowongan" onclick="App.toggleSaveJob('${job.id}', event)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="${isSaved ? '#EF4444' : 'none'}" stroke="${isSaved ? '#EF4444' : 'currentColor'}" stroke-width="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
        </button>
      </div>
    `;

    modalEl.classList.add('active');
  },

  openApplyModal(jobId) {
    const job = StorageService.getJobById(jobId);
    if (!job) return;

    const auth = StorageService.getAuth();
    if (!auth.isLoggedIn) {
      this.closeAllModals();
      this.openAuthModal('login', jobId);
      this.showToast('Silakan login terlebih dahulu untuk mengirim lamaran.', 'warning');
      return;
    }

    this.selectedJobForApply = job;
    const user = StorageService.getUser();

    document.getElementById('applyJobTitle').textContent = job.title;
    document.getElementById('applyCompanyName').textContent = job.company;

    document.getElementById('applyName').value = user.name;
    document.getElementById('applyEmail').value = user.email;
    document.getElementById('applyPhone').value = user.phone;
    document.getElementById('applyCvName').textContent = user.cv.fileName + ' (' + user.cv.fileSize + ')';

    // Close detail modal, open apply modal
    document.getElementById('jobDetailModal').classList.remove('active');
    document.getElementById('jobApplyModal').classList.add('active');
  },

  submitApplication(event) {
    event.preventDefault();
    if (!this.selectedJobForApply) return;

    const user = StorageService.getUser();
    const appDetails = {
      name: document.getElementById('applyName').value,
      email: document.getElementById('applyEmail').value,
      phone: document.getElementById('applyPhone').value,
      coverLetter: document.getElementById('applyCoverLetter').value,
      cvName: user.cv.fileName
    };

    const result = StorageService.submitApplication(this.selectedJobForApply.id, appDetails);
    this.closeAllModals();

    if (result.success) {
      this.showToast(`Lamaran untuk ${this.selectedJobForApply.title} berhasil dikirim!`, 'success');
      this.navigate('tracking');
    } else {
      this.showToast(result.message || 'Gagal mengirim lamaran.', 'warning');
    }
  },

  // ==========================================
  // PROFILE EDITING & CV UPLOAD
  // ==========================================

  openEditProfileModal() {
    const user = StorageService.getUser();
    document.getElementById('editProfileName').value = user.name;
    document.getElementById('editProfileEmail').value = user.email;
    document.getElementById('editProfilePhone').value = user.phone;
    document.getElementById('editProfileLocation').value = user.location;
    document.getElementById('editProfileTitle').value = user.title;
    document.getElementById('editProfileBio').value = user.bio;
    document.getElementById('editProfileSkills').value = user.skills.join(', ');

    document.getElementById('editProfileModal').classList.add('active');
  },

  saveProfile(event) {
    event.preventDefault();
    const user = StorageService.getUser();
    user.name = document.getElementById('editProfileName').value.trim();
    user.email = document.getElementById('editProfileEmail').value.trim();
    user.phone = document.getElementById('editProfilePhone').value.trim();
    user.location = document.getElementById('editProfileLocation').value.trim();
    user.title = document.getElementById('editProfileTitle').value.trim();
    user.bio = document.getElementById('editProfileBio').value.trim();

    const skillsStr = document.getElementById('editProfileSkills').value;
    user.skills = skillsStr.split(',').map(s => s.trim()).filter(Boolean);

    StorageService.saveUser(user);
    this.closeAllModals();
    this.showToast('Profil Anda berhasil diperbarui!', 'success');
    this.render();
  },

  handleUploadCv(event) {
    const file = event.target.files[0];
    if (!file) return;

    const user = StorageService.getUser();
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    const todayStr = new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date());

    user.cv = {
      fileName: file.name,
      fileSize: sizeMb,
      uploadedAt: todayStr
    };

    StorageService.saveUser(user);
    this.showToast(`CV "${file.name}" berhasil diunggah!`, 'success');
    this.render();
  },

  saveAccountSettings(event) {
    event.preventDefault();
    const user = StorageService.getUser();
    user.name = document.getElementById('settingsName').value;
    user.email = document.getElementById('settingsEmail').value;
    user.phone = document.getElementById('settingsPhone').value;
    user.location = document.getElementById('settingsLocation').value;
    StorageService.saveUser(user);
    this.showToast('Pengaturan akun berhasil disimpan!', 'success');
    this.render();
  },

  saveNewPassword(event) {
    event.preventDefault();
    const p1 = document.getElementById('newPassInput').value;
    const p2 = document.getElementById('newPassConfirmInput').value;
    if (p1 !== p2) {
      this.showToast('Konfirmasi password tidak cocok!', 'danger');
      return;
    }
    this.showToast('Password Anda berhasil diperbarui!', 'success');
    event.target.reset();
  },

  handleResetDemoData() {
    if (confirm('Apakah Anda yakin ingin mengembalikan semua data ke pengaturan awal demo?')) {
      StorageService.resetAllData();
      this.showToast('Data prototype telah di-reset ke kondisi awal.', 'info');
      this.render();
    }
  },

  // ==========================================
  // AUTHENTICATION (LOGIN & REGISTER)
  // ==========================================

  openAuthModal(type, pendingApplyJobId = null) {
    this.closeAllModals();
    this.pendingApplyJobId = pendingApplyJobId;
    const modal = document.getElementById('authModal');
    const loginView = document.getElementById('authLoginView');
    const registerView = document.getElementById('authRegisterView');

    if (type === 'register') {
      loginView.style.display = 'none';
      registerView.style.display = 'block';
    } else {
      loginView.style.display = 'block';
      registerView.style.display = 'none';
    }

    modal.classList.add('active');
  },

  switchAuthMode(type) {
    const loginView = document.getElementById('authLoginView');
    const registerView = document.getElementById('authRegisterView');
    if (type === 'register') {
      loginView.style.display = 'none';
      registerView.style.display = 'block';
    } else {
      loginView.style.display = 'block';
      registerView.style.display = 'none';
    }
  },

  handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPassword').value;

    StorageService.login(email, pass);
    const pendingApplyJobId = this.pendingApplyJobId;
    this.pendingApplyJobId = null;
    this.closeAllModals();
    this.showToast('Berhasil masuk ke JOBREADY! Selamat datang.', 'success');
    if (pendingApplyJobId) {
      this.render();
      this.openApplyModal(pendingApplyJobId);
    } else {
      this.navigate('dashboard');
    }
  },

  handleQuickDemoLogin() {
    StorageService.login(INITIAL_USER.email, 'password123');
    const pendingApplyJobId = this.pendingApplyJobId;
    this.pendingApplyJobId = null;
    this.closeAllModals();
    this.showToast(`Berhasil masuk sebagai ${StorageService.getUser().name} (Demo Akun)!`, 'success');
    if (pendingApplyJobId) {
      this.render();
      this.openApplyModal(pendingApplyJobId);
    } else {
      this.navigate('dashboard');
    }
  },

  handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const pass = document.getElementById('regPassword').value;
    const passConf = document.getElementById('regPasswordConfirm').value;

    if (pass !== passConf) {
      this.showToast('Konfirmasi password tidak cocok!', 'danger');
      return;
    }

    StorageService.register({ name, email });
    const pendingApplyJobId = this.pendingApplyJobId;
    this.pendingApplyJobId = null;
    this.closeAllModals();
    this.showToast(`Selamat datang di JOBREADY, ${name}! Akun Anda telah aktif.`, 'success');
    if (pendingApplyJobId) {
      this.render();
      this.openApplyModal(pendingApplyJobId);
    } else {
      this.navigate('dashboard');
    }
  },

  handleLogout() {
    if (confirm('Apakah Anda yakin ingin keluar dari akun?')) {
      StorageService.logout();
      this.showToast('Anda telah berhasil keluar.', 'info');
      this.navigate('landing');
    }
  },

  togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === 'password') {
      input.type = 'text';
      btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
    } else {
      input.type = 'password';
      btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`;
    }
  },

  // ==========================================
  // NOTIFICATIONS
  // ==========================================

  toggleNotificationsDropdown() {
    const dropdown = document.getElementById('notifDropdown');
    if (!dropdown) return;
    dropdown.classList.toggle('show');
  },

  updateNotificationsUI() {
    const notifs = StorageService.getNotifications();
    const unreadCount = notifs.filter(n => !n.read).length;

    const badge = document.getElementById('notifBadge');
    if (badge) {
      if (unreadCount > 0) {
        badge.style.display = 'flex';
        badge.textContent = unreadCount;
      } else {
        badge.style.display = 'none';
      }
    }

    const listWrap = document.getElementById('notifListContainer');
    if (listWrap) {
      if (notifs.length === 0) {
        listWrap.innerHTML = '<div style="padding: 24px; text-align: center; color: #94A3B8; font-size: 0.85rem;">Tidak ada notifikasi</div>';
      } else {
        listWrap.innerHTML = notifs.map(n => `
          <div class="notif-list-item ${n.read ? '' : 'unread'}" onclick="App.navigate('tracking'); StorageService.markAllNotificationsRead(); App.updateNotificationsUI();">
            <div style="font-size: 1.2rem;">${n.type === 'success' ? '🎉' : n.type === 'danger' ? '⚠️' : '💼'}</div>
            <div style="flex: 1;">
              <div class="notif-item-title">${n.title}</div>
              <div class="notif-item-desc">${n.message}</div>
              <div class="notif-item-time">${n.time}</div>
            </div>
          </div>
        `).join('');
      }
    }
  },

  markAllNotifsRead() {
    StorageService.markAllNotificationsRead();
    this.updateNotificationsUI();
    this.showToast('Semua notifikasi telah ditandai dibaca.', 'info');
  },

  // ==========================================
  // FAVORITES / SAVED JOBS
  // ==========================================

  toggleSaveJob(jobId, event) {
    if (event) event.stopPropagation();
    const saved = StorageService.toggleSaveJob(jobId);
    this.showToast(saved ? 'Lowongan berhasil disimpan ke favorit!' : 'Lowongan dihapus dari favorit.', 'info');
    if (this.selectedJobForDetail && this.selectedJobForDetail.id === jobId) {
      this.openJobDetail(jobId);
    }
    if (this.currentView === 'jobs') {
      this.renderJobsList();
    } else if (this.currentView === 'landing') {
      this.renderLandingJobs();
    }
  },

  shareJob(title, company) {
    if (navigator.share) {
      navigator.share({
        title: `Lowongan ${title} di ${company}`,
        text: `Lihat peluang karier ${title} di ${company} melalui JOBREADY!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      this.showToast('Tautan lowongan telah disalin ke clipboard!', 'info');
    }
  },

  // ==========================================
  // HELPERS & TOASTS
  // ==========================================

  handleLandingSearch() {
    const input = document.getElementById('landingHeroSearchInput');
    if (!input) return;
    this.searchQuery = input.value;
    this.renderLandingJobs();
    this.scrollToLandingSection('landingJobsSection');
  },

  handleLandingJobSearch(value) {
    this.searchQuery = value;
    const heroInput = document.getElementById('landingHeroSearchInput');
    const jobsInput = document.getElementById('landingJobsSearchInput');
    if (heroInput && heroInput.value !== value) heroInput.value = value;
    if (jobsInput && jobsInput.value !== value) jobsInput.value = value;
    this.renderLandingJobs();
  },

  scrollToLandingSection(sectionId) {
    let section = document.getElementById(sectionId);
    if (!section) {
      this.currentView = 'landing';
      window.location.hash = 'landing';
      this.render();
      section = document.getElementById(sectionId);
    }
    if (section) section.scrollIntoView({ behavior: 'auto', block: 'start' });
    document.querySelectorAll('.landing-nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.nav === (sectionId === 'landingJobsSection' ? 'jobs' : 'landing'));
    });
  },

  quickSearch(keyword) {
    this.searchQuery = keyword;
    if (this.currentView === 'landing') {
      this.handleLandingJobSearch(keyword);
      this.scrollToLandingSection('landingJobsSection');
    } else {
      this.navigate('jobs');
    }
  },

  toggleMobileSidebar() {
    const sidebar = document.getElementById('appSidebar');
    if (sidebar) sidebar.classList.toggle('mobile-open');
  },

  updateUserProfileHeader() {
    const user = StorageService.getUser();
    const nameEl = document.getElementById('headerGreetingName');
    const avatarImg = document.getElementById('headerUserAvatar');
    const userChipName = document.getElementById('headerUserChipName');

    if (nameEl) nameEl.textContent = user.name.split(' ')[0];
    if (avatarImg) avatarImg.src = user.avatar || 'assets/images/avatar_alvin.svg';
    if (userChipName) userChipName.textContent = user.name;
  },

  closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
  },

  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-item ${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
    } else if (type === 'warning') {
      iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
    } else if (type === 'danger') {
      iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
    } else {
      iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
    }

    toast.innerHTML = `
      <div style="flex-shrink: 0; margin-top: 2px;">${iconSvg}</div>
      <div style="flex: 1;">
        <div class="toast-title">${type === 'success' ? 'Sukses' : type === 'danger' ? 'Pemberitahuan' : 'JOBREADY'}</div>
        <div class="toast-msg">${message}</div>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

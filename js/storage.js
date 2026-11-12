// ==========================================
// JOBREADY - LocalStorage Controller & Service
// ==========================================

const STORAGE_KEYS = {
  USER: 'jobready_user',
  AUTH: 'jobready_auth',
  JOBS: 'jobready_jobs',
  APPLICATIONS: 'jobready_applications',
  SAVED_JOBS: 'jobready_saved_jobs',
  NOTIFICATIONS: 'jobready_notifications'
};

const StorageService = {
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.USER)) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(INITIAL_USER));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUTH)) {
      // Default to the demo user so the dashboard is immediately accessible, but user can logout/login anytime
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify({ isLoggedIn: true, email: INITIAL_USER.email }));
    }
    if (!localStorage.getItem(STORAGE_KEYS.JOBS)) {
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(INITIAL_JOBS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(INITIAL_APPLICATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SAVED_JOBS)) {
      localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(['job_001', 'job_002']));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    }

    const user = this.getUser();
    let userUpdated = false;
    if (user.name === 'Ziila Putri') {
      user.name = INITIAL_USER.name;
      userUpdated = true;
    }
    if (user.email === 'ziila.putri@email.com') {
      user.email = INITIAL_USER.email;
      userUpdated = true;
    }
    if (user.avatar === 'assets/images/avatar_ziila.png' || user.avatar === 'assets/images/avatar_ziila.svg') {
      user.avatar = INITIAL_USER.avatar;
      userUpdated = true;
    }
    if (user.cv && user.cv.fileName === 'CV_ZiilaPutri.pdf') {
      user.cv.fileName = INITIAL_USER.cv.fileName;
      userUpdated = true;
    }
    if (userUpdated) this.saveUser(user);

    const auth = this.getAuth();
    if (auth.email === 'ziila.putri@email.com') {
      this.setAuth(auth.isLoggedIn, INITIAL_USER.email);
    }

    const applications = this.getApplications();
    let applicationsUpdated = false;
    applications.forEach(application => {
      if (application.applicantEmail === 'ziila.putri@email.com') {
        application.applicantEmail = INITIAL_USER.email;
        applicationsUpdated = true;
      }
      if (application.cvName === 'CV_ZiilaPutri.pdf') {
        application.cvName = INITIAL_USER.cv.fileName;
        applicationsUpdated = true;
      }
    });
    if (applicationsUpdated) {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
    }

    const jobs = this.getJobs();
    let jobsUpdated = false;
    jobs.forEach(job => {
      if (job.type === 'Full-Time' && job.workplace === 'Full-Time') {
        job.workplace = 'On-site';
        jobsUpdated = true;
      }
    });
    if (jobsUpdated) localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
  },

  // Auth
  getAuth() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.AUTH)) || { isLoggedIn: false };
    } catch (e) {
      return { isLoggedIn: false };
    }
  },

  setAuth(isLoggedIn, email) {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify({ isLoggedIn, email }));
  },

  login(email, password) {
    const user = this.getUser();
    // Allow demo login or any registered credentials
    this.setAuth(true, email);
    return { success: true, user };
  },

  register(userData) {
    const user = {
      ...this.getUser(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '0812 3456 7890'
    };
    this.saveUser(user);
    this.setAuth(true, user.email);
    this.addNotification({
      title: 'Selamat Datang di JOBREADY! 🎉',
      message: `Akun atas nama ${user.name} berhasil dibuat. Temukan lowongan impianmu sekarang!`,
      type: 'success'
    });
    return { success: true, user };
  },

  logout() {
    this.setAuth(false, null);
  },

  // User Profile
  getUser() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)) || INITIAL_USER;
    } catch (e) {
      return INITIAL_USER;
    }
  },

  saveUser(updatedUser) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
  },

  // Jobs
  getJobs() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.JOBS)) || INITIAL_JOBS;
    } catch (e) {
      return INITIAL_JOBS;
    }
  },

  getJobById(id) {
    const jobs = this.getJobs();
    return jobs.find(j => j.id === id) || null;
  },

  // Saved / Favorite Jobs
  getSavedJobIds() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_JOBS)) || [];
    } catch (e) {
      return [];
    }
  },

  toggleSaveJob(jobId) {
    let saved = this.getSavedJobIds();
    const isSaved = saved.includes(jobId);
    if (isSaved) {
      saved = saved.filter(id => id !== jobId);
    } else {
      saved.push(jobId);
    }
    localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(saved));
    return !isSaved;
  },

  isJobSaved(jobId) {
    return this.getSavedJobIds().includes(jobId);
  },

  // Applications
  getApplications() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) || INITIAL_APPLICATIONS;
    } catch (e) {
      return INITIAL_APPLICATIONS;
    }
  },

  submitApplication(jobId, applicationDetails) {
    const job = this.getJobById(jobId);
    if (!job) return { success: false, message: 'Lowongan tidak ditemukan' };

    const apps = this.getApplications();
    const existing = apps.find(a => a.jobId === jobId);
    if (existing) {
      return { success: false, message: 'Anda sudah pernah melamar lowongan ini!' };
    }

    const todayStr = new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date());

    const newApp = {
      id: 'app_' + Date.now(),
      jobId: job.id,
      title: job.title,
      company: job.company,
      companyLogoBg: job.companyLogoBg,
      companyLogoText: job.companyLogoText,
      location: job.location,
      salary: job.salary,
      appliedDate: todayStr,
      status: 'Terkirim',
      coverLetter: applicationDetails.coverLetter || 'Lamaran resmi melalui platform JOBREADY.',
      applicantName: applicationDetails.name,
      applicantEmail: applicationDetails.email,
      applicantPhone: applicationDetails.phone,
      cvName: applicationDetails.cvName || INITIAL_USER.cv.fileName,
      timeline: [
        { step: 'Lamaran Dikirim', date: todayStr, status: 'current', note: 'Lamaran berkas Anda telah berhasil dikirim ke HR ' + job.company + '.' },
        { step: 'Seleksi Berkas', date: 'Menunggu', status: 'pending', note: 'Tim rekrutmen akan meninjau kualifikasi dan pengalaman Anda.' },
        { step: 'Wawancara', date: 'Menunggu', status: 'pending', note: 'Jadwal wawancara akan ditentukan kemudian.' },
        { step: 'Keputusan Akhir', date: 'Menunggu', status: 'pending', note: 'Pengumuman hasil akhir penerimaan kerja.' }
      ]
    };

    apps.unshift(newApp);
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));

    // Also trigger notification
    this.addNotification({
      title: 'Lamaran Berhasil Terkirim! 🚀',
      message: `Lamaran untuk posisi ${job.title} di ${job.company} telah berhasil dikirimkan.`,
      type: 'info'
    });

    return { success: true, application: newApp };
  },

  // Notifications
  getNotifications() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) || INITIAL_NOTIFICATIONS;
    } catch (e) {
      return INITIAL_NOTIFICATIONS;
    }
  },

  addNotification(notif) {
    const list = this.getNotifications();
    const todayStr = new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date());
    const item = {
      id: 'notif_' + Date.now(),
      title: notif.title,
      message: notif.message,
      time: todayStr,
      read: false,
      type: notif.type || 'info'
    };
    list.unshift(item);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
    return item;
  },

  markAllNotificationsRead() {
    const list = this.getNotifications().map(n => ({ ...n, read: true }));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
    return list;
  },

  clearNotifications() {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
  },

  // Reset to default
  resetAllData() {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(INITIAL_USER));
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify({ isLoggedIn: true, email: INITIAL_USER.email }));
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(INITIAL_JOBS));
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(INITIAL_APPLICATIONS));
    localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(['job_001', 'job_002']));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  }
};

// Initialize immediately
StorageService.init();

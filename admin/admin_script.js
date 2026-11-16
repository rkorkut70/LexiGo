
    // Firebase Yapılandırması (LexiGo Canlı Proje)
    const firebaseConfig = {
      apiKey: "AIzaSyB_bpBj_cs-EVR3H97bSj92OYUUKjQraCU",
      authDomain: "lexiq-6d699.firebaseapp.com",
      projectId: "lexiq-6d699",
      storageBucket: "lexiq-6d699.firebasestorage.app",
      messagingSenderId: "452877974071",
      appId: "1:452877974071:web:ef6c8cfd5984b8b5a91db2",
      measurementId: "G-L0WX1FBXL8"
    };

    // Firebase Başlat
    let db;
    try {
      firebase.initializeApp(firebaseConfig);
      db = firebase.firestore();
      document.getElementById('connectionStatus').textContent = "Bağlandı (Canlı)";
    } catch (e) {
      console.error("Firebase başlatma hatası:", e);
      document.getElementById('connectionStatus').textContent = "Bağlantı Hatası";
    }

    // Kelime Sözlüğü Hızlı Erişim Haritası (WORDS_DATA)
    const wordsById = new Map();
    if (typeof WORDS_DATA !== 'undefined' && Array.isArray(WORDS_DATA)) {
      WORDS_DATA.forEach(w => {
        if (w && w.id !== undefined) {
          wordsById.set(String(w.id), w);
        }
      });
    }

    // SVG Simgeler
    const SVG = {
      apple: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.93.04-2.02.63-2.67 1.39-.58.67-.99 1.74-.86 2.78 1.04.08 2.06-.54 2.61-1.3z"/></svg>',
      android: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-4.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 2.23 12.95 2 12 2c-.96 0-1.86.23-2.66.63L7.85 1.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.73 4.19 5.5 6.01 5.5 8h13c0-1.99-1.23-3.81-2.97-4.84zM9 6c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>',
      globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>',
      trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>'
    };

    // Platform Çözümleyici (iOS, Android, Web)
    function resolveUserPlatform(d) {
      if (!d) return 'web';
      let plat = (d.platform || d.lastPlatform || '').toLowerCase().trim();
      if (plat === 'android' || plat === 'android_web') return 'android';
      if (plat === 'ios') return 'ios';
      if (plat === 'web') return 'web';

      // Fallback: User-Agent veya timeTracking
      const ua = ((d.userAgent || d.lastUserAgent || '') + ' ' + (d.timeTracking && d.timeTracking.userAgent ? d.timeTracking.userAgent : '')).toLowerCase();
      if (/iphone|ipad|ipod/i.test(ua)) return 'ios';
      if (/android/i.test(ua)) return 'android';
      return 'web';
    }

    function getPlatformBadgeHtml(platform) {
      const p = (platform || 'web').toLowerCase();
      if (p === 'ios') {
        return '<span class="platform-badge platform-ios" title="Apple iOS Cihazı">' + SVG.apple + '<span>iOS</span></span>';
      }
      if (p === 'android') {
        return '<span class="platform-badge platform-android" title="Google Android Cihazı">' + SVG.android + '<span>Android</span></span>';
      }
      return '<span class="platform-badge platform-web" title="Web Tarayıcı">' + SVG.globe + '<span>Web</span></span>';
    }

    // Durum Değişkenleri
    let rawUsers = [];
    let rawFeedbacks = [];
    let selectedUserIds = new Set();
    let currentActiveDetailUserId = null;
    let currentReplyFeedbackId = null;

    // TABLO SÜTUN SIRALAMA DURUMLARI
    let studentSortState = { key: 'xp', dir: 'desc' };
    let timeSortState = { key: 'totalTime', dir: 'desc' };
    let leaderboardSortState = { key: 'xp', dir: 'desc' };

    function updateTableSortHeaders(tableName, currentKey, currentDir) {
      const table = document.querySelector(`table[data-sort-table="${tableName}"]`);
      if (!table) return;
      const ths = table.querySelectorAll('th.sortable-th');
      ths.forEach(th => {
        const key = th.getAttribute('data-key');
        const icon = th.querySelector('.sort-icon');
        if (key === currentKey) {
          th.classList.add('active-sort');
          if (icon) icon.textContent = currentDir === 'asc' ? '▲' : '▼';
        } else {
          th.classList.remove('active-sort');
          if (icon) icon.textContent = '⇅';
        }
      });
    }

    function handleTableSortClick(tableName, key) {
      if (tableName === 'students') {
        if (studentSortState.key === key) {
          studentSortState.dir = studentSortState.dir === 'asc' ? 'desc' : 'asc';
        } else {
          studentSortState.key = key;
          studentSortState.dir = (key === 'name' || key === 'branch' || key === 'level' || key === 'platform') ? 'asc' : 'desc';
        }
        updateTableSortHeaders('students', studentSortState.key, studentSortState.dir);
        renderUsers();
      } else if (tableName === 'time') {
        if (timeSortState.key === key) {
          timeSortState.dir = timeSortState.dir === 'asc' ? 'desc' : 'asc';
        } else {
          timeSortState.key = key;
          timeSortState.dir = (key === 'name' || key === 'branch' || key === 'platform') ? 'asc' : 'desc';
        }
        updateTableSortHeaders('time', timeSortState.key, timeSortState.dir);
        renderTimeTracking();
      } else if (tableName === 'leaderboard') {
        if (leaderboardSortState.key === key) {
          leaderboardSortState.dir = leaderboardSortState.dir === 'asc' ? 'desc' : 'asc';
        } else {
          leaderboardSortState.key = key;
          leaderboardSortState.dir = (key === 'rank' || key === 'name' || key === 'lang' || key === 'platform') ? 'asc' : 'desc';
        }
        updateTableSortHeaders('leaderboard', leaderboardSortState.key, leaderboardSortState.dir);
        renderLeaderboard();
      }
    }

    function initSortableHeaders() {
      document.querySelectorAll('th.sortable-th').forEach(th => {
        th.addEventListener('click', () => {
          const table = th.getAttribute('data-table');
          const key = th.getAttribute('data-key');
          if (!table || !key) return;
          handleTableSortClick(table, key);
        });
      });
    }

    // AVATAR HTML ÜRETİCİ
    function getAvatarHtml(avatar) {
      if (!avatar) return '🦊';
      if (typeof avatar === 'string' && avatar.startsWith('avatar_')) {
        return '<img src="assets/avatars/' + avatar + '.jpg" alt="Avatar" style="width:100%; height:100%; object-fit:cover; border-radius:50%;" onerror="this.outerHTML=\'🦊\'">';
      }
      return '<span style="font-size:1.2rem; line-height:1;">' + avatar + '</span>';
    }

    // SEÇİM YÖNETİMİ
    window.toggleUserSelection = function(userId, isChecked) {
      if (isChecked) {
        selectedUserIds.add(userId);
      } else {
        selectedUserIds.delete(userId);
      }
      updateSelectionUI();
    };

    function updateSelectionUI() {
      const countEl = document.getElementById('selectedUsersCount');
      const barEl = document.getElementById('bulkActionBar');
      const selectAllEl = document.getElementById('selectAllCheckbox');

      if (countEl) countEl.textContent = selectedUserIds.size;
      if (barEl) barEl.style.display = selectedUserIds.size > 0 ? 'flex' : 'none';

      if (selectAllEl) {
        const visibleCbs = document.querySelectorAll('.user-select-cb');
        if (visibleCbs.length > 0) {
          const allChecked = Array.from(visibleCbs).every(cb => cb.checked);
          selectAllEl.checked = allChecked;
        } else {
          selectAllEl.checked = false;
        }
      }
    }

    // TEKİL KULLANICI SİLME
    window.deleteSingleUser = async function(userId, userName) {
      if (!db) {
        alert("Firebase bağlantısı mevcut değil.");
        return;
      }
      const displayName = userName || "Öğrenci";
      const confirmed = confirm("DİKKAT: '" + displayName + "' adlı öğrenciyi silmek istediğinize emin misiniz?\n\nBu işlem öğrencinin tüm puanlarını ve kelime verilerini kalıcı olarak silecektir!");
      if (!confirmed) return;

      try {
        await db.collection('users').doc(userId).delete();
        try {
          await db.collection('leaderboard').doc(userId).delete();
        } catch(e) {}

        rawUsers = rawUsers.filter(u => u.id !== userId);
        selectedUserIds.delete(userId);

        renderUsers();
        renderTimeTracking();
        renderLeaderboard();
        updateStats();

        const modal = document.getElementById('studentDetailModal');
        if (modal && modal.classList.contains('active')) {
          modal.classList.remove('active');
        }

        showAdminToast("'" + displayName + "' başarıyla silindi.", "trash");
      } catch (err) {
        console.error("Kullanıcı silme hatası:", err);
        alert("Kullanıcı silinirken hata oluştu: " + err.message);
      }
    };

    // ÇOKLU KULLANICI SİLME
    window.deleteSelectedUsers = async function() {
      if (!db) return;
      if (selectedUserIds.size === 0) {
        alert("Lütfen silmek istediğiniz öğrencileri seçiniz.");
        return;
      }

      const count = selectedUserIds.size;
      const confirmed = confirm("ONAY: Seçtiğiniz " + count + " adet öğrenci kalıcı olarak silinecektir!\n\nBu işlem geri alınamaz. Devam etmek istiyor musunuz?");
      if (!confirmed) return;

      const deleteBtn = document.getElementById('bulkDeleteBtn');
      if (deleteBtn) {
        deleteBtn.disabled = true;
        deleteBtn.textContent = "Siliniyor (" + count + ")...";
      }

      try {
        const idsToDelete = Array.from(selectedUserIds);
        const batch = db.batch();

        idsToDelete.forEach(id => {
          const userRef = db.collection('users').doc(id);
          batch.delete(userRef);
          try {
            const lbRef = db.collection('leaderboard').doc(id);
            batch.delete(lbRef);
          } catch(e) {}
        });

        await batch.commit();

        rawUsers = rawUsers.filter(u => !selectedUserIds.has(u.id));
        selectedUserIds.clear();

        renderUsers();
        renderTimeTracking();
        renderLeaderboard();
        updateStats();

        showAdminToast(count + " öğrenci başarıyla silindi.", "trash");
      } catch (err) {
        console.error("Toplu silme hatası:", err);
        alert("Toplu silme sırasında hata: " + err.message);
      } finally {
        if (deleteBtn) {
          deleteBtn.disabled = false;
          deleteBtn.textContent = "Seçilenleri Sil";
        }
      }
    };

    // TEMA YÖNETİMİ
    const savedTheme = localStorage.getItem('lexiq_admin_theme') || 'dark';
    setAdminTheme(savedTheme);

    function setAdminTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('lexiq_admin_theme', theme);
      const iconWrap = document.getElementById('themeToggleIcon');
      if (iconWrap) {
        if (theme === 'dark') {
          iconWrap.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
        } else {
          iconWrap.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
        }
      }
    }

    document.getElementById('themeToggleBtn').addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      setAdminTheme(current === 'dark' ? 'light' : 'dark');
    });

    // ZAMAN & SÜRE YARDIMCILARI
    function parseDate(rawVal) {
      if (!rawVal) return null;
      if (rawVal.toDate && typeof rawVal.toDate === 'function') return rawVal.toDate();
      if (typeof rawVal === 'number') {
        const d = new Date(rawVal);
        return isNaN(d.getTime()) ? null : d;
      }
      if (typeof rawVal === 'string') {
        const d = new Date(rawVal);
        return isNaN(d.getTime()) ? null : d;
      }
      if (typeof rawVal === 'object' && rawVal.seconds) return new Date(rawVal.seconds * 1000);
      return null;
    }

    function formatDateTime(dateObj) {
      if (!dateObj || !(dateObj instanceof Date) || isNaN(dateObj.getTime())) return '—';
      return dateObj.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    function formatDateOnly(dateObj) {
      if (!dateObj || !(dateObj instanceof Date) || isNaN(dateObj.getTime())) return '—';
      return dateObj.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    }

    function formatDuration(seconds) {
      const sec = Math.max(0, parseInt(seconds) || 0);
      if (sec === 0) return '0 dk';
      if (sec < 60) return sec + ' sn';
      const totalMins = Math.floor(sec / 60);
      if (totalMins < 60) return totalMins + ' dk';
      const hours = Math.floor(totalMins / 60);
      const remMins = totalMins % 60;
      return remMins > 0 ? (hours + ' sa ' + remMins + ' dk') : (hours + ' sa');
    }

    function getRecencyInfo(dateObj) {
      if (!dateObj || !(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
        return { label: 'Hareketsiz', sub: 'Giriş yok', cls: 'recency-idle', diffDays: 9999, diffHours: 9999, isOnline: false };
      }
      const now = new Date();
      const diffMs = now.getTime() - dateObj.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSec / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffSec <= 180) {
        return { label: 'Çevrimiçi', sub: 'Şu an aktif', cls: 'recency-active', diffDays: 0, diffHours: 0, isOnline: true };
      }
      if (diffMins <= 15) {
        return { label: diffMins + ' dk önce', sub: 'Az önce', cls: 'recency-recent', diffDays: 0, diffHours: 0, isOnline: false };
      }
      if (diffHours < 24) {
        return { label: (diffMins < 60 ? diffMins + ' dk önce' : diffHours + ' sa önce'), sub: 'Bugün', cls: 'recency-idle', diffDays: 0, diffHours: diffHours, isOnline: false };
      }
      if (diffDays === 1) {
        return { label: 'Dün', sub: '1 gün önce', cls: 'recency-idle', diffDays: 1, diffHours: diffHours, isOnline: false };
      }
      if (diffDays <= 30) {
        return { label: diffDays + ' gün önce', sub: 'Bu ay', cls: 'recency-idle', diffDays: diffDays, diffHours: diffHours, isOnline: false };
      }
      const months = Math.floor(diffDays / 30);
      return { label: months + ' ay önce', sub: 'Hareketsiz', cls: 'recency-idle', diffDays: diffDays, diffHours: diffHours, isOnline: false };
    }

    function getRegistrationAgo(dateObj) {
      if (!dateObj || !(dateObj instanceof Date) || isNaN(dateObj.getTime())) return '—';
      const now = new Date();
      const diffMs = now.getTime() - dateObj.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 0) return 'Bugün katıldı';
      if (diffDays === 1) return 'Dün katıldı';
      if (diffDays < 30) return diffDays + ' gün önce';
      if (diffDays < 365) return Math.floor(diffDays / 30) + ' ay önce';
      return Math.floor(diffDays / 365) + ' yıl önce';
    }

    // SEKME DEĞİŞİMİ
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.tagName.toLowerCase() === 'a') return;
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
        btn.classList.add('active');
        const targetId = btn.getAttribute('data-tab');
        const target = document.getElementById(targetId);
        if (target) target.style.display = 'block';
        if (targetId === 'timeTrackingTab') renderTimeTracking();
      });
    });

    // 1. KULLANICILARI ÇEK
    async function fetchUsers() {
      if (!db) return;
      try {
        const snap = await db.collection('users').get();
        rawUsers = [];
        snap.forEach(doc => {
          const d = doc.data();

          // Öğrenilen kelimeler
          let learnedIds = [];
          if (d.learnedMap && typeof d.learnedMap === 'object') {
            learnedIds = Object.keys(d.learnedMap).filter(k => {
              const val = d.learnedMap[k];
              return val === true || (val && val.learned === true) || typeof val === 'number';
            });
          }
          if (learnedIds.length === 0 && Array.isArray(d.learnedWords)) {
            learnedIds = d.learnedWords.map(String);
          }
          const learnedCount = learnedIds.length;

          // Kayıt Tarihi
          let regDate = parseDate(d.createdAt);
          if (!regDate && d.timeTracking && d.timeTracking.registeredAt) regDate = parseDate(d.timeTracking.registeredAt);
          if (!regDate && d.timeTracking && d.timeTracking.firstStartedAt) regDate = parseDate(d.timeTracking.firstStartedAt);
          if (!regDate && d.firstStartedAt) regDate = parseDate(d.firstStartedAt);

          const createdAtFormatted = formatDateTime(regDate);
          const createdAtOnly = formatDateOnly(regDate);
          const createdAgo = getRegistrationAgo(regDate);

          // Son Aktiflik
          const lastLoginDate = parseDate(d.lastLoginAt);
          const lastActiveDate = parseDate(d.lastActive);
          let effectiveActivityDate = (lastLoginDate && lastActiveDate) 
            ? (lastLoginDate > lastActiveDate ? lastLoginDate : lastActiveDate) 
            : (lastLoginDate || lastActiveDate);

          if (!effectiveActivityDate && d.lastStudyDate) {
            effectiveActivityDate = parseDate(d.lastStudyDate);
          }
          const lastActiveFormatted = formatDateTime(effectiveActivityDate);
          const activityRecency = getRecencyInfo(effectiveActivityDate);

          // Süreler
          const cardSeconds = (d.timeTracking && typeof d.timeTracking.cardSeconds === 'number') ? d.timeTracking.cardSeconds : 0;
          const gameSeconds = (d.timeTracking && typeof d.timeTracking.gameSeconds === 'number') ? d.timeTracking.gameSeconds : 0;
          const totalSeconds = cardSeconds + gameSeconds;
          const unitDurations = (d.timeTracking && typeof d.timeTracking.unitDurations === 'object') ? d.timeTracking.unitDurations : {};

          // Platform / Kanal
          const platform = resolveUserPlatform(d);

          rawUsers.push({
            id: doc.id,
            displayName: d.displayName || 'İsimsiz Öğrenci',
            email: d.email || '—',
            avatar: d.avatar || '🦊',
            branch: d.branch || d.userBranch || '',
            xp: typeof d.xp === 'number' ? d.xp : 0,
            track: d.track || d.userTrack || '4A',
            level: d.level || d.userLevel || 'A2',
            unitNo: d.unitNo || d.activeUnitNo || 1,
            dailyGoal: d.dailyGoal || d.targetWordCount || 15,
            streakPledgeDays: d.streakPledgeDays || d.streakPledge || 0,
            lang: d.lang || d.language || d.activeLanguage || 'EN-TR',
            platform: platform,
            userAgent: d.userAgent || (d.timeTracking && d.timeTracking.userAgent ? d.timeTracking.userAgent : '') || '',
            learnedIds: learnedIds,
            learnedMap: d.learnedMap || {},
            learnedCount: learnedCount,
            maxStreak: d.maxStreak || d.maxDayStreak || 0,
            dayStreak: d.dayStreak || 1,
            maxDayStreak: d.maxDayStreak || d.maxStreak || 1,
            arenaWordsSolved: d.arenaWordsSolved || 0,
            cleanWins: d.cleanWins || 0,
            badges: Array.isArray(d.unlockedBadges) ? d.unlockedBadges : [],
            timeTracking: d.timeTracking || {},
            gameStats: d.gameStats || {},
            regDate: regDate,
            createdAtFormatted: createdAtFormatted,
            createdAtOnly: createdAtOnly,
            createdAgo: createdAgo,
            lastLoginDate: lastLoginDate,
            lastActiveDate: lastActiveDate,
            effectiveActivityDate: effectiveActivityDate,
            lastActiveFormatted: lastActiveFormatted,
            activityRecency: activityRecency,
            cardSeconds: cardSeconds,
            gameSeconds: gameSeconds,
            totalSeconds: totalSeconds,
            unitDurations: unitDurations,
            totalTimeFormatted: formatDuration(totalSeconds),
            cardTimeFormatted: formatDuration(cardSeconds),
            gameTimeFormatted: formatDuration(gameSeconds)
          });
        });

        renderUsers();
        renderTimeTracking();
        renderLeaderboard();
        updateStats();
      } catch (err) {
        console.error("Kullanıcı çekme hatası:", err);
        document.getElementById('studentsTableBody').innerHTML = 
          '<tr><td colspan="10" class="empty-state" style="color:var(--danger)">Veriler yüklenirken hata oluştu: ' + err.message + '</td></tr>';
      }
    }

    // 2. GERİ BİLDİRİMLERİ ÇEK
    async function fetchFeedbacks() {
      if (!db) return;
      try {
        let snap;
        try {
          snap = await db.collection('feedbacks').orderBy('createdAt', 'desc').get();
        } catch (orderErr) {
          snap = await db.collection('feedbacks').get();
        }

        rawFeedbacks = [];
        snap.forEach(doc => {
          const d = doc.data();
          let dateStr = d.date || '—';
          let ts = 0;
          if (d.createdAt && d.createdAt.toDate) {
            dateStr = d.createdAt.toDate().toLocaleString('tr-TR');
            ts = d.createdAt.toDate().getTime();
          } else if (d.date) {
            try { 
              const parsed = new Date(d.date);
              dateStr = parsed.toLocaleString('tr-TR');
              ts = parsed.getTime();
            } catch(e){}
          }

          const localReplies = getFeedbackReplies();
          const savedReply = localReplies[doc.id] || null;
          const isReplied = Boolean(d.replied || (savedReply && savedReply.replied));
          const replyText = (savedReply && savedReply.replyText) || d.replyText || '';
          const replyDate = (savedReply && savedReply.date) || d.replyDate || '';
          const replyTo = (savedReply && savedReply.toEmail) || d.replyTo || d.email || '';

          rawFeedbacks.push({
            id: doc.id,
            type: d.type || 'general',
            name: d.name || 'Öğrenci',
            email: d.email || '',
            message: d.message || '',
            language: d.language || 'EN-TR',
            track: d.track || '',
            level: d.level || '',
            appVersion: d.appVersion || 'v1.9.29',
            date: dateStr,
            timestamp: ts,
            replied: isReplied,
            replyText: replyText,
            replyDate: replyDate,
            replyTo: replyTo
          });
        });

        rawFeedbacks.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        renderFeedbacks();
        updateStats();
      } catch (err) {
        console.warn("Geri bildirim çekme hatası:", err);
      }
    }

    // 3. STATS GÜNCELLE
    function updateStats() {
      const totalUsers = rawUsers.length;
      document.getElementById('statTotalUsers').textContent = totalUsers;
      document.getElementById('tabCountStudents').textContent = totalUsers;
      document.getElementById('tabCountTimeTracking').textContent = totalUsers;

      const totalXp = rawUsers.reduce((sum, u) => sum + (u.xp || 0), 0);
      document.getElementById('statTotalXp').textContent = totalXp.toLocaleString('tr-TR');

      const totalLearned = rawUsers.reduce((sum, u) => sum + (u.learnedCount || 0), 0);
      document.getElementById('statTotalLearned').textContent = totalLearned.toLocaleString('tr-TR');

      document.getElementById('statTotalFeedbacks').textContent = rawFeedbacks.length;
      document.getElementById('tabCountFeedbacks').textContent = rawFeedbacks.length;

      const bugCount = rawFeedbacks.filter(f => f.type === 'bug').length;
      document.getElementById('statBugCount').textContent = bugCount + " hata bildirimi";

      // Platform / Kanal Dağılımı Hesaplama
      let countWeb = 0;
      let countAndroid = 0;
      let countIos = 0;

      rawUsers.forEach(u => {
        if (u.platform === 'ios') countIos++;
        else if (u.platform === 'android') countAndroid++;
        else countWeb++;
      });

      const pctWeb = totalUsers > 0 ? Math.round((countWeb / totalUsers) * 100) : 0;
      const pctAndroid = totalUsers > 0 ? Math.round((countAndroid / totalUsers) * 100) : 0;
      const pctIos = totalUsers > 0 ? (100 - pctWeb - pctAndroid) : 0;

      const distCountWebEl = document.getElementById('distCountWeb');
      if (distCountWebEl) distCountWebEl.textContent = countWeb + " (%" + pctWeb + ")";
      const distCountAndroidEl = document.getElementById('distCountAndroid');
      if (distCountAndroidEl) distCountAndroidEl.textContent = countAndroid + " (%" + pctAndroid + ")";
      const distCountIosEl = document.getElementById('distCountIos');
      if (distCountIosEl) distCountIosEl.textContent = countIos + " (%" + pctIos + ")";

      const barSegWeb = document.getElementById('barSegWeb');
      if (barSegWeb) barSegWeb.style.width = pctWeb + '%';
      const barSegAndroid = document.getElementById('barSegAndroid');
      if (barSegAndroid) barSegAndroid.style.width = pctAndroid + '%';
      const barSegIos = document.getElementById('barSegIos');
      if (barSegIos) barSegIos.style.width = pctIos + '%';

      // Aktiflik
      const now = new Date();
      let active24hCount = 0;
      let onlineNowCount = 0;
      let new7dCount = 0;
      let totalSecondsSum = 0;
      let cardSecondsSum = 0;
      let gameSecondsSum = 0;

      rawUsers.forEach(u => {
        totalSecondsSum += (u.totalSeconds || 0);
        cardSecondsSum += (u.cardSeconds || 0);
        gameSecondsSum += (u.gameSeconds || 0);

        if (u.activityRecency) {
          if (u.activityRecency.isOnline) onlineNowCount++;
          if (u.activityRecency.diffHours < 24) active24hCount++;
        }
        if (u.regDate && !isNaN(u.regDate.getTime())) {
          const diffDays = Math.floor((now.getTime() - u.regDate.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays <= 7) new7dCount++;
        }
      });

      const activeRatio = totalUsers > 0 ? Math.round((active24hCount / totalUsers) * 100) : 0;
      document.getElementById('statActiveUsers').textContent = active24hCount + " aktif öğrenci (son 24s)";

      const statTotalStudyTimeEl = document.getElementById('statTotalStudyTime');
      if (statTotalStudyTimeEl) statTotalStudyTimeEl.textContent = formatDuration(totalSecondsSum);

      const statTotalTimeBreakdownEl = document.getElementById('statTotalTimeBreakdown');
      if (statTotalTimeBreakdownEl) {
        statTotalTimeBreakdownEl.textContent = "Kart: " + formatDuration(cardSecondsSum) + " • Pratik: " + formatDuration(gameSecondsSum);
      }

      const avgSeconds = totalUsers > 0 ? Math.round(totalSecondsSum / totalUsers) : 0;
      const statAvgStudyTimeEl = document.getElementById('statAvgStudyTime');
      if (statAvgStudyTimeEl) statAvgStudyTimeEl.textContent = formatDuration(avgSeconds);

      const statActiveLast24hEl = document.getElementById('statActiveLast24h');
      if (statActiveLast24hEl) statActiveLast24hEl.textContent = active24hCount;

      const statActiveRatioEl = document.getElementById('statActiveRatio');
      if (statActiveRatioEl) {
        statActiveRatioEl.innerHTML = (onlineNowCount > 0 ? '<strong style="color:var(--success);">' + onlineNowCount + ' şu an aktif</strong> • ' : '') + 'Son 24 saat: %' + activeRatio;
      }

      const statNewRegistrations7dEl = document.getElementById('statNewRegistrations7d');
      if (statNewRegistrations7dEl) statNewRegistrations7dEl.textContent = new7dCount + " yeni öğrenci";
    }

    // 4. KULLANICILARI LİSTELE
    function renderUsers() {
      const tbody = document.getElementById('studentsTableBody');
      const search = document.getElementById('searchInput').value.toLowerCase().trim();
      const platformFilter = document.getElementById('filterPlatform') ? document.getElementById('filterPlatform').value : 'all';
      const branchFilter = document.getElementById('filterBranch') ? document.getElementById('filterBranch').value : 'all';
      const trackFilter = document.getElementById('filterTrack').value;
      const langFilter = document.getElementById('filterLang').value;

      let filtered = rawUsers.filter(u => {
        const matchesSearch = u.displayName.toLowerCase().includes(search) || 
                              u.email.toLowerCase().includes(search) || 
                              (u.branch && u.branch.toLowerCase().includes(search));
        
        const matchesPlatform = platformFilter === 'all' || u.platform === platformFilter;
        const matchesLang = langFilter === 'all' || u.lang === langFilter;
        
        let matchesBranch = true;
        if (branchFilter === 'none') {
          matchesBranch = !u.branch || u.branch.trim() === '' || u.branch === 'Şubesiz';
        } else if (branchFilter !== 'all') {
          matchesBranch = u.branch === branchFilter;
        }

        let matchesTrack = true;
        if (trackFilter !== 'all') {
          matchesTrack = (u.track === trackFilter) || (u.level === trackFilter);
        }
        return matchesSearch && matchesPlatform && matchesLang && matchesBranch && matchesTrack;
      });

      function uTime(d) {
        return (d && d instanceof Date && !isNaN(d.getTime())) ? d.getTime() : 0;
      }

      const mult = studentSortState.dir === 'desc' ? -1 : 1;
      filtered.sort((a, b) => {
        switch (studentSortState.key) {
          case 'name':
            return mult * (a.displayName || '').localeCompare(b.displayName || '', 'tr', { sensitivity: 'base' });
          case 'platform':
            return mult * (a.platform || '').localeCompare(b.platform || '');
          case 'branch':
            return mult * (a.branch || 'zzz').localeCompare(b.branch || 'zzz', 'tr');
          case 'level':
            const levComp = (a.level || '').localeCompare(b.level || '', 'tr');
            if (levComp !== 0) return mult * levComp;
            return mult * ((Number(a.unitNo) || 0) - (Number(b.unitNo) || 0));
          case 'xp':
            return mult * ((a.xp || 0) - (b.xp || 0));
          case 'learned':
            return mult * ((a.learnedCount || 0) - (b.learnedCount || 0));
          case 'streak':
            return mult * ((a.dayStreak || a.maxStreak || 0) - (b.dayStreak || b.maxStreak || 0));
          case 'activity':
            return mult * (uTime(a.effectiveActivityDate) - uTime(b.effectiveActivityDate));
          case 'created':
            return mult * (uTime(a.regDate) - uTime(b.regDate));
          case 'time':
            return mult * ((a.totalSeconds || 0) - (b.totalSeconds || 0));
          default:
            return mult * ((a.xp || 0) - (b.xp || 0));
        }
      });

      updateTableSortHeaders('students', studentSortState.key, studentSortState.dir);

      if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" class="empty-state"><div class="empty-icon">🔍</div><div>Kriterlere uygun öğrenci bulunamadı.</div></td></tr>';
        updateSelectionUI();
        return;
      }

      tbody.innerHTML = filtered.map(u => {
        const isChecked = selectedUserIds.has(u.id);
        const escapedName = (u.displayName || 'Öğrenci').replace(/'/g, "\\'");
        const branchBadge = u.branch 
          ? '<span class="tag-pill tag-track">' + u.branch + '</span>'
          : '<span class="tag-pill" style="background:rgba(100,116,139,0.12); color:var(--text-dim);">Şubesiz</span>';

        const platformBadge = getPlatformBadgeHtml(u.platform);

        const total = u.totalSeconds || 0;
        const cardPct = total > 0 ? Math.round((u.cardSeconds / total) * 100) : 50;
        const gamePct = total > 0 ? (100 - cardPct) : 50;

        return '<tr id="userRow_' + u.id + '">' +
          '<td style="text-align: center;">' +
            '<input type="checkbox" class="user-cb user-select-cb" data-id="' + u.id + '" ' + (isChecked ? 'checked' : '') + ' onchange="toggleUserSelection(\'' + u.id + '\', this.checked)">' +
          '</td>' +
          '<td>' +
            '<div class="user-cell">' +
              '<div class="user-avatar-bubble">' + getAvatarHtml(u.avatar) + '</div>' +
              '<div>' +
                '<div class="user-meta-name">' + u.displayName + '</div>' +
                '<div class="user-meta-email">' + u.email + '</div>' +
              '</div>' +
            '</div>' +
          '</td>' +
          '<td>' + platformBadge + '</td>' +
          '<td>' +
            branchBadge +
            '<span class="tag-pill tag-track" style="display:inline-block; margin-top:2px;">' + u.lang + ' • ' + u.track + '</span>' +
          '</td>' +
          '<td>' +
            '<div>' +
              '<strong style="color:var(--text); font-size:0.82rem;">' + u.level + '</strong>' +
              '<span class="tag-pill tag-unit" style="display:block; width:fit-content; margin-top:2px;">Ünite ' + u.unitNo + '</span>' +
            '</div>' +
          '</td>' +
          '<td>' +
            '<span class="tag-pill tag-xp">' + (u.xp || 0).toLocaleString('tr-TR') + ' XP</span>' +
            '<span class="tag-pill tag-words" style="display:inline-block; margin-top:2px;">' + u.learnedCount + ' Kelime</span>' +
          '</td>' +
          '<td>' +
            '<div>' +
              '<span class="tag-pill tag-streak">' + (u.dayStreak || u.maxStreak) + ' Gün Seri</span>' +
              '<span style="display:block; font-size:0.7rem; color:var(--text-dim); margin-top:2px; font-weight:600;">Hedef: ' + u.dailyGoal + '/gün</span>' +
            '</div>' +
          '</td>' +
          '<td>' +
            '<div class="date-meta-cell">' +
              '<div><span class="recency-pill ' + u.activityRecency.cls + '">' + u.activityRecency.label + '</span></div>' +
              '<span class="date-meta-secondary" style="margin-top:1px;">Son: ' + u.lastActiveFormatted + '</span>' +
              '<span class="date-meta-secondary">Kayıt: ' + u.createdAtOnly + '</span>' +
            '</div>' +
          '</td>' +
          '<td>' +
            '<div>' +
              '<span class="time-badge-main">' + u.totalTimeFormatted + '</span>' +
              '<div class="time-mini-bar" title="Kart: ' + u.cardTimeFormatted + ' (%' + cardPct + ') • Pratik: ' + u.gameTimeFormatted + ' (%' + gamePct + ')">' +
                '<div class="time-bar-card" style="width:' + cardPct + '%;"></div>' +
                '<div class="time-bar-game" style="width:' + gamePct + '%;"></div>' +
              '</div>' +
            '</div>' +
          '</td>' +
          '<td style="text-align: center; white-space: nowrap;">' +
            '<div style="display: inline-flex; gap: 4px;">' +
              '<button class="btn btn-secondary" onclick="openStudentDetail(\'' + u.id + '\')" style="padding:4px 8px; font-size:0.75rem;" title="Detaylı İncele">' +
                'İncele' +
              '</button>' +
              '<button class="btn btn-danger" onclick="deleteSingleUser(\'' + u.id + '\', \'' + escapedName + '\')" style="padding:4px 7px; font-size:0.75rem;" title="Kullanıcıyı Sil">' +
                '<span class="ui-icon" style="width:13px; height:13px;">' + SVG.trash + '</span>' +
              '</button>' +
            '</div>' +
          '</td>' +
        '</tr>';
      }).join('');

      updateSelectionUI();
    }

    // 5. GİRİŞ VE SÜRE TAKİBİ
    function renderTimeTracking() {
      const tbody = document.getElementById('timeTrackingTableBody');
      if (!tbody) return;

      const searchInput = document.getElementById('timeSearchInput');
      const search = searchInput ? searchInput.value.toLowerCase().trim() : '';
      const platformFilter = document.getElementById('filterTimePlatform') ? document.getElementById('filterTimePlatform').value : 'all';
      const branchFilter = document.getElementById('filterTimeBranch') ? document.getElementById('filterTimeBranch').value : 'all';
      const recencyFilter = document.getElementById('filterTimeRecency') ? document.getElementById('filterTimeRecency').value : 'all';

      let filtered = rawUsers.filter(u => {
        const matchesSearch = u.displayName.toLowerCase().includes(search) || 
                              u.email.toLowerCase().includes(search) || 
                              (u.branch && u.branch.toLowerCase().includes(search));
        
        const matchesPlatform = platformFilter === 'all' || u.platform === platformFilter;

        let matchesBranch = true;
        if (branchFilter === 'none') {
          matchesBranch = !u.branch || u.branch.trim() === '' || u.branch === 'Şubesiz';
        } else if (branchFilter !== 'all') {
          matchesBranch = u.branch === branchFilter;
        }

        let matchesRecency = true;
        if (recencyFilter === 'active24h') {
          matchesRecency = u.activityRecency && u.activityRecency.diffHours < 24;
        } else if (recencyFilter === 'recent7d') {
          matchesRecency = u.activityRecency && u.activityRecency.diffDays <= 7;
        } else if (recencyFilter === 'month30d') {
          matchesRecency = u.activityRecency && u.activityRecency.diffDays <= 30;
        } else if (recencyFilter === 'idle30d') {
          matchesRecency = !u.activityRecency || u.activityRecency.diffDays > 30;
        }

        return matchesSearch && matchesPlatform && matchesBranch && matchesRecency;
      });

      function uTime(d) {
        return (d && d instanceof Date && !isNaN(d.getTime())) ? d.getTime() : 0;
      }

      const mult = timeSortState.dir === 'desc' ? -1 : 1;
      filtered.sort((a, b) => {
        switch (timeSortState.key) {
          case 'name':
            return mult * (a.displayName || '').localeCompare(b.displayName || '', 'tr', { sensitivity: 'base' });
          case 'platform':
            return mult * (a.platform || '').localeCompare(b.platform || '');
          case 'branch':
            return mult * (a.branch || 'zzz').localeCompare(b.branch || 'zzz', 'tr');
          case 'created':
            return mult * (uTime(a.regDate) - uTime(b.regDate));
          case 'active':
            return mult * (uTime(a.effectiveActivityDate) - uTime(b.effectiveActivityDate));
          case 'totalTime':
            return mult * ((a.totalSeconds || 0) - (b.totalSeconds || 0));
          case 'cardTime':
            return mult * ((a.cardSeconds || 0) - (b.cardSeconds || 0));
          case 'gameTime':
            return mult * ((a.gameSeconds || 0) - (b.gameSeconds || 0));
          default:
            return mult * ((a.totalSeconds || 0) - (b.totalSeconds || 0));
        }
      });

      updateTableSortHeaders('time', timeSortState.key, timeSortState.dir);

      if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="empty-state"><div class="empty-icon">🔍</div><div>Kriterlere uygun kayıt bulunamadı.</div></td></tr>';
        return;
      }

      tbody.innerHTML = filtered.map(u => {
        const branchBadge = u.branch 
          ? '<span class="tag-pill tag-track">' + u.branch + '</span>'
          : '<span class="tag-pill" style="background:rgba(100,116,139,0.12); color:var(--text-dim);">Şubesiz</span>';

        const platformBadge = getPlatformBadgeHtml(u.platform);

        const total = u.totalSeconds || 0;
        const cardPct = total > 0 ? Math.round((u.cardSeconds / total) * 100) : 50;
        const gamePct = total > 0 ? (100 - cardPct) : 50;

        let unitChipsHtml = '<span style="color:var(--text-dim); font-size:0.72rem;">Kayıt yok</span>';
        if (u.unitDurations && typeof u.unitDurations === 'object') {
          const uEntries = Object.entries(u.unitDurations).filter(([_, s]) => Number(s) > 0);
          if (uEntries.length > 0) {
            unitChipsHtml = uEntries.slice(0, 3).map(([uNo, sec]) => {
              return '<span class="unit-time-chip" title="Ünite ' + uNo + ': ' + formatDuration(sec) + '">Ü.' + uNo + ': ' + formatDuration(sec) + '</span>';
            }).join('');
            if (uEntries.length > 3) {
              unitChipsHtml += '<span class="unit-time-chip">+' + (uEntries.length - 3) + '</span>';
            }
          }
        }

        return '<tr>' +
          '<td>' +
            '<div class="user-cell">' +
              '<div class="user-avatar-bubble">' + getAvatarHtml(u.avatar) + '</div>' +
              '<div>' +
                '<div class="user-meta-name">' + u.displayName + '</div>' +
                '<div class="user-meta-email">' + u.email + '</div>' +
              '</div>' +
            '</div>' +
          '</td>' +
          '<td>' + platformBadge + '</td>' +
          '<td>' +
            branchBadge +
            '<span class="tag-pill tag-track" style="display:inline-block; margin-top:2px;">' + u.lang + ' • ' + u.track + ' (' + u.level + ')</span>' +
          '</td>' +
          '<td>' +
            '<div class="date-meta-cell">' +
              '<span class="date-meta-primary">' + u.createdAtFormatted + '</span>' +
              '<span class="date-meta-secondary">' + u.createdAgo + '</span>' +
            '</div>' +
          '</td>' +
          '<td>' +
            '<div class="date-meta-cell">' +
              '<span class="date-meta-primary">' + u.lastActiveFormatted + '</span>' +
              '<span class="recency-pill ' + u.activityRecency.cls + '" style="margin-top:2px;">' + u.activityRecency.label + '</span>' +
            '</div>' +
          '</td>' +
          '<td>' +
            '<div>' +
              '<span class="time-badge-main">' + u.totalTimeFormatted + '</span>' +
              '<div class="time-mini-bar" title="Kart: ' + u.cardTimeFormatted + ' • Pratik: ' + u.gameTimeFormatted + '">' +
                '<div class="time-bar-card" style="width:' + cardPct + '%;"></div>' +
                '<div class="time-bar-game" style="width:' + gamePct + '%;"></div>' +
              '</div>' +
              '<div style="font-size:0.68rem; color:var(--text-dim); margin-top:2px;">%' + cardPct + ' Kart • %' + gamePct + ' Pratik</div>' +
            '</div>' +
          '</td>' +
          '<td>' +
            '<div style="font-size:0.76rem; line-height:1.4;">' +
              '<div style="color:#38bdf8; font-weight:600;">Kart: ' + u.cardTimeFormatted + '</div>' +
              '<div style="color:#f59e0b; font-weight:600;">Pratik: ' + u.gameTimeFormatted + '</div>' +
            '</div>' +
          '</td>' +
          '<td><div style="display:flex; flex-wrap:wrap; gap:3px; max-width:160px;">' + unitChipsHtml + '</div></td>' +
          '<td style="text-align: center; white-space: nowrap;">' +
            '<button class="btn btn-secondary" onclick="openStudentDetail(\'' + u.id + '\')" style="padding:4px 8px; font-size:0.75rem;" title="Detaylı İncele">' +
              'Detay' +
            '</button>' +
          '</td>' +
        '</tr>';
      }).join('');
    }

    // 6. GERİ BİLDİRİMLER LİSTELE
    function renderFeedbacks() {
      const grid = document.getElementById('feedbackGrid');
      if (!grid) return;

      const typeFilter = document.getElementById('filterFeedbackType').value;
      const statusFilter = document.getElementById('filterFeedbackStatus').value;
      const search = (document.getElementById('filterFeedbackSearch').value || '').toLowerCase().trim();

      const filtered = rawFeedbacks.filter(f => {
        const matchesType = typeFilter === 'all' || f.type === typeFilter;
        let matchesStatus = true;
        if (statusFilter === 'pending') matchesStatus = !f.replied;
        else if (statusFilter === 'replied') matchesStatus = !!f.replied;

        const matchesSearch = !search || 
          f.name.toLowerCase().includes(search) || 
          f.email.toLowerCase().includes(search) || 
          f.message.toLowerCase().includes(search);

        return matchesType && matchesStatus && matchesSearch;
      });

      if (filtered.length === 0) {
        grid.innerHTML = '<div class="empty-state" style="grid-column: 1 / -1;"><div class="empty-icon">📬</div><div>Geri bildirim bulunamadı.</div></div>';
        return;
      }

      const typeLabels = {
        bug: { text: 'Hata Bildirimi', color: 'var(--danger)', bg: 'rgba(239,68,68,0.1)' },
        word_fix: { text: 'Kelime / Çeviri', color: 'var(--warning)', bg: 'rgba(245,158,11,0.1)' },
        suggestion: { text: 'Fikir & Öneri', color: 'var(--primary)', bg: 'rgba(59,130,246,0.1)' },
        general: { text: 'Genel Görüş', color: 'var(--purple)', bg: 'rgba(139,92,246,0.1)' }
      };

      grid.innerHTML = filtered.map(f => {
        const meta = typeLabels[f.type] || typeLabels.general;
        const statusHtml = f.replied 
          ? '<span style="color:var(--success); font-size:0.72rem; font-weight:700;">Yanıtlandı</span>'
          : '<span style="color:var(--warning); font-size:0.72rem; font-weight:700;">Yanıt Bekliyor</span>';

        return '<div class="fb-card">' +
          '<div class="fb-card-header">' +
            '<div>' +
              '<span class="tag-pill" style="background:' + meta.bg + '; color:' + meta.color + '; font-size:0.7rem;">' + meta.text + '</span>' +
              '<strong style="display:block; margin-top:4px; font-size:0.86rem; color:var(--text);">' + f.name + '</strong>' +
              '<div class="fb-meta">' + (f.email || 'E-posta yok') + ' • ' + f.date + '</div>' +
            '</div>' +
            statusHtml +
          '</div>' +
          '<div class="fb-msg">' + (f.message || 'Boş mesaj') + '</div>' +
          '<div class="fb-actions">' +
            '<span style="font-size:0.7rem; color:var(--text-dim);">' + f.language + ' • ' + f.appVersion + '</span>' +
            '<button class="btn btn-secondary" onclick="openFeedbackReplyModal(\'' + f.id + '\')" style="padding:4px 10px; font-size:0.76rem;">' +
              (f.replied ? 'Yanıtı Gör / Güncelle' : 'Yanıtla') +
            '</button>' +
          '</div>' +
        '</div>';
      }).join('');
    }

    // 7. LİDERLİK TABLOSU
    function renderLeaderboard() {
      const tbody = document.getElementById('leaderboardTableBody');
      if (!tbody) return;

      const sorted = [...rawUsers].sort((a, b) => (b.xp || 0) - (a.xp || 0));
      if (sorted.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state"><div class="empty-icon">🏆</div><div>Kayıt bulunamadı.</div></td></tr>';
        return;
      }

      tbody.innerHTML = sorted.map((u, i) => {
        const rank = i + 1;
        const platformBadge = getPlatformBadgeHtml(u.platform);

        let rankBadge = rank;
        if (rank === 1) rankBadge = '1 🥇';
        else if (rank === 2) rankBadge = '2 🥈';
        else if (rank === 3) rankBadge = '3 🥉';

        let badgeTitle = 'Acemi';
        if (u.xp >= 5000) badgeTitle = 'Üstat';
        else if (u.xp >= 2000) badgeTitle = 'Kaşif';
        else if (u.xp >= 1000) badgeTitle = 'Gezgin';
        else if (u.xp >= 500) badgeTitle = 'Çırak';

        return '<tr>' +
          '<td style="font-weight:800; font-size:0.95rem; color:' + (rank <= 3 ? 'var(--warning)' : 'var(--text-muted)') + ';">' + rankBadge + '</td>' +
          '<td>' +
            '<div class="user-cell">' +
              '<div class="user-avatar-bubble">' + getAvatarHtml(u.avatar) + '</div>' +
              '<div>' +
                '<div style="font-weight:700;">' + u.displayName + '</div>' +
                '<div style="font-size:0.72rem; color:var(--text-dim);">' + (u.branch ? u.branch : 'Şubesiz') + '</div>' +
              '</div>' +
            '</div>' +
          '</td>' +
          '<td>' + platformBadge + '</td>' +
          '<td><span class="tag-pill tag-track">' + u.lang + ' • ' + u.track + '</span></td>' +
          '<td><span class="tag-pill" style="background:rgba(139,92,246,0.12); color:var(--purple);">' + badgeTitle + '</span></td>' +
          '<td><span class="tag-pill tag-streak">' + (u.dayStreak || u.maxStreak) + ' Gün</span></td>' +
          '<td><strong style="color:var(--warning); font-size:0.95rem;">' + (u.xp || 0).toLocaleString('tr-TR') + ' XP</strong></td>' +
        '</tr>';
      }).join('');
    }

    // ÖĞRENCİ DETAY MODALI
    window.openStudentDetail = function(userId) {
      currentActiveDetailUserId = userId;
      const u = rawUsers.find(x => x.id === userId);
      if (!u) return;

      const avatarWrap = document.getElementById('modalAvatarWrap');
      if (avatarWrap) avatarWrap.innerHTML = getAvatarHtml(u.avatar);

      document.getElementById('modalName').textContent = u.displayName;
      document.getElementById('modalBranchBadge').textContent = u.branch ? ('Şube: ' + u.branch) : 'Şubesiz';
      document.getElementById('modalEmail').textContent = u.email || 'E-posta belirtilmedi';
      document.getElementById('modalUid').textContent = 'UID: ' + u.id;
      document.getElementById('modalMetaDates').textContent = 'Kayıt: ' + u.createdAtFormatted + ' • Son Aktiflik: ' + u.lastActiveFormatted;

      const platBadgeWrap = document.getElementById('modalPlatformBadge');
      if (platBadgeWrap) platBadgeWrap.innerHTML = getPlatformBadgeHtml(u.platform);

      const channelInfo = document.getElementById('modalChannelInfo');
      if (channelInfo) {
        const platName = u.platform === 'ios' ? 'Apple iOS' : (u.platform === 'android' ? 'Google Android' : 'Web Tarayıcı');
        channelInfo.innerHTML = getPlatformBadgeHtml(u.platform) + ' <span style="font-size:0.75rem; color:var(--text-dim); margin-left:4px;">(' + platName + ')</span>';
      }

      document.getElementById('modalDetailCreatedAt').textContent = u.createdAtFormatted;
      document.getElementById('modalDetailCreatedAgo').textContent = u.createdAgo;
      document.getElementById('modalDetailLastActive').textContent = u.lastActiveFormatted;
      document.getElementById('modalDetailLastActiveAgo').textContent = u.activityRecency.sub || u.activityRecency.label;

      const modalRecencyBadge = document.getElementById('modalRecencyBadge');
      if (modalRecencyBadge) {
        modalRecencyBadge.className = 'recency-pill ' + u.activityRecency.cls;
        modalRecencyBadge.textContent = u.activityRecency.label;
      }

      const total = u.totalSeconds || 0;
      const cardPct = total > 0 ? Math.round((u.cardSeconds / total) * 100) : 50;
      const gamePct = total > 0 ? (100 - cardPct) : 50;

      document.getElementById('modalDetailTotalTime').textContent = u.totalTimeFormatted;
      document.getElementById('modalDetailTimeRatio').textContent = '%' + cardPct + ' Kart • %' + gamePct + ' Pratik';

      // Ünite bazlı süreler
      const unitGrid = document.getElementById('modalUnitDurationsGrid');
      if (unitGrid) {
        if (u.unitDurations && typeof u.unitDurations === 'object') {
          const entries = Object.entries(u.unitDurations).filter(([_, s]) => Number(s) > 0);
          if (entries.length > 0) {
            unitGrid.innerHTML = entries.map(([uNo, s]) => {
              return '<div class="unit-time-chip" style="font-size:0.74rem; padding:3px 7px;">' +
                '<span>Ünite ' + uNo + ':</span> ' +
                '<strong style="color:var(--cyan);">' + formatDuration(s) + '</strong>' +
              '</div>';
            }).join('');
          } else {
            unitGrid.innerHTML = '<span style="color:var(--text-dim); font-size:0.75rem;">Kayıt yok.</span>';
          }
        } else {
          unitGrid.innerHTML = '<span style="color:var(--text-dim); font-size:0.75rem;">Kayıt yok.</span>';
        }
      }

      // Akademik
      document.getElementById('modalLangText').textContent = u.lang;
      document.getElementById('modalTrackText').textContent = u.track || '—';
      document.getElementById('modalLevelText').textContent = u.level + ' Seviyesi';
      document.getElementById('modalUnitText').textContent = 'Ünite ' + u.unitNo;
      document.getElementById('modalDailyGoalText').textContent = u.dailyGoal + ' Kelime/Gün';
      document.getElementById('modalStreakPledgeText').textContent = u.streakPledgeDays > 0 ? (u.streakPledgeDays + ' Günlük Taahhüt') : 'Taahhüt Yok';

      // İstatistikler
      document.getElementById('modalXp').textContent = (u.xp || 0).toLocaleString('tr-TR') + ' XP';
      document.getElementById('modalLearned').textContent = u.learnedCount + ' Kelime';
      document.getElementById('modalStreak').textContent = (u.dayStreak || 1) + ' Gün';
      document.getElementById('modalMaxStreak').textContent = (u.maxStreak || u.maxDayStreak || 1) + ' Gün';
      document.getElementById('modalArenaSolved').textContent = (u.arenaWordsSolved || 0) + ' Soru';
      document.getElementById('modalCleanWins').textContent = (u.cleanWins || 0) + ' Zafer';
      document.getElementById('modalCardTime').textContent = u.cardTimeFormatted;
      document.getElementById('modalGameTime').textContent = u.gameTimeFormatted;

      // Kelime Listesi
      const wordsCountBadge = document.getElementById('modalWordsCountBadge');
      if (wordsCountBadge) wordsCountBadge.textContent = u.learnedCount;

      const wordsChipsGrid = document.getElementById('modalWordsChipsGrid');
      if (wordsChipsGrid) {
        if (!u.learnedIds || u.learnedIds.length === 0) {
          wordsChipsGrid.innerHTML = '<span style="font-size:0.78rem; color:var(--text-dim); padding:6px 0;">Henüz öğrenilmiş kelime kaydı yok.</span>';
        } else {
          const chipsHtml = u.learnedIds.map(id => {
            const wordObj = wordsById.get(String(id));
            if (wordObj) {
              const wordText = wordObj.kelime || ('ID:' + id);
              const meaning = wordObj['anlamı'] || wordObj.anlami || '';
              const unitNo = wordObj.unite_no ? ('(Ü.' + wordObj.unite_no + ')') : '';
              return '<div style="background:var(--bg-card); border:1px solid var(--border); border-radius:6px; padding:3px 7px; font-size:0.76rem; display:inline-flex; align-items:center; gap:5px;">' +
                '<span style="font-weight:700; color:var(--text);">' + wordText + '</span>' +
                '<span style="color:var(--text-dim); font-size:0.72rem;">' + meaning + '</span>' +
                '<span style="color:var(--cyan); font-size:0.68rem; font-weight:700;">' + unitNo + '</span>' +
              '</div>';
            } else {
              return '<div style="background:var(--bg-card); border:1px solid var(--border); border-radius:6px; padding:3px 7px; font-size:0.76rem; color:var(--text-dim);">Kelime #' + id + '</div>';
            }
          }).join('');
          wordsChipsGrid.innerHTML = chipsHtml;
        }
      }

      // Alıştırma Turları
      const gameNames = {
        match: 'Eşleştirme',
        quiz: '4 Şıklı Test',
        tetris: 'Harf Tetrisi',
        cloze: 'Boşluk Doldurma',
        listen: 'Dinle & Yaz',
        truefalse: 'Doğru/Yanlış',
        scramble: 'Kelime Karıştırma',
        anagram: 'Harf Harf'
      };
      const statsGrid = document.getElementById('modalGameStatsGrid');
      if (statsGrid) {
        statsGrid.innerHTML = Object.entries(gameNames).map(([k, label]) => {
          const count = (u.gameStats && u.gameStats[k]) ? u.gameStats[k] : 0;
          return '<div class="game-stat-item">' +
            '<span>' + label + '</span>' +
            '<strong>' + count + ' Tur</strong>' +
          '</div>';
        }).join('');
      }

      // Rozetler
      const badgesContainer = document.getElementById('modalBadgesList');
      if (badgesContainer) {
        if (u.badges && u.badges.length > 0) {
          badgesContainer.innerHTML = u.badges.map(b => 
            '<span class="tag-pill" style="background:rgba(59,130,246,0.12); color:#60a5fa; border:1px solid rgba(59,130,246,0.25);">' + b + '</span>'
          ).join('');
        } else {
          badgesContainer.innerHTML = '<span style="color:var(--text-dim); font-size:0.8rem;">Henüz rozet kazanılmadı.</span>';
        }
      }

      document.getElementById('studentDetailModal').classList.add('active');
    };

    window.toggleModalWordsList = function() {
      const c = document.getElementById('modalWordsListContainer');
      const arrow = document.getElementById('modalWordsToggleArrow');
      if (!c) return;
      if (c.style.display === 'none' || !c.style.display) {
        c.style.display = 'block';
        if (arrow) arrow.textContent = 'Kapat';
      } else {
        c.style.display = 'none';
        if (arrow) arrow.textContent = 'Aç';
      }
    };

    document.getElementById('closeDetailModalBtn').addEventListener('click', () => {
      document.getElementById('studentDetailModal').classList.remove('active');
    });
    document.getElementById('studentDetailModal').addEventListener('click', (e) => {
      if (e.target === document.getElementById('studentDetailModal')) {
        document.getElementById('studentDetailModal').classList.remove('active');
      }
    });

    // Modal içindeki butonlar
    const modalResetPwBtn = document.getElementById('modalResetPasswordBtn');
    if (modalResetPwBtn) {
      modalResetPwBtn.addEventListener('click', () => {
        if (!currentActiveDetailUserId) return;
        const u = rawUsers.find(x => x.id === currentActiveDetailUserId);
        const email = u && u.email ? encodeURIComponent(u.email) : '';
        const url = 'password-reset-tool.html' + (email ? `?email=${email}` : '');
        window.open(url, '_blank');
      });
    }

    const modalDelBtn = document.getElementById('modalDeleteStudentBtn');
    if (modalDelBtn) {
      modalDelBtn.addEventListener('click', () => {
        if (!currentActiveDetailUserId) return;
        const u = rawUsers.find(x => x.id === currentActiveDetailUserId);
        deleteSingleUser(currentActiveDetailUserId, u ? u.displayName : '');
      });
    }

    // Toplu Silme Butonları
    const clearSelBtn = document.getElementById('clearSelectionBtn');
    if (clearSelBtn) {
      clearSelBtn.addEventListener('click', () => {
        selectedUserIds.clear();
        renderUsers();
      });
    }
    const bulkDelBtn = document.getElementById('bulkDeleteBtn');
    if (bulkDelBtn) bulkDelBtn.addEventListener('click', deleteSelectedUsers);

    const selectAllCb = document.getElementById('selectAllCheckbox');
    if (selectAllCb) {
      selectAllCb.addEventListener('change', (e) => {
        const checked = e.target.checked;
        document.querySelectorAll('.user-select-cb').forEach(cb => {
          cb.checked = checked;
          const uid = cb.getAttribute('data-id');
          if (uid) {
            if (checked) selectedUserIds.add(uid);
            else selectedUserIds.delete(uid);
          }
        });
        updateSelectionUI();
      });
    }

    // GERİ BİLDİRİM YANIT İŞLEMLERİ
    function getFeedbackReplies() {
      try { return JSON.parse(localStorage.getItem('lexiq_admin_feedback_replies') || '{}'); }
      catch(e) { return {}; }
    }

    function saveFeedbackReply(id, replyData) {
      try {
        const all = getFeedbackReplies();
        const dateStr = new Date().toLocaleString('tr-TR');
        all[id] = { replied: true, date: dateStr, timestamp: Date.now(), ...replyData };
        localStorage.setItem('lexiq_admin_feedback_replies', JSON.stringify(all));

        const f = rawFeedbacks.find(x => x.id === id);
        if (f) {
          f.replied = true;
          f.replyDate = dateStr;
          f.replyText = all[id].replyText || '';
          f.replyTo = all[id].toEmail || f.email || '';
        }
        if (db) {
          db.collection('feedbacks').doc(id).update({
            replied: true,
            replyDate: dateStr,
            replyText: all[id].replyText || ''
          }).catch(() => {});
        }
        updateStats();
        renderFeedbacks();
      } catch (e) {
        console.error("Yanıt kaydetme:", e);
      }
    }

    window.openFeedbackReplyModal = function(id) {
      currentReplyFeedbackId = id;
      const f = rawFeedbacks.find(x => x.id === id);
      if (!f) return;

      document.getElementById('replyStudentName').textContent = f.name;
      document.getElementById('replyStudentDate').textContent = f.date;
      document.getElementById('replyOriginalMessage').textContent = f.message;
      document.getElementById('replyModalEmailInput').value = f.replyTo || f.email || '';
      document.getElementById('replyModalMessageInput').value = f.replyText || '';

      document.getElementById('feedbackReplyModal').classList.add('active');
    };

    function closeReplyModal() {
      document.getElementById('feedbackReplyModal').classList.remove('active');
      currentReplyFeedbackId = null;
    }

    const closeFeedbackReplyModalBtn = document.getElementById('closeFeedbackReplyModalBtn');
    if (closeFeedbackReplyModalBtn) closeFeedbackReplyModalBtn.addEventListener('click', closeReplyModal);

    // Geri Bildirim Şablonları
    const tplContainer = document.getElementById('replyQuickTemplates');
    if (tplContainer) {
      tplContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.quick-tpl-btn');
        if (!btn) return;
        const tplKey = btn.getAttribute('data-tpl');
        const f = rawFeedbacks.find(x => x.id === currentReplyFeedbackId);
        if (!f) return;
        const msgInput = document.getElementById('replyModalMessageInput');
        if (tplKey === 'bug_fixed') {
          msgInput.value = `Merhaba ${f.name},\n\nİlettiğiniz hata bildirimi incelenmiş ve sorun giderilmiştir.\n\nLexiGo'yu geliştirmemize katkı sağladığınız için teşekkür ederiz.\n\nİyi çalışmalar!\nLexiGo Ekibi`;
        } else if (tplKey === 'word_fixed') {
          msgInput.value = `Merhaba ${f.name},\n\nİlettiğiniz kelime / çeviri düzeltmesi veri tabanımıza işlenmiştir.\n\nDikkatiniz ve katkınız için teşekkür ederiz.\n\nİyi dersler!\nLexiGo Ekibi`;
        }
        msgInput.focus();
      });
    }

    const replyMarkOnlyBtn = document.getElementById('replyMarkOnlyBtn');
    if (replyMarkOnlyBtn) {
      replyMarkOnlyBtn.addEventListener('click', () => {
        const f = rawFeedbacks.find(x => x.id === currentReplyFeedbackId);
        if (!f) return;
        const emailInput = document.getElementById('replyModalEmailInput');
        const msgInput = document.getElementById('replyModalMessageInput');
        saveFeedbackReply(f.id, {
          toEmail: (emailInput ? emailInput.value : '').trim(),
          replyText: (msgInput ? msgInput.value : '').trim()
        });
        showAdminToast("Bildirim yanıtlandı olarak kaydedildi.");
        closeReplyModal();
      });
    }

    const replyCopyBtn = document.getElementById('replyCopyBtn');
    if (replyCopyBtn) {
      replyCopyBtn.addEventListener('click', () => {
        const msgInput = document.getElementById('replyModalMessageInput');
        const text = msgInput ? msgInput.value : '';
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(() => showAdminToast("Yanıt panoya kopyalandı."));
        }
      });
    }

    const replyGmailBtn = document.getElementById('replyGmailBtn');
    if (replyGmailBtn) {
      replyGmailBtn.addEventListener('click', () => {
        const f = rawFeedbacks.find(x => x.id === currentReplyFeedbackId);
        if (!f) return;
        const toEmail = document.getElementById('replyModalEmailInput').value.trim();
        const subject = document.getElementById('replyModalSubjectInput').value.trim();
        const body = document.getElementById('replyModalMessageInput').value.trim();
        saveFeedbackReply(f.id, { toEmail, replyText: body });
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(toEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(gmailUrl, '_blank');
        closeReplyModal();
      });
    }

    const replyMailClientBtn = document.getElementById('replyMailClientBtn');
    if (replyMailClientBtn) {
      replyMailClientBtn.addEventListener('click', () => {
        const f = rawFeedbacks.find(x => x.id === currentReplyFeedbackId);
        if (!f) return;
        const toEmail = document.getElementById('replyModalEmailInput').value.trim();
        const subject = document.getElementById('replyModalSubjectInput').value.trim();
        const body = document.getElementById('replyModalMessageInput').value.trim();
        saveFeedbackReply(f.id, { toEmail, replyText: body });
        window.location.href = `mailto:${encodeURIComponent(toEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        closeReplyModal();
      });
    }

    // CSV İNDİRME (ÖĞRENCİLER - KANAL / PLATFORM DAHİL)
    document.getElementById('exportCsvBtn').addEventListener('click', () => {
      if (rawUsers.length === 0) {
        alert("İndirilecek veri bulunamadı.");
        return;
      }
      let csv = "\uFEFF";
      csv += "Öğrenci Adı;E-posta;Kanal (Platform);Resmi Şube;Hedef Dil;Kur;Seviye;Çalışılan Ünite;Günlük Hedef;Seri Taahhüdü;Toplam XP;Öğrenilen Kelime;Güncel Seri;Maks Seri;Kart Süresi (Dk);Pratik Süresi (Dk);Arenada Çözülen;Kusursuz Zaferler;Kayıt Tarihi;Son Aktiflik;UID\n";

      rawUsers.forEach(u => {
        const cardMins = Math.round((u.cardSeconds || 0) / 60);
        const gameMins = Math.round((u.gameSeconds || 0) / 60);
        const platLabel = u.platform === 'ios' ? 'iOS' : (u.platform === 'android' ? 'Android' : 'Web');
        csv += '"' + u.displayName + '";"' + u.email + '";"' + platLabel + '";"' + (u.branch || 'Şubesiz') + '";"' + u.lang + '";"' + u.track + '";"' + u.level + '";' + u.unitNo + ';' + u.dailyGoal + ';' + u.streakPledgeDays + ';' + u.xp + ';' + u.learnedCount + ';' + (u.dayStreak || 1) + ';' + (u.maxStreak || 0) + ';' + cardMins + ';' + gameMins + ';' + (u.arenaWordsSolved || 0) + ';' + (u.cleanWins || 0) + ';"' + u.createdAtOnly + '";"' + u.lastActiveFormatted + '";"' + u.id + '"\n';
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'LexiGo_Ogrenci_Raporu_' + new Date().toISOString().slice(0,10) + '.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });

    // CSV İNDİRME (SÜRE VE GİRİŞ - KANAL / PLATFORM DAHİL)
    document.getElementById('exportTimeCsvBtn').addEventListener('click', () => {
      if (rawUsers.length === 0) return;
      let csv = "\uFEFF";
      csv += "Öğrenci Adı;E-posta;Kanal (Platform);Resmi Şube;Hedef Dil;Kur;Seviye;Kayıt Tarihi;Kayıt Gün Farkı;Son Giriş;Durum;Toplam Süre;Toplam Dk;Kart Dk;Pratik Dk;Ünite Süreleri;Toplam XP;Öğrenilen Kelime;UID\n";

      rawUsers.forEach(u => {
        const cardMins = Math.round((u.cardSeconds || 0) / 60);
        const gameMins = Math.round((u.gameSeconds || 0) / 60);
        const totalMins = Math.round((u.totalSeconds || 0) / 60);
        const platLabel = u.platform === 'ios' ? 'iOS' : (u.platform === 'android' ? 'Android' : 'Web');

        let unitDetailStr = '';
        if (u.unitDurations && typeof u.unitDurations === 'object') {
          unitDetailStr = Object.entries(u.unitDurations)
            .filter(([_, s]) => Number(s) > 0)
            .map(([uNo, s]) => 'Ü.' + uNo + ':' + Math.round(Number(s) / 60) + 'dk')
            .join(' | ');
        }

        csv += '"' + u.displayName + '";"' +
               u.email + '";"' +
               platLabel + '";"' +
               (u.branch || 'Şubesiz') + '";"' +
               u.lang + '";"' +
               u.track + '";"' +
               u.level + '";"' +
               u.createdAtFormatted + '";"' +
               u.createdAgo + '";"' +
               u.lastActiveFormatted + '";"' +
               (u.activityRecency ? u.activityRecency.label : '') + '";"' +
               u.totalTimeFormatted + '";' +
               totalMins + ';' +
               cardMins + ';' +
               gameMins + ';"' +
               unitDetailStr + '";' +
               (u.xp || 0) + ';' +
               u.learnedCount + ';"' +
               u.id + '"\n';
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'LexiGo_Giris_ve_Sure_Takibi_' + new Date().toISOString().slice(0, 10) + '.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });

    // CSV İNDİRME (GERİ BİLDİRİMLER)
    document.getElementById('exportFeedbacksCsvBtn').addEventListener('click', () => {
      if (rawFeedbacks.length === 0) return;
      let csv = "\uFEFF";
      csv += "Tarih;Kategori;Öğrenci;E-posta;Dil;Kur/Seviye;Sürüm;Mesaj;Yanıt Durumu;Yanıt Tarihi;Yanıt Metni\n";

      rawFeedbacks.forEach(f => {
        const cleanMsg = (f.message || '').replace(/"/g, '""').replace(/\n/g, ' ');
        const cleanReply = (f.replyText || '').replace(/"/g, '""').replace(/\n/g, ' ');
        csv += '"' + f.date + '";"' + f.type + '";"' + f.name + '";"' + f.email + '";"' + f.language + '";"' + f.track + '/' + f.level + '";"' + f.appVersion + '";"' + cleanMsg + '";"' + (f.replied ? 'Yanıtlandı' : 'Yanıt Bekliyor') + '";"' + (f.replyDate || '') + '";"' + cleanReply + '"\n';
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'LexiGo_Geri_Bildirimler_' + new Date().toISOString().slice(0,10) + '.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });

    // PIN DEĞİŞTİRME
    const changePinModal = document.getElementById('changePinModal');
    document.getElementById('changePinBtn').addEventListener('click', () => {
      document.getElementById('currentPinInput').value = '';
      document.getElementById('newPinInput').value = '';
      document.getElementById('changePinMsg').style.display = 'none';
      changePinModal.classList.add('active');
    });
    document.getElementById('closeChangePinModalBtn').addEventListener('click', () => {
      changePinModal.classList.remove('active');
    });

    function handleChangePinSubmit() {
      const current = document.getElementById('currentPinInput').value.trim();
      const newPin = document.getElementById('newPinInput').value.trim();
      const msg = document.getElementById('changePinMsg');
      const validPin = localStorage.getItem('lexiq_admin_custom_pin') || '1923';

      if (current !== validPin) {
        msg.style.display = 'block';
        msg.style.color = 'var(--danger)';
        msg.textContent = 'Mevcut PIN kodu hatalı!';
        return;
      }
      if (newPin.length < 4) {
        msg.style.display = 'block';
        msg.style.color = 'var(--danger)';
        msg.textContent = 'Yeni PIN en az 4 karakter olmalıdır.';
        return;
      }

      localStorage.setItem('lexiq_admin_custom_pin', newPin);
      msg.style.display = 'block';
      msg.style.color = 'var(--success)';
      msg.textContent = 'PIN kodu başarıyla güncellendi!';
      setTimeout(() => changePinModal.classList.remove('active'), 1200);
    }

    // TOAST BİLDİRİMİ
    let toastTimeout = null;
    function showAdminToast(msg, icon = 'info') {
      const toast = document.getElementById('adminToast');
      const toastMsg = document.getElementById('adminToastMsg');
      if (!toast || !toastMsg) return;
      toastMsg.textContent = msg;
      toast.classList.add('show');
      if (toastTimeout) clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => toast.classList.remove('show'), 2800);
    }

    // Filtre Olay Dinleyicileri
    document.getElementById('searchInput').addEventListener('input', renderUsers);
    const filterPlatformEl = document.getElementById('filterPlatform');
    if (filterPlatformEl) filterPlatformEl.addEventListener('change', renderUsers);
    const filterBranchEl = document.getElementById('filterBranch');
    if (filterBranchEl) filterBranchEl.addEventListener('change', renderUsers);
    document.getElementById('filterTrack').addEventListener('change', renderUsers);
    document.getElementById('filterLang').addEventListener('change', renderUsers);

    const sortStudentsEl = document.getElementById('sortStudents');
    if (sortStudentsEl) {
      sortStudentsEl.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val === 'xp_desc') studentSortState = { key: 'xp', dir: 'desc' };
        else if (val === 'time_desc') studentSortState = { key: 'time', dir: 'desc' };
        else if (val === 'learned_desc') studentSortState = { key: 'learned', dir: 'desc' };
        else if (val === 'streak_desc') studentSortState = { key: 'streak', dir: 'desc' };
        else if (val === 'platform_asc') studentSortState = { key: 'platform', dir: 'asc' };
        else if (val === 'active_desc') studentSortState = { key: 'activity', dir: 'desc' };
        else if (val === 'name_asc') studentSortState = { key: 'name', dir: 'asc' };
        else if (val === 'branch_asc') studentSortState = { key: 'branch', dir: 'asc' };
        else if (val === 'created_desc') studentSortState = { key: 'created', dir: 'desc' };
        renderUsers();
      });
    }

    const timeSearchInput = document.getElementById('timeSearchInput');
    if (timeSearchInput) timeSearchInput.addEventListener('input', renderTimeTracking);
    const filterTimePlatform = document.getElementById('filterTimePlatform');
    if (filterTimePlatform) filterTimePlatform.addEventListener('change', renderTimeTracking);
    const filterTimeBranch = document.getElementById('filterTimeBranch');
    if (filterTimeBranch) filterTimeBranch.addEventListener('change', renderTimeTracking);
    const filterTimeRecency = document.getElementById('filterTimeRecency');
    if (filterTimeRecency) filterTimeRecency.addEventListener('change', renderTimeTracking);
    
    const sortTimeTracking = document.getElementById('sortTimeTracking');
    if (sortTimeTracking) {
      sortTimeTracking.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val === 'total_desc') timeSortState = { key: 'totalTime', dir: 'desc' };
        else if (val === 'card_desc') timeSortState = { key: 'cardTime', dir: 'desc' };
        else if (val === 'game_desc') timeSortState = { key: 'gameTime', dir: 'desc' };
        else if (val === 'last_active_desc') timeSortState = { key: 'active', dir: 'desc' };
        else if (val === 'last_active_asc') timeSortState = { key: 'active', dir: 'asc' };
        else if (val === 'created_desc') timeSortState = { key: 'created', dir: 'desc' };
        else if (val === 'created_asc') timeSortState = { key: 'created', dir: 'asc' };
        else if (val === 'name_asc') timeSortState = { key: 'name', dir: 'asc' };
        renderTimeTracking();
      });
    }

    document.getElementById('filterFeedbackType').addEventListener('change', renderFeedbacks);
    document.getElementById('filterFeedbackStatus').addEventListener('change', renderFeedbacks);
    document.getElementById('filterFeedbackSearch').addEventListener('input', renderFeedbacks);

    document.getElementById('refreshBtn').addEventListener('click', () => {
      document.getElementById('refreshBtn').disabled = true;
      Promise.all([fetchUsers(), fetchFeedbacks()]).finally(() => {
        document.getElementById('refreshBtn').disabled = false;
        showAdminToast("Veriler güncellendi.");
      });
    });

    // Başlangıç PIN Kontrolü
    function checkPinAuth() {
      const isAuth = sessionStorage.getItem('lexiq_admin_auth') === 'true';
      const pinLock = document.getElementById('pinLockScreen');
      if (isAuth && pinLock) {
        pinLock.style.display = 'none';
        fetchUsers();
        fetchFeedbacks();
      } else if (pinLock) {
        pinLock.style.display = 'flex';
      }
    }

    function handlePinSubmit() {
      const input = document.getElementById('adminPinInput');
      const errorMsg = document.getElementById('pinErrorMsg');
      const val = (input ? input.value : '').trim();
      const validPin = localStorage.getItem('lexiq_admin_custom_pin') || '1923';

      if (val === validPin) {
        sessionStorage.setItem('lexiq_admin_auth', 'true');
        if (errorMsg) errorMsg.style.display = 'none';
        const pinLock = document.getElementById('pinLockScreen');
        if (pinLock) pinLock.style.display = 'none';
        fetchUsers();
        fetchFeedbacks();
      } else {
        if (errorMsg) errorMsg.style.display = 'block';
        if (input) {
          input.value = '';
          input.focus();
        }
      }
    }

    initSortableHeaders();
    checkPinAuth();
  
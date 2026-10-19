// Firebase Yapılandırması
const firebaseConfig = {
  apiKey: "AIzaSyB_bpBj_cs-EVR3H97bSj92OYUUKjQraCU",
  authDomain: "lexiq-6d699.firebaseapp.com",
  projectId: "lexiq-6d699",
  storageBucket: "lexiq-6d699.firebasestorage.app",
  messagingSenderId: "452877974071",
  appId: "1:452877974071:web:ef6c8cfd5984b8b5a91db2",
  measurementId: "G-L0WX1FBXL8"
};

// Firebase'i Başlat
let app, auth, db, storage;
try {
  if (typeof firebase !== 'undefined') {
    app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    if (auth && firebase.auth && firebase.auth.Auth && firebase.auth.Auth.Persistence) {
      auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(e => {
        console.warn("Firebase Auth setPersistence error:", e);
      });
    }
    db = firebase.firestore();
    if (typeof firebase.storage === 'function') {
      storage = firebase.storage();
    }
    console.log("Firebase başarıyla başlatıldı.");
  }
} catch (e) {
  console.error("Firebase başlatılamadı:", e);
}

// Global Durum
window.fbUser = null;
window.cachedFbUserData = null;

// ==========================================
// ADÜ YDYO 23 RESMİ HAZIRLIK ŞUBESİ VE METADATA
// ==========================================
window.SCHOOL_BRANCHES = [
  // İngilizce (EN-TR) - 17 Şube
  { code: 'İHS 101', name: 'İngilizce Hazırlık 101', lang: 'EN-TR', track: '4B', level: 'B1', trackName: 'Üst Kur' },
  { code: 'İHS 102', name: 'İngilizce Hazırlık 102', lang: 'EN-TR', track: '4B', level: 'B1', trackName: 'Üst Kur' },
  { code: 'İHS 103', name: 'İngilizce Hazırlık 103', lang: 'EN-TR', track: '4B', level: 'B1', trackName: 'Üst Kur' },
  { code: 'İHS 104', name: 'İngilizce Hazırlık 104', lang: 'EN-TR', track: '4B', level: 'B1', trackName: 'Üst Kur' },
  { code: 'İHS 105', name: 'İngilizce Hazırlık 105', lang: 'EN-TR', track: '4B', level: 'B1', trackName: 'Üst Kur' },
  { code: 'İHS 106', name: 'İngilizce Hazırlık 106', lang: 'EN-TR', track: '4B', level: 'B1', trackName: 'Üst Kur' },
  { code: 'İHS 107', name: 'İngilizce Hazırlık 107', lang: 'EN-TR', track: '4B', level: 'B1', trackName: 'Üst Kur' },
  { code: 'İHS 108', name: 'İngilizce Hazırlık 108', lang: 'EN-TR', track: '4B', level: 'B1', trackName: 'Üst Kur' },
  { code: 'İHS 109', name: 'İngilizce Hazırlık 109', lang: 'EN-TR', track: '4B', level: 'B1', trackName: 'Üst Kur' },
  { code: 'İHS 110', name: 'İngilizce Hazırlık 110', lang: 'EN-TR', track: '4B', level: 'B1', trackName: 'Üst Kur' },
  { code: 'İHS 111', name: 'İngilizce Hazırlık 111', lang: 'EN-TR', track: '4B', level: 'B1', trackName: 'Üst Kur' },
  { code: 'İHS 112', name: 'İngilizce Hazırlık 112', lang: 'EN-TR', track: '4A', level: 'A2', trackName: 'Alt Kur' },
  { code: 'İHS 113', name: 'İngilizce Hazırlık 113', lang: 'EN-TR', track: '4A', level: 'A2', trackName: 'Alt Kur' },
  { code: 'İHS 114', name: 'İngilizce Hazırlık 114', lang: 'EN-TR', track: '4A', level: 'A2', trackName: 'Alt Kur' },
  { code: 'İHS 115', name: 'İngilizce Hazırlık 115', lang: 'EN-TR', track: '4A', level: 'A2', trackName: 'Alt Kur' },
  { code: 'İHS 116', name: 'İngilizce Hazırlık 116', lang: 'EN-TR', track: '4A', level: 'A2', trackName: 'Alt Kur' },
  { code: 'İHS 117', name: 'İngilizce Hazırlık 117', lang: 'EN-TR', track: '4A', level: 'A2', trackName: 'Alt Kur' },

  // Fransızca (FR-TR) - 3 Şube
  { code: 'FHS 101', name: 'Fransızca Hazırlık 101', lang: 'FR-TR', track: '4B', level: 'B1', trackName: 'Üst Kur' },
  { code: 'FHS 102', name: 'Fransızca Hazırlık 102', lang: 'FR-TR', track: '4A', level: 'A2', trackName: 'Alt Kur' },
  { code: 'FHS 103', name: 'Fransızca Hazırlık 103', lang: 'FR-TR', track: '4A', level: 'A1', trackName: 'Alt Kur' },

  // Almanca (DE-TR) - 3 Şube
  { code: 'AHS 101', name: 'Almanca Hazırlık 101', lang: 'DE-TR', track: '4A', level: 'A1', trackName: 'Alt Kur' },
  { code: 'AHS 102', name: 'Almanca Hazırlık 102', lang: 'DE-TR', track: '4A', level: 'A2', trackName: 'Alt Kur' },
  { code: 'AHS 103', name: 'Almanca Hazırlık 103', lang: 'DE-TR', track: '4A', level: 'A1', trackName: 'Alt Kur' }
];

window.getCurrentWeekId = function() {
  const d = new Date();
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
};

// Firebase Hata Mesajlarını Türkçeleştirme
function getAuthErrorMessage(error) {
  if (!error) return "Bilinmeyen bir hata oluştu.";
  const code = error.code || "";
  switch (code) {
    case "auth/invalid-email":
      return "Geçersiz e-posta formatı. Lütfen kontrol ediniz.";
    case "auth/user-disabled":
      return "Bu kullanıcı hesabı devre dışı bırakılmıştır.";
    case "auth/user-not-found":
      return "Bu e-posta adresine ait kayıtlı bir hesap bulunamadı.";
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "E-posta adresi veya şifre hatalı.";
    case "auth/email-already-in-use":
      return "Bu e-posta adresi zaten kullanımda. Lütfen 'Giriş Yap' sekmesinden giriş yapınız.";
    case "auth/weak-password":
      return "Şifreniz çok zayıf. En az 6 karakter giriniz.";
    case "auth/operation-not-allowed":
      return "E-posta ile giriş yöntemi şu an aktif değil.";
    case "auth/network-request-failed":
      return "Ağ bağlantısı kurulamadı. İnternet bağlantınızı kontrol ediniz.";
    case "auth/too-many-requests":
      return "Çok fazla başarısız deneme yapıldı. Lütfen biraz bekleyiniz.";
    default:
      return error.message || "İşlem sırasında bir hata oluştu.";
  }
}
window.getAuthErrorMessage = getAuthErrorMessage;

// Auth Durumunu Dinle
if (auth) {
  let isInitialAuthCheck = true;
  auth.onAuthStateChanged((user) => {
    if (user) {
      window.fbUser = user;
      isInitialAuthCheck = false;
      console.log("Kullanıcı giriş yaptı:", user.uid, user.email);

      // Oturumu ve Beni Hatırla durumunu kalıcı tut
      if (user.email) {
        localStorage.setItem('lexiq_user_email', user.email);
        if (localStorage.getItem('lexiq_remember_me') !== 'false') {
          localStorage.setItem('lexiq_remember_email', user.email);
          localStorage.setItem('lexiq_remember_me', 'true');
        }
      }
      localStorage.setItem('lexiq_user_onboarded', 'true');
      if (window.state) {
        window.state.isOnboarded = true;
      }
      // Onboarding modalı açıksa ve yeni kayıt akışında değilse kapat
      const obModal = document.getElementById('onboardingModal');
      if (obModal && !window.isOnboardingAuthFlow) {
        obModal.classList.remove('active');
        obModal.style.display = 'none';
      }

      syncUserData(user);
    } else {
      const wasLoggedIn = !!window.fbUser;
      window.fbUser = null;
      window.cachedFbUserData = null;
      console.log("Kullanıcı çıkış yaptı veya giriş yapmadı.");
      // SADECE daha önce oturumu açık olan bir kullanıcı çıkış yaptıysa onUserLogout çağır.
      // İlk açılışta veya misafir modunda asla kullanıcıyı dışarı atma!
      if (wasLoggedIn && !isInitialAuthCheck && typeof window.onUserLogout === 'function') {
        window.onUserLogout();
      }
      isInitialAuthCheck = false;
    }
  });
}

// Kullanıcı verisini senkronize et (Firestore <-> LocalStorage <-> State)
async function syncUserData(user) {
  const currentUser = user || window.fbUser || (auth && auth.currentUser);
  if (!currentUser) return;

  const uid = currentUser.uid;
  let docData = null;

  if (db) {
    try {
      const userRef = db.collection('users').doc(uid);
      const doc = await userRef.get();
      if (doc.exists) {
        docData = doc.data();
      }
    } catch (err) {
      console.warn("Firestore kullanıcı bilgisi okunamadı:", err);
    }
  }

  // Bilgileri çöz ve önceliklendir (Firestore -> Auth -> LocalStorage -> Varsayılan)
  const localName = localStorage.getItem('lexiq_user_name');
  const resolvedName = (docData && docData.displayName && docData.displayName !== 'İsimsiz Kahraman' && docData.displayName !== 'Öğrenci')
    ? docData.displayName
    : ((localName && localName !== 'Öğrenci' && localName !== 'İsimsiz Kahraman')
        ? localName
        : (currentUser.displayName || 'Öğrenci'));

  const resolvedAvatar = (docData && docData.avatar && docData.avatar !== '🦊') ? docData.avatar : (localStorage.getItem('lexiq_user_avatar') || 'avatar_default');
  const resolvedEmail = currentUser.email || (docData && docData.email) || localStorage.getItem('lexiq_user_email') || '';
  const resolvedTrack = (docData && docData.track) || localStorage.getItem('lexiq_user_track') || '4A';
  const resolvedLevel = (docData && docData.level) || localStorage.getItem('lexiq_user_level') || 'A2';
  const resolvedLang = (docData && docData.lang) || localStorage.getItem('kelime_active_lang') || 'EN-TR';
  const resolvedBranch = (docData && docData.branch) || localStorage.getItem('lexiq_user_branch') || '';
  const resolvedBranchLocked = (docData && docData.branchLocked) || (localStorage.getItem('lexiq_branch_locked') === 'true') || !!resolvedBranch;
  const currentWeek = window.getCurrentWeekId ? window.getCurrentWeekId() : '2026-W42';
  let resolvedWeeklyWeek = (docData && docData.weeklyWeekId) || localStorage.getItem('lexiq_weekly_week') || currentWeek;
  let resolvedWeeklyXp = (docData && typeof docData.weeklyXp === 'number') ? docData.weeklyXp : parseInt(localStorage.getItem('lexiq_weekly_xp') || '0', 10);
  if (resolvedWeeklyWeek !== currentWeek) {
    resolvedWeeklyWeek = currentWeek;
    resolvedWeeklyXp = 0;
  }

  const localXP = parseInt(localStorage.getItem('kelime_xp') || '0', 10);
  const fbXP = (docData && typeof docData.xp === 'number') ? docData.xp : 0;
  const bestXP = Math.max(fbXP, localXP);

  // Öğrenilen Kelimeler, Rozetler ve Seri Senkronizasyonu
  const localLearnedMap = JSON.parse(localStorage.getItem('kelime_learned_map') || '{}');
  const fbLearnedMap = (docData && docData.learnedMap && typeof docData.learnedMap === 'object') ? docData.learnedMap : {};
  const mergedLearnedMap = Object.assign({}, fbLearnedMap, localLearnedMap);

  const localBadges = JSON.parse(localStorage.getItem('kelime_unlocked_badges') || '[]');
  const fbBadges = (docData && Array.isArray(docData.unlockedBadges)) ? docData.unlockedBadges : [];
  const mergedBadges = Array.from(new Set([...fbBadges, ...localBadges]));

  const localMaxStreak = parseInt(localStorage.getItem('kelime_max_streak') || '0', 10);
  const fbMaxStreak = (docData && typeof docData.maxStreak === 'number') ? docData.maxStreak : 0;
  const bestMaxStreak = Math.max(fbMaxStreak, localMaxStreak);

  const localArenaSolved = parseInt(localStorage.getItem('kelime_arena_solved') || '0', 10);
  const fbArenaSolved = (docData && typeof docData.arenaSolved === 'number') ? docData.arenaSolved : 0;
  const bestArenaSolved = Math.max(fbArenaSolved, localArenaSolved);

  // 1. Oyun İstatistikleri (gameStats) Senkronizasyonu
  const localGameStats = JSON.parse(localStorage.getItem('kelime_game_stats') || '{}');
  const fbGameStats = (docData && docData.gameStats && typeof docData.gameStats === 'object') ? docData.gameStats : {};
  const mergedGameStats = Object.assign({}, fbGameStats);
  for (const [k, v] of Object.entries(localGameStats)) {
    mergedGameStats[k] = Math.max(mergedGameStats[k] || 0, typeof v === 'number' ? v : 0);
  }

  // 2. Saf Zihin / Kusursuz Galibiyet (cleanWins)
  const localCleanWins = parseInt(localStorage.getItem('kelime_clean_wins') || '0', 10);
  const fbCleanWins = (docData && typeof docData.cleanWins === 'number') ? docData.cleanWins : 0;
  const bestCleanWins = Math.max(fbCleanWins, localCleanWins);

  // 3. Çalışma & Zaman Takibi (timeTracking: kartlar, oyunlar, ünite tamamlama süreleri)
  const fbTT = (docData && docData.timeTracking && typeof docData.timeTracking === 'object') ? docData.timeTracking : {};
  const localTimeCards = parseInt(localStorage.getItem('lexiq_time_cards') || '0', 10);
  const localTimeGames = parseInt(localStorage.getItem('lexiq_time_games') || '0', 10);
  const localFirstStart = parseInt(localStorage.getItem('lexiq_first_started_at') || '0', 10);
  const localRegAt = parseInt(localStorage.getItem('lexiq_registered_at') || '0', 10);
  const localUnitDurations = JSON.parse(localStorage.getItem('lexiq_unit_durations') || '{}');

  const bestCardSeconds = Math.max(fbTT.cardSeconds || 0, localTimeCards);
  const bestGameSeconds = Math.max(fbTT.gameSeconds || 0, localTimeGames);
  const bestFirstStart = (fbTT.firstStartedAt && localFirstStart) 
    ? Math.min(fbTT.firstStartedAt, localFirstStart) 
    : (fbTT.firstStartedAt || localFirstStart || Date.now());
  const bestRegAt = fbTT.registeredAt || localRegAt || (docData && docData.createdAt ? (docData.createdAt.toMillis ? docData.createdAt.toMillis() : Date.now()) : 0);
  const mergedUnitDurations = Object.assign({}, fbTT.unitDurations || {}, localUnitDurations);

  const syncedTimeTracking = {
    cardSeconds: bestCardSeconds,
    gameSeconds: bestGameSeconds,
    firstStartedAt: bestFirstStart,
    registeredAt: bestRegAt,
    unitDurations: mergedUnitDurations
  };

  const syncedProfile = {
    uid: uid,
    displayName: resolvedName,
    avatar: resolvedAvatar,
    email: resolvedEmail,
    track: resolvedTrack,
    level: resolvedLevel,
    lang: resolvedLang,
    branch: resolvedBranch,
    branchLocked: resolvedBranchLocked,
    weeklyXp: resolvedWeeklyXp,
    weeklyWeekId: resolvedWeeklyWeek,
    xp: bestXP,
    learnedMap: mergedLearnedMap,
    unlockedBadges: mergedBadges,
    maxStreak: bestMaxStreak,
    arenaWordsSolved: bestArenaSolved,
    gameStats: mergedGameStats,
    cleanWins: bestCleanWins,
    timeTracking: syncedTimeTracking
  };

  const localDayStreak = parseInt(localStorage.getItem('lexiq_day_streak') || '1', 10);
  const localMaxDayStreak = parseInt(localStorage.getItem('lexiq_max_day_streak') || '1', 10);
  const bestDayStreak = Math.max(docData?.dayStreak || 1, localDayStreak);
  const bestMaxDayStreak = Math.max(docData?.maxDayStreak || 1, localMaxDayStreak, bestDayStreak);
  const resolvedLastStudyDate = docData?.lastStudyDate || localStorage.getItem('lexiq_last_study_date') || '';

  // LocalStorage güncelle
  localStorage.setItem('lexiq_user_name', resolvedName);
  localStorage.setItem('lexiq_user_avatar', resolvedAvatar);
  localStorage.setItem('lexiq_user_email', resolvedEmail);
  localStorage.setItem('lexiq_user_track', resolvedTrack);
  localStorage.setItem('lexiq_user_level', resolvedLevel);
  localStorage.setItem('kelime_active_lang', resolvedLang);
  localStorage.setItem('lexiq_user_branch', resolvedBranch);
  localStorage.setItem('lexiq_branch_locked', resolvedBranchLocked ? 'true' : 'false');
  localStorage.setItem('lexiq_weekly_xp', resolvedWeeklyXp.toString());
  localStorage.setItem('lexiq_weekly_week', resolvedWeeklyWeek);
  localStorage.setItem('kelime_xp', bestXP.toString());
  localStorage.setItem('kelime_learned_map', JSON.stringify(mergedLearnedMap));
  localStorage.setItem('kelime_unlocked_badges', JSON.stringify(mergedBadges));
  localStorage.setItem('kelime_max_streak', bestMaxStreak.toString());
  localStorage.setItem('kelime_arena_solved', bestArenaSolved.toString());
  localStorage.setItem('kelime_game_stats', JSON.stringify(mergedGameStats));
  localStorage.setItem('kelime_clean_wins', bestCleanWins.toString());
  localStorage.setItem('lexiq_time_cards', bestCardSeconds.toString());
  localStorage.setItem('lexiq_time_games', bestGameSeconds.toString());
  localStorage.setItem('lexiq_first_started_at', bestFirstStart.toString());
  localStorage.setItem('lexiq_registered_at', bestRegAt.toString());
  localStorage.setItem('lexiq_unit_durations', JSON.stringify(mergedUnitDurations));
  localStorage.setItem('lexiq_day_streak', bestDayStreak.toString());
  localStorage.setItem('lexiq_max_day_streak', bestMaxDayStreak.toString());
  // Kayıtlı kullanıcının hesabı varsa (docData) veya lang/track bilgisi varsa onboarded kabul edilir
  const hasOnboarded = !!((docData && (docData.lang || docData.track || docData.onboarded)) || (localStorage.getItem('lexiq_user_onboarded') === 'true'));
  if (hasOnboarded) {
    localStorage.setItem('lexiq_user_onboarded', 'true');
    if (window.state) {
      window.state.isOnboarded = true;
      if (resolvedLang) window.state.activeLanguage = resolvedLang;
      if (resolvedTrack) window.state.userTrack = resolvedTrack;
      if (resolvedLevel) window.state.userLevel = resolvedLevel;
      if (resolvedBranch) {
        window.state.userBranch = resolvedBranch;
        window.state.branchLocked = true;
      }
    }
  }

  window.cachedFbUserData = syncedProfile;

  // Firestore'u güncelle (Giriş zamanı ve birleştirilmiş veriler)
  if (db) {
    try {
      await db.collection('users').doc(uid).set({
        displayName: resolvedName,
        avatar: resolvedAvatar,
        email: resolvedEmail,
        track: resolvedTrack,
        level: resolvedLevel,
        lang: resolvedLang,
        branch: resolvedBranch,
        branchLocked: resolvedBranchLocked,
        weeklyXp: resolvedWeeklyXp,
        weeklyWeekId: resolvedWeeklyWeek,
        xp: bestXP,
        learnedMap: mergedLearnedMap,
        unlockedBadges: mergedBadges,
        maxStreak: bestMaxStreak,
        dayStreak: bestDayStreak,
        maxDayStreak: bestMaxDayStreak,
        lastStudyDate: resolvedLastStudyDate,
        arenaWordsSolved: bestArenaSolved,
        gameStats: mergedGameStats,
        cleanWins: bestCleanWins,
        timeTracking: syncedTimeTracking,
        lastActive: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    } catch (e) {
      console.warn("Firestore sync update hatası:", e);
    }
  }

  // App UI ve State güncelle
  if (typeof window.applyUserData === 'function') {
    window.applyUserData(syncedProfile);
  }
  if (typeof window.onUserLogin === 'function') {
    window.onUserLogin(currentUser);
  }
}
window.syncUserData = syncUserData;

// E-posta ile Kayıt Ol
window.registerWithEmail = async function(email, password, name, avatar, rememberMe = true) {
  if (!auth) {
    return { success: false, error: "Firebase kimlik doğrulama servisi başlatılamadı." };
  }
  try {
    if (firebase.auth && firebase.auth.Auth && firebase.auth.Auth.Persistence) {
      const persistence = (rememberMe !== false) ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION;
      await auth.setPersistence(persistence).catch(e => console.warn("Persistence error:", e));
    }
    const trimmedName = (name || '').trim() || 'Öğrenci';
    const chosenAvatar = (avatar && avatar !== '🦊') ? avatar : ((window.state && window.state.userAvatar && window.state.userAvatar !== '🦊') ? window.state.userAvatar : (localStorage.getItem('lexiq_user_avatar') || 'avatar_default'));
    const chosenTrack = (window.state && window.state.userTrack) || localStorage.getItem('lexiq_user_track') || '4A';
    const chosenLevel = (window.state && window.state.userLevel) || localStorage.getItem('lexiq_user_level') || 'A2';
    const chosenLang = (window.state && window.state.activeLanguage) || localStorage.getItem('kelime_active_lang') || 'EN-TR';
    const localXP = parseInt(localStorage.getItem('kelime_xp') || '0', 10);

    // 1. Önce yerel verileri hazırla
    localStorage.setItem('lexiq_user_name', trimmedName);
    localStorage.setItem('lexiq_user_email', email);
    localStorage.setItem('lexiq_user_avatar', chosenAvatar);
    localStorage.setItem('lexiq_user_track', chosenTrack);
    localStorage.setItem('lexiq_user_level', chosenLevel);
    localStorage.setItem('kelime_active_lang', chosenLang);
    if (rememberMe !== false) {
      localStorage.setItem('lexiq_remember_me', 'true');
      localStorage.setItem('lexiq_remember_email', email);
    } else {
      localStorage.setItem('lexiq_remember_me', 'false');
      localStorage.removeItem('lexiq_remember_email');
    }

    if (window.state) {
      window.state.userName = trimmedName;
      window.state.userEmail = email;
      window.state.userAvatar = chosenAvatar;
      window.state.userTrack = chosenTrack;
      window.state.userLevel = chosenLevel;
      window.state.activeLanguage = chosenLang;
    }

    // 2. Firebase Auth hesabı oluştur
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // 3. Auth displayName profilini güncelle
    try {
      await user.updateProfile({ displayName: trimmedName });
    } catch (pErr) {
      console.warn("Auth profile güncelleme:", pErr);
    }

    // 4. Firestore veritabanına kullanıcı dökümanını kaydet
    if (db) {
      const s = window.state || {};
      const regTimeTracking = {
        cardSeconds: (s.timeTracking && s.timeTracking.cardSeconds) || parseInt(localStorage.getItem('lexiq_time_cards') || '0', 10),
        gameSeconds: (s.timeTracking && s.timeTracking.gameSeconds) || parseInt(localStorage.getItem('lexiq_time_games') || '0', 10),
        firstStartedAt: (s.timeTracking && s.timeTracking.firstStartedAt) || parseInt(localStorage.getItem('lexiq_first_started_at') || '0', 10) || Date.now(),
        registeredAt: Date.now(),
        unitDurations: (s.timeTracking && s.timeTracking.unitDurations) || JSON.parse(localStorage.getItem('lexiq_unit_durations') || '{}')
      };
      const regGameStats = (s.gameStats) || JSON.parse(localStorage.getItem('kelime_game_stats') || '{}');
      const regCleanWins = (s.cleanWins !== undefined) ? s.cleanWins : parseInt(localStorage.getItem('kelime_clean_wins') || '0', 10);

      await db.collection('users').doc(user.uid).set({
        displayName: trimmedName,
        email: email,
        avatar: chosenAvatar,
        track: chosenTrack,
        level: chosenLevel,
        lang: chosenLang,
        xp: localXP,
        learnedMap: (s.learnedMap) || JSON.parse(localStorage.getItem('kelime_learned_map') || '{}'),
        unlockedBadges: (s.unlockedBadges) || JSON.parse(localStorage.getItem('kelime_unlocked_badges') || '[]'),
        maxStreak: (s.maxStreak !== undefined) ? s.maxStreak : parseInt(localStorage.getItem('kelime_max_streak') || '0', 10),
        arenaWordsSolved: (s.arenaWordsSolved !== undefined) ? s.arenaWordsSolved : parseInt(localStorage.getItem('kelime_arena_solved') || '0', 10),
        gameStats: regGameStats,
        cleanWins: regCleanWins,
        timeTracking: regTimeTracking,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastActive: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    }

    const profileData = {
      uid: user.uid,
      displayName: trimmedName,
      email: email,
      avatar: chosenAvatar,
      track: chosenTrack,
      level: chosenLevel,
      lang: chosenLang,
      xp: localXP
    };

    window.cachedFbUserData = profileData;
    window.fbUser = user;

    if (typeof window.applyUserData === 'function') {
      window.applyUserData(profileData, { isRegistration: true });
    }

    return { success: true, user: user };
  } catch (error) {
    console.error("Kayıt hatası:", error);
    return { success: false, error: getAuthErrorMessage(error) };
  }
};

// E-posta ile Giriş Yap
window.loginWithEmail = async function(email, password, rememberMe = true) {
  if (!auth) {
    return { success: false, error: "Firebase kimlik doğrulama servisi başlatılamadı." };
  }
  try {
    if (firebase.auth && firebase.auth.Auth && firebase.auth.Auth.Persistence) {
      const persistence = (rememberMe !== false) ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION;
      await auth.setPersistence(persistence).catch(e => console.warn("Persistence error:", e));
    }
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    window.fbUser = user;

    if (rememberMe !== false) {
      localStorage.setItem('lexiq_remember_me', 'true');
      localStorage.setItem('lexiq_remember_email', email);
    } else {
      localStorage.setItem('lexiq_remember_me', 'false');
      localStorage.removeItem('lexiq_remember_email');
    }

    await syncUserData(user);

    return { success: true, user: user };
  } catch (error) {
    console.error("Giriş hatası:", error);
    return { success: false, error: getAuthErrorMessage(error) };
  }
};

// Çıkış Yap
window.logoutUser = async function() {
  try {
    if (auth) {
      await auth.signOut();
    }
    window.fbUser = null;
    window.cachedFbUserData = null;
    localStorage.removeItem('lexiq_user_email');
    localStorage.setItem('lexiq_remember_me', 'false');
    localStorage.removeItem('lexiq_user_onboarded');
    if (typeof window.onUserLogout === 'function') {
      window.onUserLogout();
    }
  } catch (error) {
    console.error("Çıkış hatası:", error);
  }
};

// Şifre Sıfırlama E-postası Gönder (Şifremi Unuttum)
window.resetPasswordWithEmail = async function(email) {
  if (!auth) {
    return { success: false, error: "Firebase kimlik doğrulama servisi başlatılamadı." };
  }
  if (!email || !email.includes('@')) {
    return { success: false, error: "Lütfen geçerli bir e-posta adresi giriniz." };
  }
  try {
    await auth.sendPasswordResetEmail(email.trim());
    return { success: true };
  } catch (error) {
    console.error("Şifre sıfırlama hatası:", error);
    return { success: false, error: getAuthErrorMessage(error) };
  }
};

// Şifre Değiştir (Mevcut Şifre + Yeni Şifre)
window.changeUserPassword = async function(currentPassword, newPassword) {
  if (!auth || !auth.currentUser) {
    return { success: false, error: "Oturum açmış bir kullanıcı bulunamadı." };
  }
  if (!currentPassword) {
    return { success: false, error: "Lütfen mevcut şifrenizi giriniz." };
  }
  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: "Yeni şifreniz en az 6 karakter olmalıdır." };
  }
  try {
    const user = auth.currentUser;
    const credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
    
    // 1. Mevcut şifreyi doğrula (re-authenticate)
    await user.reauthenticateWithCredential(credential);
    
    // 2. Yeni şifreyi güncelle
    await user.updatePassword(newPassword);
    return { success: true };
  } catch (error) {
    console.error("Şifre değiştirme hatası:", error);
    const code = error.code || "";
    if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
      return { success: false, error: "Mevcut şifrenizi hatalı girdiniz. Lütfen kontrol ediniz veya 'Şifremi Unuttum' seçeneğini kullanınız." };
    }
    return { success: false, error: getAuthErrorMessage(error) };
  }
};

// XP Artırma Fonksiyonu (Oyun bitimlerinde çağrılır)
window.addXPToFirebase = function(xpGained) {
  if (!window.fbUser || !db || xpGained <= 0) return;
  const curWeek = window.getCurrentWeekId ? window.getCurrentWeekId() : '2026-W42';
  const userRef = db.collection('users').doc(window.fbUser.uid);
  userRef.set({
    xp: firebase.firestore.FieldValue.increment(xpGained),
    weeklyXp: firebase.firestore.FieldValue.increment(xpGained),
    weeklyWeekId: curWeek,
    lastActive: firebase.firestore.FieldValue.serverTimestamp()
  }, { merge: true }).catch(err => {
    console.error("XP artırma hatası:", err);
  });
};

// İlerleme, Oyun İstatistikleri & Zaman Takibi Senkronizasyonu (Debounced + Immediate Desteği)
window.syncProgressToFirebase = function(customData, immediate = false) {
  if (!window.fbUser || !db) return;
  const s = window.state || {};
  
  const doSync = () => {
    const localTimeCards = parseInt(localStorage.getItem('lexiq_time_cards') || '0', 10);
    const localTimeGames = parseInt(localStorage.getItem('lexiq_time_games') || '0', 10);
    const localFirstStart = parseInt(localStorage.getItem('lexiq_first_started_at') || '0', 10);
    const localRegAt = parseInt(localStorage.getItem('lexiq_registered_at') || '0', 10);
    const localUnitDurations = JSON.parse(localStorage.getItem('lexiq_unit_durations') || '{}');
    const localGameStats = JSON.parse(localStorage.getItem('kelime_game_stats') || '{}');
    const localCleanWins = parseInt(localStorage.getItem('kelime_clean_wins') || '0', 10);

    const timeTrackingPayload = {
      cardSeconds: Math.max(s.timeTracking?.cardSeconds || 0, localTimeCards),
      gameSeconds: Math.max(s.timeTracking?.gameSeconds || 0, localTimeGames),
      firstStartedAt: (s.timeTracking?.firstStartedAt || localFirstStart || Date.now()),
      registeredAt: (s.timeTracking?.registeredAt || localRegAt || 0),
      unitDurations: Object.assign({}, localUnitDurations, (s.timeTracking?.unitDurations || {}))
    };

    const curWeek = window.getCurrentWeekId ? window.getCurrentWeekId() : '2026-W42';

    const payload = {
      displayName: s.userName || localStorage.getItem('lexiq_user_name') || 'Öğrenci',
      avatar: (s.userAvatar && s.userAvatar !== '🦊') ? s.userAvatar : (localStorage.getItem('lexiq_user_avatar') || 'avatar_default'),
      lang: s.activeLanguage || localStorage.getItem('kelime_active_lang') || 'EN-TR',
      branch: s.userBranch || localStorage.getItem('lexiq_user_branch') || '',
      branchLocked: s.branchLocked || (localStorage.getItem('lexiq_branch_locked') === 'true') || !!(s.userBranch || localStorage.getItem('lexiq_user_branch')),
      track: s.userTrack || localStorage.getItem('lexiq_user_track') || '4A',
      level: s.userLevel || localStorage.getItem('lexiq_user_level') || 'A2',
      weeklyXp: (s.weeklyXp !== undefined) ? s.weeklyXp : (parseInt(localStorage.getItem('lexiq_weekly_xp'), 10) || 0),
      weeklyWeekId: s.weeklyWeekId || localStorage.getItem('lexiq_weekly_week') || curWeek,
      learnedMap: s.learnedMap || JSON.parse(localStorage.getItem('kelime_learned_map') || '{}'),
      unlockedBadges: s.unlockedBadges || JSON.parse(localStorage.getItem('kelime_unlocked_badges') || '[]'),
      maxStreak: (s.maxStreak !== undefined) ? s.maxStreak : (parseInt(localStorage.getItem('kelime_max_streak'), 10) || 0),
      dayStreak: (s.dayStreak !== undefined) ? s.dayStreak : (parseInt(localStorage.getItem('lexiq_day_streak'), 10) || 1),
      maxDayStreak: (s.maxDayStreak !== undefined) ? s.maxDayStreak : (parseInt(localStorage.getItem('lexiq_max_day_streak'), 10) || 1),
      lastStudyDate: s.lastStudyDate || localStorage.getItem('lexiq_last_study_date') || '',
      arenaWordsSolved: (s.arenaWordsSolved !== undefined) ? s.arenaWordsSolved : (parseInt(localStorage.getItem('kelime_arena_solved'), 10) || 0),
      xp: (s.xp !== undefined) ? s.xp : (parseInt(localStorage.getItem('kelime_xp'), 10) || 0),
      gameStats: Object.assign({}, localGameStats, (s.gameStats || {})),
      cleanWins: Math.max(s.cleanWins || 0, localCleanWins),
      timeTracking: timeTrackingPayload,
      lastActive: firebase.firestore.FieldValue.serverTimestamp()
    };
    if (customData && typeof customData === 'object') {
      Object.assign(payload, customData);
    }
    db.collection('users').doc(window.fbUser.uid).set(payload, { merge: true })
      .catch(err => console.warn("İlerleme bulut yedekleme hatası:", err));
  };

  clearTimeout(window._fbSyncTimeout);
  if (immediate) {
    doSync();
  } else {
    window._fbSyncTimeout = setTimeout(doSync, 800);
  }
};

// Liderlik Tablosunu Getir
window.fetchLeaderboard = async function() {
  if (!db) return [];
  try {
    const snapshot = await db.collection('users')
                             .orderBy('xp', 'desc')
                             .limit(100)
                             .get();
    
    const leaders = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      leaders.push({
        uid: doc.id,
        displayName: data.displayName || 'İsimsiz Kahraman',
        avatar: data.avatar || '👤',
        xp: data.xp || 0,
        lang: data.lang || data.activeLanguage || 'EN-TR'
      });
    });
    return leaders;
  } catch (e) {
    console.error("Liderlik tablosu alınamadı:", e);
    return [];
  }
};

// Profil Bilgilerini Güncelle (Ayarlar veya Onboarding sonrası)
window.updateFirebaseProfile = function(name, avatar, track, level, lang) {
  if (!window.fbUser || !db) return;
  const updateData = {
    lastActive: firebase.firestore.FieldValue.serverTimestamp()
  };
  if (name) updateData.displayName = name;
  if (avatar) updateData.avatar = avatar;
  if (track) updateData.track = track;
  if (level) updateData.level = level;
  if (lang) updateData.lang = lang;

  db.collection('users').doc(window.fbUser.uid).set(updateData, { merge: true })
    .catch(err => console.error("Profil güncelleme hatası:", err));

  if (name && auth && auth.currentUser) {
    auth.currentUser.updateProfile({ displayName: name }).catch(() => {});
  }
};

// Özel Avatar Yükle (Resim dosyası)
window.uploadCustomAvatar = async function(fileBlob) {
  if (!window.fbUser) throw new Error("Oturum açmadınız.");
  if (!storage) throw new Error("Depolama servisi aktif değil.");
  
  const storageRef = storage.ref();
  const avatarRef = storageRef.child('avatars/' + window.fbUser.uid + '.jpg');
  
  const snapshot = await avatarRef.put(fileBlob);
  const downloadURL = await snapshot.ref.getDownloadURL();
  
  await db.collection('users').doc(window.fbUser.uid).set({
    avatar: downloadURL
  }, { merge: true });
  
  return downloadURL;
};

// ==========================================
// ŞUBE LİDERLİĞİ & ŞUBELER ARASI DÜELLO SİSTEMİ
// ==========================================

// 1. Sınıf İçi Liderlik Tablosunu Getir (Sadece kullanıcının kendi şubesindeki öğrenciler)
window.fetchClassLeaderboard = async function(branchCode) {
  if (!db || !branchCode) return [];
  try {
    const curWeek = window.getCurrentWeekId ? window.getCurrentWeekId() : '2026-W42';
    // branch ile eşleşen öğrencileri al (üniversite sınıfı ~20-35 öğrenci)
    const snapshot = await db.collection('users')
                             .where('branch', '==', branchCode)
                             .limit(60)
                             .get();

    const members = [];
    snapshot.forEach(doc => {
      const data = doc.data() || {};
      const weeklyWeek = data.weeklyWeekId || '';
      // Eğer haftalık ID uyuşuyorsa haftalık XP'yi, uyuşmuyorsa 0 kabul et
      const weeklyXp = (weeklyWeek === curWeek && typeof data.weeklyXp === 'number') ? data.weeklyXp : 0;
      members.push({
        uid: doc.id,
        displayName: data.displayName || 'Öğrenci',
        avatar: data.avatar || '👤',
        weeklyXp: weeklyXp,
        totalXp: data.xp || 0,
        branch: branchCode,
        track: data.track || '',
        level: data.level || ''
      });
    });

    // Haftalık puana göre azalan sırala, eşitlikte genel XP
    members.sort((a, b) => (b.weeklyXp - a.weeklyXp) || (b.totalXp - a.totalXp));
    return members;
  } catch (e) {
    console.error("Sınıf liderlik tablosu alınamadı:", e);
    return [];
  }
};

// 2. Şubeler Arası Düello & Sıralama (Aynı dildeki tüm şubelerin haftalık kapışması)
window.fetchClassDuels = async function(lang) {
  if (!db) return { branches: [], curWeek: '2026-W42', activeCount: 0 };
  try {
    const targetLang = lang || localStorage.getItem('kelime_active_lang') || 'EN-TR';
    const curWeek = window.getCurrentWeekId ? window.getCurrentWeekId() : '2026-W42';

    // Bu dildeki resmi tanımlı şubeleri al
    const officialBranches = (window.SCHOOL_BRANCHES || []).filter(b => b.lang === targetLang);

    // Dildeki aktif kullanıcıları çek
    const snapshot = await db.collection('users')
                             .where('lang', '==', targetLang)
                             .limit(400)
                             .get();

    // Şube bazında toplam haftalık XP ve öğrenci sayılarını hesapla
    const branchStats = {};
    officialBranches.forEach(b => {
      branchStats[b.code] = {
        code: b.code,
        name: b.name,
        track: b.track,
        level: b.level,
        trackName: b.trackName,
        studentCount: 0,
        totalWeeklyXp: 0,
        totalCumulativeXp: 0,
        topStudent: null
      };
    });

    snapshot.forEach(doc => {
      const data = doc.data() || {};
      const bCode = data.branch;
      if (bCode && branchStats[bCode]) {
        const weeklyWeek = data.weeklyWeekId || '';
        const userWeeklyXp = (weeklyWeek === curWeek && typeof data.weeklyXp === 'number') ? data.weeklyXp : 0;
        
        branchStats[bCode].studentCount += 1;
        branchStats[bCode].totalWeeklyXp += userWeeklyXp;
        branchStats[bCode].totalCumulativeXp += (data.xp || 0);

        if (!branchStats[bCode].topStudent || userWeeklyXp > branchStats[bCode].topStudent.weeklyXp) {
          branchStats[bCode].topStudent = {
            displayName: data.displayName || 'Öğrenci',
            avatar: data.avatar || '👤',
            weeklyXp: userWeeklyXp
          };
        }
      }
    });

    // Ortalama puanı (Adil Düello Metriği) ve başarı oranını hesapla
    const branchList = Object.values(branchStats).map(b => {
      const avgWeeklyXp = b.studentCount > 0 ? Math.round(b.totalWeeklyXp / b.studentCount) : 0;
      return {
        ...b,
        avgWeeklyXp: avgWeeklyXp
      };
    });

    // Ortalama haftalık puana göre sırala (Öğrenci sayısı az/çok olan şubeler adil yarışır)
    branchList.sort((a, b) => (b.avgWeeklyXp - a.avgWeeklyXp) || (b.totalWeeklyXp - a.totalWeeklyXp));

    return {
      curWeek: curWeek,
      branches: branchList,
      totalBranches: branchList.length
    };
  } catch (e) {
    console.error("Şubeler arası düello tablosu alınamadı:", e);
    return { branches: [], curWeek: '2026-W42', totalBranches: 0 };
  }
};

// 3. Kullanıcının Şubesini Belirle ve Kilitle (Tek Seferlik Seçim)
window.updateUserBranch = async function(branchCode) {
  if (!branchCode) return false;
  try {
    const curWeek = window.getCurrentWeekId ? window.getCurrentWeekId() : '2026-W42';
    localStorage.setItem('lexiq_user_branch', branchCode);
    localStorage.setItem('lexiq_branch_locked', 'true');

    if (window.appState) {
      window.appState.userBranch = branchCode;
      window.appState.branchLocked = true;
    }

    if (window.fbUser && db) {
      await db.collection('users').doc(window.fbUser.uid).set({
        branch: branchCode,
        branchLocked: true,
        lastActive: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    }
    return true;
  } catch (e) {
    console.warn("Şube güncellenemedi:", e);
    return false;
  }
};

// 4. Şeref Kürsüsü ve Yıl Sonu Şampiyonluk Arşivi
window.fetchHonorRollArchive = async function(lang) {
  if (!db) return [];
  try {
    const targetLang = lang || localStorage.getItem('kelime_active_lang') || 'EN-TR';
    const officialBranches = (window.SCHOOL_BRANCHES || []).filter(b => b.lang === targetLang);
    
    // Firestore'da 'tournament_archive' koleksiyonundan haftalık şampiyonları çek
    const snapshot = await db.collection('tournament_archive')
                             .where('lang', '==', targetLang)
                             .limit(60)
                             .get();

    // Şubeler bazında lig puanı ve kazanılan madalya sayısını hesapla
    // 1.lik = 10 Puan, 2.lik = 6 Puan, 3.lük = 4 Puan
    const honorMap = {};
    officialBranches.forEach(b => {
      honorMap[b.code] = {
        code: b.code,
        name: b.name,
        trackName: b.trackName,
        leaguePoints: 0,
        goldCount: 0,
        silverCount: 0,
        bronzeCount: 0,
        weeklyTitles: []
      };
    });

    snapshot.forEach(doc => {
      const data = doc.data() || {};
      const weekId = data.weekId || '';
      
      // 1. Şube (Altın Madalya - 10 Lig Puanı)
      if (data.firstBranch && honorMap[data.firstBranch]) {
        honorMap[data.firstBranch].leaguePoints += 10;
        honorMap[data.firstBranch].goldCount += 1;
        honorMap[data.firstBranch].weeklyTitles.push({ week: weekId, rank: 1, avgXp: data.firstAvg || 0 });
      }
      // 2. Şube (Gümüş Madalya - 6 Lig Puanı)
      if (data.secondBranch && honorMap[data.secondBranch]) {
        honorMap[data.secondBranch].leaguePoints += 6;
        honorMap[data.secondBranch].silverCount += 1;
        honorMap[data.secondBranch].weeklyTitles.push({ week: weekId, rank: 2, avgXp: data.secondAvg || 0 });
      }
      // 3. Şube (Bronz Madalya - 4 Lig Puanı)
      if (data.thirdBranch && honorMap[data.thirdBranch]) {
        honorMap[data.thirdBranch].leaguePoints += 4;
        honorMap[data.thirdBranch].bronzeCount += 1;
        honorMap[data.thirdBranch].weeklyTitles.push({ week: weekId, rank: 3, avgXp: data.thirdAvg || 0 });
      }
    });

    // Lig puanına göre azalan sırala
    const sortedHonor = Object.values(honorMap).sort((a, b) => {
      return (b.leaguePoints - a.leaguePoints) || (b.goldCount - a.goldCount) || (b.silverCount - a.silverCount);
    });

    return sortedHonor;
  } catch (e) {
    console.error("Şeref kürsüsü verisi alınamadı:", e);
    return [];
  }
};

// 4.1 Haftalık Arşiv Listesini Çekme (Hafta hafta şampiyonlar dökümü)
window.fetchPodiumWeeklyArchive = async function(lang) {
  if (!db) return [];
  try {
    const targetLang = lang || localStorage.getItem('kelime_active_lang') || 'EN-TR';
    const snapshot = await db.collection('tournament_archive')
                             .where('lang', '==', targetLang)
                             .limit(50)
                             .get();

    const archives = [];
    snapshot.forEach(doc => {
      const data = doc.data() || {};
      archives.push({
        id: doc.id,
        weekId: data.weekId || '',
        lang: data.lang || targetLang,
        firstBranch: data.firstBranch || '',
        firstAvg: data.firstAvg || 0,
        secondBranch: data.secondBranch || '',
        secondAvg: data.secondAvg || 0,
        thirdBranch: data.thirdBranch || '',
        thirdAvg: data.thirdAvg || 0,
        timestamp: data.timestamp ? (data.timestamp.toDate ? data.timestamp.toDate() : new Date(data.timestamp)) : new Date()
      });
    });

    archives.sort((a, b) => b.timestamp - a.timestamp);
    return archives;
  } catch (e) {
    console.warn("Haftalık podyum arşivi alınamadı:", e);
    return [];
  }
};

// 4.2 Aylık Şampiyonlar Listesini Hesaplama & Çekme
window.fetchPodiumMonthlyArchive = async function(lang) {
  try {
    const targetLang = lang || localStorage.getItem('kelime_active_lang') || 'EN-TR';
    let weeklyArchives = [];
    if (typeof window.fetchPodiumWeeklyArchive === 'function') {
      weeklyArchives = await window.fetchPodiumWeeklyArchive(targetLang);
    }

    const curDate = new Date();
    const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    const curMonthKey = `${curDate.getFullYear()}-${String(curDate.getMonth() + 1).padStart(2, '0')}`;
    const curMonthLabel = `${monthNames[curDate.getMonth()]} ${curDate.getFullYear()}`;

    // Eğer haftalık arşiv henüz Firestore'da yoksa veya boşsa, geçerli düellolardan ay tablosunu dinamik oluştur
    if (!weeklyArchives || weeklyArchives.length === 0) {
      let duelBranches = [];
      if (typeof window.fetchClassDuels === 'function') {
        const duelData = await window.fetchClassDuels(targetLang);
        if (duelData && duelData.branches && duelData.branches.length > 0) {
          duelBranches = duelData.branches;
        }
      }

      if (duelBranches.length === 0) {
        duelBranches = (window.SCHOOL_BRANCHES || []).filter(b => b.lang === targetLang);
      }

      const sortedBranches = duelBranches.map((b, idx) => {
        const pts = Math.max(4, Math.round((duelBranches.length - idx) * 3.5));
        const avg = b.avgWeeklyXp || Math.max(450, 1450 - (idx * 85));
        return {
          code: b.code,
          name: b.name || b.trackName || '',
          trackName: b.trackName || b.name || '',
          points: pts,
          totalAvg: avg
        };
      }).sort((a, b) => (b.points - a.points) || (b.totalAvg - a.totalAvg));

      return [{
        monthKey: curMonthKey,
        monthLabel: curMonthLabel,
        weeksCount: 4,
        firstBranch: sortedBranches[0]?.code || '',
        firstPoints: sortedBranches[0]?.points || 36,
        firstAvg: sortedBranches[0]?.totalAvg || 1450,
        secondBranch: sortedBranches[1]?.code || '',
        secondPoints: sortedBranches[1]?.points || 24,
        secondAvg: sortedBranches[1]?.totalAvg || 1200,
        thirdBranch: sortedBranches[2]?.code || '',
        thirdPoints: sortedBranches[2]?.points || 16,
        thirdAvg: sortedBranches[2]?.totalAvg || 950,
        topBranches: sortedBranches
      }];
    }

    // Haftaları aylara göre grupla (Örn: "2026-10" / "Ekim 2026")
    const monthMap = {};

    weeklyArchives.forEach(w => {
      const d = w.timestamp instanceof Date ? w.timestamp : new Date();
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;

      if (!monthMap[monthKey]) {
        monthMap[monthKey] = {
          monthKey: monthKey,
          monthLabel: monthLabel,
          branchPoints: {},
          branchAvgSums: {},
          weeksCount: 0
        };
      }

      monthMap[monthKey].weeksCount += 1;

      // 1. Şubeye 10 puan
      if (w.firstBranch) {
        monthMap[monthKey].branchPoints[w.firstBranch] = (monthMap[monthKey].branchPoints[w.firstBranch] || 0) + 10;
        monthMap[monthKey].branchAvgSums[w.firstBranch] = (monthMap[monthKey].branchAvgSums[w.firstBranch] || 0) + (w.firstAvg || 0);
      }
      // 2. Şubeye 6 puan
      if (w.secondBranch) {
        monthMap[monthKey].branchPoints[w.secondBranch] = (monthMap[monthKey].branchPoints[w.secondBranch] || 0) + 6;
        monthMap[monthKey].branchAvgSums[w.secondBranch] = (monthMap[monthKey].branchAvgSums[w.secondBranch] || 0) + (w.secondAvg || 0);
      }
      // 3. Şubeye 4 puan
      if (w.thirdBranch) {
        monthMap[monthKey].branchPoints[w.thirdBranch] = (monthMap[monthKey].branchPoints[w.thirdBranch] || 0) + 4;
        monthMap[monthKey].branchAvgSums[w.thirdBranch] = (monthMap[monthKey].branchAvgSums[w.thirdBranch] || 0) + (w.thirdAvg || 0);
      }
    });

    // Her ay için sıralama yap ve ilk 3'ü belirle
    const monthlyResults = Object.values(monthMap).map(m => {
      const sortedBranches = Object.keys(m.branchPoints).map(code => ({
        code: code,
        points: m.branchPoints[code],
        totalAvg: m.branchAvgSums[code] || 0
      })).sort((a, b) => (b.points - a.points) || (b.totalAvg - a.totalAvg));

      return {
        monthKey: m.monthKey,
        monthLabel: m.monthLabel,
        weeksCount: m.weeksCount,
        firstBranch: sortedBranches[0]?.code || '',
        firstPoints: sortedBranches[0]?.points || 0,
        secondBranch: sortedBranches[1]?.code || '',
        secondPoints: sortedBranches[1]?.points || 0,
        thirdBranch: sortedBranches[2]?.code || '',
        thirdPoints: sortedBranches[2]?.points || 0,
        topBranches: sortedBranches
      };
    }).sort((a, b) => b.monthKey.localeCompare(a.monthKey));

    return monthlyResults;
  } catch (e) {
    console.warn("Aylık podyum arşivi hesaplanamadı:", e);
    return [];
  }
};

// 5. Otomatik / Manuel Hafta Kapanışı Arşivleme (Gerektiğinde haftalık dereceyi kaydetmek için)
window.recordWeeklyChampionArchive = async function(weekId, lang, firstBranch, firstAvg, secondBranch, secondAvg, thirdBranch, thirdAvg) {
  if (!db || !weekId || !firstBranch) return false;
  try {
    const docId = `${weekId}_${lang || 'EN-TR'}`;
    await db.collection('tournament_archive').doc(docId).set({
      weekId: weekId,
      lang: lang || 'EN-TR',
      firstBranch: firstBranch,
      firstAvg: firstAvg || 0,
      secondBranch: secondBranch || null,
      secondAvg: secondAvg || 0,
      thirdBranch: thirdBranch || null,
      thirdAvg: thirdAvg || 0,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    return true;
  } catch (e) {
    console.warn("Haftalık şampiyonluk arşivlenemedi:", e);
    return false;
  }
};

// 6. Fabrika Ayarlarına Dönüş: Kullanıcı Hesabını ve Bulut Verilerini Tamamen Silme
window.deleteAccountCompletely = async function() {
  if (!auth) return { success: true };
  const user = auth.currentUser;
  if (!user) return { success: true };

  const uid = user.uid;

  // 1. Firestore'daki kullanıcı kaydını sil
  try {
    if (db) {
      await db.collection('users').doc(uid).delete();
      console.log('Firestore user record deleted:', uid);
    }
  } catch (errDb) {
    console.warn('Firestore doc delete warning:', errDb);
  }

  // 2. Firebase Auth hesabını sil
  try {
    await user.delete();
    console.log('Firebase Auth account deleted permanently');
  } catch (errAuth) {
    console.warn('Firebase Auth delete warning:', errAuth);
    try {
      await auth.signOut();
    } catch (ignored) {}
  }

  fbUser = null;
  return { success: true };
};


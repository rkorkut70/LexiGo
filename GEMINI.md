# LexiQ Proje Kuralları ve Geliştirme Standartları

Bu proje için geçerli olan ve her oturumda uyulması zorunlu kurallar aşağıda listelenmiştir:

## 1. Dil ve Giriş Yönetimi
- Uygulama EN-TR, FR-TR ve DE-TR dillerini destekler.
- Açılışta zorunlu bir dil çifti seçim ekranı gelmelidir.

## 2. Platform ve Altyapı
- Sadece standart HTML5, CSS3 ve Vanilla JS kullanılmalıdır. Harici kütüphane/framework yasaktır.
- Mobil (iOS Safari / Android Chrome) öncelikli responsive tasarım uygulanmalıdır.

## 3. Veri Yönetimi & Excel Yapısı
- Kelimeler üniteler halinde `words_data.js` içinde JSON formatında tutulmalıdır.
- Her kelime nesnesi; `id`, `dil`, `kelime`, `anlamı`, `örnek_cumle`, `cumle_ceviri`, `unite_no` ve `ogrenilme_durumu` (0: Bekleyen, 1: Öğrenilen) alanlarını içermelidir.

## 4. İlerleme ve Müfredat Kuralı
- Kullanıcı geçmiş ünitelere manuel olarak geri dönebilmelidir ama sonraki üniteye geçmek için mevcut ünite kelimelerinin en az %75'ini öğrenmelidir.

## 5. Öğrenme ve Oyun Modülü
- Günlük kelime kotası için Anagram, Boşluk Doldurma, Tetris/Eşleştirme, Dinleme vb. oyun modları yer almalıdır.

## 6. Aralıklı Tekrar (SRS) & Raporlama
- Başarılı olunan kelimeler localStorage üzerinden Aralıklı Tekrar algoritmasına göre yönetilir.
- Günlük hedef tamamlandığında kullanıcı kutlama ekranı ve pratik etkinliklerine yönlendirilir.

## 7. APK / AAB Çıktı Konumu Kuralı
- Tüm derlenen APK ve AAB dosyaları HER ZAMAN yalnızca `C:\anti-gravity\kelime-apk\output_apk` dizinine kopyalanmalıdır.

## 8. Yedekleme Kuralı
- Kelime projesiyle ilgili tüm ZIP ve arşiv yedekleri HER ZAMAN yalnızca `C:\anti-gravity\yedekler\kelime` dizinine kaydedilmelidir.

## 9. Dizin Düzeni Kuralı
- Ana kod: `C:\anti-gravity\kelime`
- Web Dağıtımı: `C:\anti-gravity\lexiq-web`
- Android Projesi: `C:\anti-gravity\kelime-apk`
- Admin Paneli: `C:\anti-gravity\lexiq-admin`
- Yedekler: `C:\anti-gravity\yedekler\kelime`

## 10. Sürüm ve Build Numarası Otomatik Artırım Kuralı (ZORUNLU)
- **Her APK/AAB derlemesinde veya yeni sürüm çıkışında:**
  1. `versionCode` (build numarası) en az 1 artırılmalıdır.
  2. `versionName` (sürüm numarası, örn: 1.5.1 -> 1.5.2) artırılmalıdır.
  3. `app.js` içerisindeki `APP_VERSION = 'v{versionName}'` güncellenmelidir.
  4. `index.html` içerisindeki sürüm rozetleri (`.welcome-version-pill`, `#aboutAppVersion`, `#appUpdateVersionText`) ve `?v={versionName}` önbellek sorgu dizgileri güncellenmelidir.
  5. Çıktı dosyaları `LexiGo_v{versionName}_b{versionCode}.apk` ve `LexiGo_v{versionName}_b{versionCode}.aab` olarak adlandırılmalı, ayrıca `LexiGo_Latest.apk` ve `LexiGo_Latest.aab` dosyaları güncellenmelidir (eski `LexiQ_` adlı dosyalar kesinlikle üretilmemelidir).
  6. Değişiklikler eşzamanlı olarak `lexiq-web` ve `kelime-apk\app\src\main\assets\` dizinlerine kopyalanmalıdır.

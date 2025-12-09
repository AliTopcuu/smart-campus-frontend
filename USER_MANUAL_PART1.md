# Kullanıcı Kılavuzu (Part 1)

SmartCampus uygulamasının kullanım kılavuzu.

## 🎨 Tema ve Arayüz

### Dark Mode
- Uygulama varsayılan olarak **light mode** ile açılır
- Dashboard header'ında sağ üstte bulunan **tema değiştirme butonu** ile dark/light mode arasında geçiş yapabilirsiniz
- Tema tercihiniz otomatik olarak kaydedilir ve bir sonraki girişte korunur
- Dark mode'da giriş sayfası temasına uygun koyu renkler kullanılır

## 📝 Kayıt Olma

1. Ana sayfadan **"Kayıt Ol"** linkine tıklayın veya `/register` sayfasına gidin
2. Aşağıdaki bilgileri doldurun:
   - **Ad Soyad:** Tam adınız
   - **E-posta:** Geçerli bir email adresi
   - **Şifre:** En az 8 karakter, büyük/küçük harf, rakam içermeli
   - **Şifre Tekrar:** Şifrenizi tekrar girin
   - **Kullanıcı Tipi:** Öğrenci veya Akademisyen seçin
   - **Bölüm:** Bölümünüzü seçin
   - **Öğrenci Numarası:** (Sadece öğrenciler için) Öğrenci numaranızı girin
   - **Kullanım Şartları:** Kullanım şartlarını kabul ettiğinizi işaretleyin
3. **"Hesap Oluştur"** butonuna tıklayın
4. Kayıt sonrası email adresinize doğrulama linki gönderilir
5. Email'deki linke tıklayarak hesabınızı aktifleştirin

**Not:** SMTP yapılandırılmamışsa, doğrulama linki backend konsolunda görüntülenir.

## 🔐 Giriş Yapma

1. `/login` sayfasına gidin
2. **E-posta** ve **Şifre** bilgilerinizi girin
3. (Opsiyonel) **"Beni Hatırla"** seçeneğini işaretleyin:
   - İşaretlenirse: Token'lar tarayıcı kapatılsa bile saklanır (localStorage)
   - İşaretlenmezse: Token'lar sadece oturum boyunca saklanır (sessionStorage)
4. **"Giriş Yap"** butonuna tıklayın
5. Başarılı giriş sonrası dashboard'a yönlendirilirsiniz

**Token Süreleri:**
- Access Token: 15 dakika
- Refresh Token: 7 gün
- "Beni Hatırla" sadece token saklama yöntemini etkiler, token süreleri değişmez

## 👤 Profil Yönetimi

### Profil Bilgilerini Güncelleme

1. Dashboard'dan **"Profil"** menüsüne gidin (`/profile`)
2. **Ad Soyad** ve **Telefon** bilgilerinizi güncelleyin
3. **"Kaydet"** butonuna tıklayın

### Şifre Değiştirme

1. Profil sayfasında **"Şifre Değiştir"** bölümüne gidin
2. **Mevcut Şifre** ve **Yeni Şifre** bilgilerinizi girin
3. **"Şifreyi Güncelle"** butonuna tıklayın

### Profil Fotoğrafı Yükleme

1. Profil sayfasında **"Profil Fotoğrafı"** bölümüne gidin
2. **"Fotoğraf Seç"** butonuna tıklayın
3. JPG veya PNG formatında, maksimum 5MB boyutunda bir dosya seçin
4. Fotoğraf otomatik olarak yüklenir ve görüntülenir

## 🔑 Şifre Sıfırlama

### Şifremi Unuttum

1. Giriş sayfasında **"Şifremi Unuttum"** linkine tıklayın veya `/forgot-password` sayfasına gidin
2. Kayıtlı **e-posta** adresinizi girin
3. **"Şifre Sıfırlama Linki Gönder"** butonuna tıklayın
4. Email adresinize şifre sıfırlama linki gönderilir
5. Email'deki linke tıklayın (24 saat içinde geçerlidir)
6. `/reset-password` sayfasında **yeni şifrenizi** belirleyin
7. Şifre güncellendikten sonra otomatik olarak giriş sayfasına yönlendirilirsiniz

**Not:** SMTP yapılandırılmamışsa, reset linki backend konsolunda görüntülenir.

## 📱 Sayfalar ve Özellikler

### Dashboard
- Ana sayfa, genel bakış ve hızlı erişim menüleri
- Kullanıcı bilgileri ve rol bazlı içerik

### Profil
- Kişisel bilgileri görüntüleme ve güncelleme
- Şifre değiştirme
- Profil fotoğrafı yükleme

### Dersler
- Tüm dersleri görüntüleme
- Ders detaylarına erişim

### Derslerim (Öğrenciler için)
- Kayıtlı olduğunuz dersleri görüntüleme

### Notlarım (Öğrenciler için)
- Ders notlarınızı görüntüleme

### Not Defteri (Akademisyenler için)
- Ders notlarını yönetme ve güncelleme

### Yoklama Başlat (Akademisyenler için)
- Ders için yoklama oturumu başlatma

### Yoklama Durumum (Öğrenciler için)
- Kendi yoklama durumunuzu görüntüleme

### Yoklama Raporları (Akademisyenler için)
- Ders yoklama raporlarını görüntüleme

### Mazeret Talepleri
- Mazeret talepleri oluşturma ve yönetme

## 🔒 Güvenlik İpuçları

1. **Güçlü Şifre:** En az 8 karakter, büyük/küçük harf, rakam içeren şifreler kullanın
2. **Güvenli Çıkış:** Ortak bilgisayarlarda kullanımdan sonra mutlaka çıkış yapın
3. **Email Doğrulama:** Hesabınızı aktifleştirmek için email doğrulamasını tamamlayın
4. **Token Güvenliği:** Token'larınızı paylaşmayın, süresi dolduğunda otomatik yenilenir

## ❓ Sık Sorulan Sorular

### Email doğrulama linki gelmedi
- Spam klasörünü kontrol edin
- SMTP yapılandırılmamışsa, backend konsolunda link görüntülenir

### Şifremi unuttum
- `/forgot-password` sayfasından yeni şifre sıfırlama linki talep edin

### Token süresi doldu
- Otomatik olarak yenilenir, gerekirse tekrar giriş yapın

### Profil fotoğrafı yüklenmiyor
- Dosya formatını (JPG/PNG) ve boyutunu (max 5MB) kontrol edin

## 🆘 Destek

Teknik sorunlar için backend ve frontend loglarını kontrol edin veya proje yöneticisi ile iletişime geçin.


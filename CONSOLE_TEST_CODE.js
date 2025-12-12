// Bu kodu tarayıcı console'una (F12) yapıştırın ve Enter'a basın

// 1. Mock authentication data oluştur
const userData = {
  id: '1',
  email: 'student@test.com',
  role: 'student',
  name: 'Test Student',
  studentNumber: '20201234'
};

// 2. localStorage'a kaydet (doğru key formatı ile)
localStorage.setItem('smartcampus.auth:access', 'mock-access-token');
localStorage.setItem('smartcampus.auth:refresh', 'mock-refresh-token');
localStorage.setItem('smartcampus.auth:user', JSON.stringify(userData));
localStorage.setItem('smartcampus.auth:rememberMe', 'true');

// 3. Sayfayı yenile
console.log('Auth data eklendi. Sayfa yenileniyor...');
window.location.reload();

// Sayfa yüklendikten sonra şu adresi ziyaret edin:
// http://localhost:5173/attendance/give/test-session-123


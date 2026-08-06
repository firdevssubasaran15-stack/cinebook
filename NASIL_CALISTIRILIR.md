# 🎬 CineBook — Nasıl Çalıştırılır?

Bu kılavuz, CineBook projesini yerel ortamınızda çalıştırmanız için gereken tüm adımları içerir.

---

## 📋 Gereksinimler

| Araç | Minimum Sürüm | Kontrol |
|---|---|---|
| **Node.js** | v20+ | `node --version` |
| **npm** | v10+ | `npm --version` |
| **Expo Go** | SDK 54 | [App Store](https://apps.apple.com/app/expo-go/id982107779) / [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) |
| **Expo CLI** | En güncel | `npm install -g expo-cli` |

---

## 🖥️ Backend Kurulumu

**Terminal 1 — Backend:**

```bash
# 1. Backend klasörüne geç
cd backend

# 2. Bağımlılıkları yükle
npm install

# 3. Admin kullanıcısını ve demo içerikleri oluştur (ilk çalıştırmada zorunlu)
npm run seed

# 4. Sunucuyu başlat
npm start
```

✅ Başarılıysa şunu görürsünüz:
```
✅ Veritabanı başlatıldı.
🚀 CineBook API sunucusu başlatıldı
   → Local:   http://localhost:3000
   → Health:  http://localhost:3000/api/health
```

**Admin giriş bilgileri:**
- Kullanıcı Adı: `admin`
- Şifre: `catlover`

---

## 📱 Frontend Kurulumu

**Terminal 2 — Frontend:**

```bash
# 1. Frontend klasörüne geç
cd frontend

# 2. Bağımlılıkları yükle
npm install

# 3. Uygulamayı başlat
npx expo start -c
REACT_NATIVE_PACKAGER_HOSTNAME=192.168.1.163 npx expo start --lan -c


```

> **⚠️ ÖNEMLİ — Mobil Cihazda Test:**
> Expo Go uygulaması, `localhost` adresine erişemez.
> `frontend/src/constants/api.js` dosyasındaki `API_BASE_URL` değerini
> bilgisayarınızın yerel ağ IP adresiyle güncellemeniz gerekir.
REACT_NATIVE_PACKAGER_HOSTNAME=192.168.1.163 npx expo start -c
```js
// frontend/src/constants/api.js — Bu satırı düzenleyin:
export const API_BASE_URL = 'http://192.168.1.XXX:3000';
//                                   ^^^^^^^^^^^^^^^^^
//                          Kendi IP adresinizi yazın
```

**IP Adresinizi Bulmak:**
- **Windows:** Komut İstemi'nde `ipconfig` → "IPv4 Address" satırı
- **Mac/Linux:** Terminalde `ifconfig` veya `ip addr`

**IP Atayarak Başlatmak (Alternatif):**
```bash
REACT_NATIVE_PACKAGER_HOSTNAME=192.168.1.XXX npx expo start -c
```

---

## 🔧 Sık Karşılaşılan Sorunlar

### ❌ Network Error / API'ye Bağlanamıyor

**Sebep:** `API_BASE_URL` yanlış IP adresi.

**Çözüm:**
1. `frontend/src/constants/api.js` dosyasını aç
2. `API_BASE_URL`'i kendi IP adresinle güncelle
3. Uygulamayı `npx expo start -c` ile yeniden başlat

---

### ❌ Port Zaten Kullanımda (EADDRINUSE)

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Çözüm:**
```bash
# Windows — Port 3000'i kullanan süreci bul ve kapat
netstat -ano | findstr :3000
taskkill /PID <PID_NUMARASI> /F

# Veya farklı bir port kullan:
# backend/.env dosyasında PORT=3001 yap
```

---

### ❌ better-sqlite3 / native module hatası

Bu proje `sql.js` (WASM tabanlı, Python gerektirmez) kullanır.
Eğer başka bir native modül hatası alırsanız:

```bash
cd backend
npm install --force
```

---

### ❌ Expo CLI bulunamıyor

```bash
npm install -g @expo/cli
npx expo start -c
```

---

### ❌ Metro bundler cache sorunu

```bash
npx expo start -c
# -c bayrağı cache'i temizler
```

---

## 🗂️ Proje Yapısı

```
MainProject/
├── NASIL_CALISTIRILIR.md     ← Bu dosya
├── backend/                  ← Node.js + Express API
│   ├── src/
│   │   ├── app.js            ← Sunucu giriş noktası
│   │   ├── database/         ← SQLite (sql.js)
│   │   └── features/         ← auth, content, comments, feelings, admin
│   └── uploads/              ← Kapak resimleri
└── frontend/                 ← Expo SDK 54 + React 19
    ├── app/                  ← Expo Router ekranları
    │   ├── (auth)/           ← Login, Register
    │   ├── (tabs)/           ← Ana tablar
    │   └── detail/[id].js    ← Detay ekranı
    └── src/
        ├── api/              ← Axios istemcisi
        ├── components/       ← Paylaşılan komponentler
        ├── constants/        ← Renkler, API URL, duygular
        └── context/          ← AuthContext
```

---

## 🌐 API Endpoint Listesi

| Method | Endpoint | Açıklama | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Kayıt | - |
| POST | `/api/auth/login` | Giriş | - |
| GET | `/api/content/latest` | Ana sayfa verisi | ✅ |
| GET | `/api/content/type/:type` | Film/Dizi/Kitap listesi | ✅ |
| GET | `/api/content/:id` | İçerik detayı | ✅ |
| POST | `/api/content` | İçerik ekle | ✅ Admin |
| GET | `/api/comments/:contentId` | Yorumlar | ✅ |
| POST | `/api/comments/:contentId` | Yorum ekle | ✅ |
| GET | `/api/feelings/:contentId` | Hissettirdikleri | ✅ |
| POST | `/api/feelings/:contentId` | Hissettirilen ekle | ✅ |
| GET | `/api/feelings/search?tag=nostalji` | Etiket arama | ✅ |
| GET | `/api/admin/users/search?username=x` | Kullanıcı arama | ✅ Admin |
| PUT | `/api/admin/users/:id/privileges` | Yetki güncelle | ✅ Admin |
| GET | `/api/health` | Sunucu durumu | - |

---

## 🎭 Duygu Etiketleri

`nostalji` • `huzur` • `özlem` • `heyecan` • `yalnızlık` • `umut`

---

*CineBook v1.0.0 — Film, Dizi & Kitap Sosyal Platformu*

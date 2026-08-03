# CineBook 🎬📚

**CineBook**, film, dizi ve kitap severleri bir araya getiren modern ve dinamik bir sosyal platformdur. Kullanıcılar içerikleri keşfedebilir, puanlayıp yorum yapabilir ve duygularına (Emotions) göre içerik filtreleyebilirler.

## Özellikler (Features)
- 🌓 **Dinamik Koyu/Açık Tema**: Kullanıcı tercihine veya işletim sistemine göre anında değişebilen %100 senkronize arayüz.
- 📱 **Responsive Tasarım**: NativeWind v4 ile güçlendirilmiş, her boyutta ekrana (iOS/Android) kusursuz oturan Solid prensipli komponentler.
- 🔑 **Güvenli Kimlik Doğrulama**: Feature-based ayrıştırılmış sağlam bir Auth mekanizması. Şifre kuralları kontrolü ve Beni Hatırla özelliği.
- 🎭 **Duygu (Emotion) Keşfi**: O anki ruh halinize göre kitap, film veya dizi önerileri.
- 💬 **Sosyal Etkileşim**: Paylaşımlara (Feed) yorum yapma ve içerikleri ortak listelere (Shared Lists) kaydetme yeteneği.
- 🏗️ **Solid Prensipleri & Agile**: Tamamen Single Responsibility Principle'a (SRP) uygun, iş mantığı ile (Custom Hooks) arayüzün (UI Components) birbirinden ayrıştırıldığı sürdürülebilir kurumsal mimari.

## Teknolojiler (Tech Stack)
### Frontend
- **React Native (Expo)** - Evrensel (Universal) mobil uygulama geliştirme.
- **Expo Router** - Klasör tabanlı ve pürüzsüz yönlendirme (routing).
- **NativeWind v4** - React Native için özel TailwindCSS entegrasyonu. (Media Query ve Appearance üzerinden global styling)

### Backend
- **Node.js & Express** - Hızlı ve güvenilir servis altyapısı.
- **RESTful API** - Ayrıştırılmış denetleyiciler (Controllers) ve servislerle modüler uç noktalar.

## Kurulum ve Çalıştırma (Getting Started)

1. Projeyi klonlayın:
   ```bash
   git clone https://github.com/firdevssubasaran15-stack/cinebook.git
   cd cinebook
   ```

2. Gerekli kütüphaneleri yükleyin:
   ```bash
   # Backend için
   cd backend
   npm install

   # Frontend için
   cd ../frontend
   npm install
   ```

3. Geliştirme sunucularını başlatın:
   ```bash
   # Backend servisini başlatın
   cd backend
   npm start

   # Yeni bir terminalde Frontend'i başlatın
   cd frontend
   npx expo start -c
   ```

## Lisans
Bu proje **MIT Lisansı** ile lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına bakabilirsiniz.

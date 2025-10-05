# Öğrenci Yönetim Sistemi

Bu proje, Angular kullanılarak geliştirilmiş bir öğrenci yönetim sistemidir. API'den öğrenci verilerini çeker ve kullanıcı dostu bir arayüzde gösterir.

## Özellikler

- 📋 Öğrenci listesini tablo halinde görüntüleme
- 🔍 Öğrenci ID'sine göre arama yapma
- 📱 Responsive tasarım (mobil uyumlu)
- 🎨 Modern ve kullanıcı dostu arayüz
- ⚡ Hızlı ve etkili veri yükleme

## API Endpoint

Proje şu API endpoint'ini kullanır:
```
https://localhost:5001/api/student/getStudents
```

## Kurulum

1. Projeyi klonlayın veya indirin
2. Terminal'de proje klasörüne gidin:
   ```bash
   cd student-app
   ```

3. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

4. Uygulamayı çalıştırın:
   ```bash
   npm start
   ```

5. Tarayıcınızda `http://localhost:4200` adresine gidin

## Kullanım

- Ana sayfada tüm öğrenciler tablo halinde listelenir
- Arama kutusuna öğrenci ID'si girerek filtreleme yapabilirsiniz
- "Ara" butonuna tıklayarak arama yapın
- "Temizle" butonu ile aramayı sıfırlayın

## Teknolojiler

- Angular 17
- TypeScript
- HTML5
- CSS3
- RxJS
- HttpClient

## Proje Yapısı

```
src/
├── app/
│   ├── components/
│   │   ├── student-list.component.ts
│   │   ├── student-list.component.html
│   │   └── student-list.component.css
│   ├── models/
│   │   └── student.model.ts
│   ├── services/
│   │   └── student.service.ts
│   ├── app.component.ts
│   ├── app.component.html
│   ├── app.component.css
│   └── app.module.ts
├── index.html
├── main.ts
└── styles.css
```

## Geliştirme

Projeyi geliştirme modunda çalıştırmak için:
```bash
npm run start
```

Build almak için:
```bash
npm run build
```

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.



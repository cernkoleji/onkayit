# CERN Koleji Ön Kayıt Sitesi

Bu paket GitHub Pages, Netlify veya standart bir web sunucusuna doğrudan yüklenebilir.

## Dosyalar
- `index.html`: Sayfa yapısı ve metinler
- `styles.css`: Tasarım, responsive yapı ve animasyonlar
- `script.js`: Slider, scroll efektleri, burs hesaplama, SSS ve form davranışları
- `assets/`: Logo ve okul görselleri

## Yayına alma
1. Klasördeki tüm dosyaları GitHub reposunun kök dizinine yükleyin.
2. GitHub > Settings > Pages bölümünde `Deploy from a branch` seçin.
3. Branch: `main`, Folder: `/root` seçip kaydedin.

## Gönderdiğiniz görselleri birebir yerleştirme
Aşağıdaki dosyaları aynı adlarla değiştirmeniz yeterlidir:
- `assets/cern-logo.svg` → ana CERN Koleji logosu
- `assets/beylikduzu.jpg` → Beylikdüzü kampüs görseli
- `assets/lab.jpg` → Çamlıca kampüs görseli
- `assets/classroom.jpg` → Zincirlikuyu kampüs görseli
- `assets/robotics.jpg` ve `assets/innovation.jpg` → eğitim/atölye görselleri

Dosya adları aynı kaldığı sürece HTML veya CSS düzenlemeniz gerekmez.

## Form entegrasyonu
Form şu anda tarayıcı içinde doğrulama yapar ve başarı mesajı gösterir. Kalıcı başvuru kaydı için `script.js` dosyasındaki form bölümünü Google Forms, Formspree veya kurum CRM endpoint'i ile bağlayın.

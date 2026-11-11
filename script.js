// ===== DARK MODE =====
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  document.querySelector('.theme-btn').textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

// Kaydedilmiş temayı uygula
(function () {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelector('.theme-btn').textContent = '☀️';
    });
  }
})();

// ===== MOBİL MENÜ =====
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

// ===== FİLTRE =====
let activeCategory = 'all';
let searchTerm = '';

function filterProjects(category, btn) {
  activeCategory = category;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  applyFilters();
}

function searchProjects() {
  searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
  applyFilters();
}

function applyFilters() {
  const cards = document.querySelectorAll('.card');
  let visible = 0;

  cards.forEach(card => {
    const catMatch  = activeCategory === 'all' || card.dataset.category === activeCategory;
    const termMatch = searchTerm === '' || card.dataset.title.includes(searchTerm);

    if (catMatch && termMatch) {
      card.classList.remove('hidden');
      visible++;
    } else {
      card.classList.add('hidden');
    }
  });

  const countEl = document.getElementById('resultCount');
  countEl.textContent = `${visible} proje gösteriliyor`;

  document.getElementById('noResults').style.display = visible === 0 ? 'block' : 'none';
}

// İlk yüklemede sayaç
document.addEventListener('DOMContentLoaded', () => {
  applyFilters();
});

// ===== MODAL =====
function openModal(id) {
  const p = projects[id];
  if (!p) return;
  document.getElementById('modalContent').innerHTML = buildModal(p);
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ESC ile kapat
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

function copyCode(id) {
  const code = projects[id].code;
  navigator.clipboard.writeText(code).then(() => {
    const btn = document.querySelector('.copy-btn');
    btn.textContent = '✓ Kopyalandı!';
    setTimeout(() => btn.textContent = '📋 Kodu Kopyala', 2000);
  });
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildCircuit(circuitHtml, title) {
  return `
    <div class="circuit-box">
      <div class="circuit-header">
        <div class="circuit-dots">
          <div class="circuit-dot red"></div>
          <div class="circuit-dot yellow"></div>
          <div class="circuit-dot green"></div>
        </div>
        <span class="circuit-title">devre_baglantisi.ino — ${title}</span>
      </div>
      <div class="circuit-body">${circuitHtml}</div>
    </div>
  `;
}

function buildModal(p) {
  const mats  = p.materials.map(m => `<span class="material-tag">${m}</span>`).join('');
  const steps = p.steps.map((s, i) =>
    `<div class="step"><div class="step-num">${i + 1}</div><div class="step-text">${s}</div></div>`
  ).join('');
  const tips = p.tips.map(t =>
    `<div class="tip"><span class="tip-icon">💡</span><span>${t}</span></div>`
  ).join('');

  return `
    <div class="modal-title">${p.icon} ${p.title}</div>
    <div class="modal-desc">${p.desc}</div>

    <div class="section-label">🔧 Gerekli Malzemeler</div>
    <div class="materials">${mats}</div>

    <div class="section-label">📋 Yapım Adımları</div>
    <div class="steps">${steps}</div>

    <div class="section-label">🔌 Devre Bağlantısı</div>
    ${buildCircuit(p.circuit, p.title)}

    <div class="section-label">💬 İpuçları</div>
    <div class="tips">${tips}</div>

    <div class="section-label">💻 Arduino Kodu</div>
    <div class="code-header">
      <span style="font-size:.85rem;color:var(--text-muted)">.ino dosyası</span>
      <button class="copy-btn" onclick="copyCode('${p.id}')">📋 Kodu Kopyala</button>
    </div>
    <div class="code-block">${escapeHtml(p.code)}</div>
  `;
}

// ===== PROJE VERİLERİ =====
const projects = {

  // ── LED YAKMA ──────────────────────────────────────────────────────
  led: {
    id: 'led', icon: '💡', title: 'LED Yakma',
    desc: 'Arduino ile yapabileceğin en temel proje. Bir LED\'i 1 saniye aralıklarla yakıp söndür. Dijital çıkış, pinMode ve delay fonksiyonlarını öğrenmek için mükemmel başlangıç.',
    materials: ['Arduino Uno', 'LED (herhangi renk)', '220Ω Direnç', 'Breadboard', 'Jumper Kablo x2'],
    steps: [
      'Arduino\'yu bilgisayara USB ile bağla.',
      'Breadboard\'a LED\'i yerleştir. Uzun bacak (+) anot, kısa bacak (-) katottur.',
      '220Ω direnci LED\'in anot bacağına seri bağla.',
      'Direncin diğer ucunu Arduino\'nun Pin 13\'üne bağla.',
      'LED\'in katot bacağını GND\'ye bağla.',
      'Kodu Arduino IDE\'ye yapıştır, Upload (→) butonuna bas.',
    ],
    circuit: `<span class="com">// LED Devre Bağlantısı</span>
<span class="com">// ─────────────────────────────────</span>
<span class="pin">Pin 13</span>  <span class="arr">──→</span>  <span class="comp">220Ω Direnç</span>  <span class="arr">──→</span>  <span class="comp">LED Anot (+)</span>
<span class="comp">LED Katot (-)</span>  <span class="arr">──→</span>  <span class="pin">GND</span>
<span class="com">// ─────────────────────────────────</span>
<span class="com">// Pin 13 Uno'da yerleşik LED'e de bağlıdır!</span>`,
    tips: [
      '220Ω direnç MUTLAKA gereklidir, yoksa LED veya Arduino pini zarar görür.',
      'Pin 13\'ü kullanırsan harici LED\'e gerek yok — Uno\'nun üstündeki L ledini izleyebilirsin.',
      'Farklı pinler denemek istersen kodda sadece ledPin değerini değiştir.',
    ],
    code: `// LED Yakıp Söndürme
// Pin 13 Arduino Uno'da yerleşik LED'e de bağlıdır

const int ledPin = 13;

void setup() {
  pinMode(ledPin, OUTPUT);  // Pin 13 çıkış
}

void loop() {
  digitalWrite(ledPin, HIGH);  // LED yak
  delay(1000);                 // 1 sn bekle

  digitalWrite(ledPin, LOW);   // LED söndür
  delay(1000);                 // 1 sn bekle
}`
  },

  // ── BUTON LED ──────────────────────────────────────────────────────
  buton: {
    id: 'buton', icon: '🔘', title: 'Buton ile LED Kontrolü',
    desc: 'Bir butona basıldığında LED yanar, bırakıldığında söner. digitalRead ve INPUT_PULLUP kavramlarını öğren.',
    materials: ['Arduino Uno', 'LED', '220Ω Direnç', 'Anlık Buton (Tact Switch)', 'Breadboard', 'Jumper Kablo x4'],
    steps: [
      'LED\'i 220Ω direnç üzerinden Pin 13\'e, GND\'ye bağla.',
      'Butonun bir ucunu Pin 2\'ye, diğer ucunu GND\'ye bağla.',
      'INPUT_PULLUP sayesinde harici dirence gerek yoktur.',
      'Kodu yükle ve butona bas, LED\'in yandığını gör.',
    ],
    circuit: `<span class="com">// Buton + LED Bağlantısı</span>
<span class="com">// ─────────────────────────────────</span>
<span class="pin">Pin 13</span>  <span class="arr">──→</span>  <span class="comp">220Ω</span>  <span class="arr">──→</span>  <span class="comp">LED(+)</span>
<span class="comp">LED(-)</span>  <span class="arr">──→</span>  <span class="pin">GND</span>

<span class="comp">Buton 1. ucu</span>  <span class="arr">──→</span>  <span class="pin">Pin 2</span>
<span class="comp">Buton 2. ucu</span>  <span class="arr">──→</span>  <span class="pin">GND</span>`,
    tips: [
      'INPUT_PULLUP kullandığında pin varsayılan olarak HIGH okur. Butona basınca LOW olur.',
      'Butonun 4 bacağı vardır. Karşılıklı bacaklar birbirine bağlıdır, dikkatli bağla.',
      'Farklı bir pin kullanmak istersen kodda buttonPin değerini değiştir.',
    ],
    code: `// Buton ile LED Kontrolü

const int ledPin    = 13;
const int buttonPin = 2;

void setup() {
  pinMode(ledPin,    OUTPUT);
  pinMode(buttonPin, INPUT_PULLUP);  // Dahili pull-up direnci
}

void loop() {
  int butonDurumu = digitalRead(buttonPin);

  if (butonDurumu == LOW) {
    // Butona basıldı (LOW çünkü INPUT_PULLUP)
    digitalWrite(ledPin, HIGH);
  } else {
    // Buton bırakıldı
    digitalWrite(ledPin, LOW);
  }
}`
  },

  // ── MESAFE ÖLÇER ───────────────────────────────────────────────────
  mesafe: {
    id: 'mesafe', icon: '📡', title: 'Mesafe Ölçer',
    desc: 'HC-SR04 ultrasonik sensör ile mesafe ölç. Engel 50 cm\'den yaklaştıkça LED daha hızlı yanar. Serial Monitor\'dan anlık mesafeyi izle.',
    materials: ['Arduino Uno', 'HC-SR04 Ultrasonik Sensör', 'LED', '220Ω Direnç', 'Breadboard', 'Jumper Kablo x6'],
    steps: [
      'HC-SR04 sensörünü breadboard\'a yerleştir.',
      'VCC → 5V, GND → GND, TRIG → Pin 9, ECHO → Pin 8 olarak bağla.',
      'LED\'i 220Ω direnç üzerinden Pin 3\'e bağla, katodunu GND\'ye.',
      'Kodu yükle, Serial Monitor\'ı aç (9600 baud).',
      'Elinle sensöre yaklaş, LED\'in hızlandığını ve mesafenin ekranda değiştiğini gör.',
    ],
    circuit: `<span class="com">// HC-SR04 + LED Bağlantısı</span>
<span class="com">// ──────────────────────────────</span>
<span class="comp">HC-SR04</span>   <span class="arr">──→</span>  <span class="comp">Arduino Uno</span>
<span class="pin">VCC</span>       <span class="arr">──→</span>  <span class="pin">5V</span>
<span class="pin">GND</span>       <span class="arr">──→</span>  <span class="pin">GND</span>
<span class="pin">TRIG</span>      <span class="arr">──→</span>  <span class="pin">Pin 9</span>
<span class="pin">ECHO</span>      <span class="arr">──→</span>  <span class="pin">Pin 8</span>
<span class="com">// ──────────────────────────────</span>
<span class="pin">Pin 3</span>  <span class="arr">──→</span>  <span class="comp">220Ω</span>  <span class="arr">──→</span>  <span class="comp">LED(+)</span>
<span class="comp">LED(-)</span> <span class="arr">──→</span>  <span class="pin">GND</span>`,
    tips: [
      'HC-SR04\'ün ölçüm menzili 2 cm – 400 cm arasındadır.',
      'Çok yakın mesafede (2 cm altı) sensör hatalı okuma yapabilir.',
      'Pin 3 PWM desteklidir, ileride LED parlaklığını da ayarlayabilirsin.',
    ],
    code: `// Mesafe Ölçer — HC-SR04 + LED
// Engel yaklaştıkça LED hızlı yanar

const int trigPin = 9;
const int echoPin = 8;
const int ledPin  = 3;

long sure;
int  mesafe;
int  gecikmeSuresi;

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(ledPin,  OUTPUT);
  Serial.begin(9600);
}

void loop() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  sure   = pulseIn(echoPin, HIGH);
  mesafe = sure * 0.034 / 2;

  Serial.print("Mesafe: ");
  Serial.print(mesafe);
  Serial.println(" cm");

  if (mesafe > 0 && mesafe < 50) {
    gecikmeSuresi = map(mesafe, 1, 49, 50, 500);
    digitalWrite(ledPin, HIGH);
    delay(gecikmeSuresi);
    digitalWrite(ledPin, LOW);
    delay(gecikmeSuresi);
  } else {
    digitalWrite(ledPin, LOW);
    delay(50);
  }
}`
  },

  // ── DHT11 ──────────────────────────────────────────────────────────
  dht11: {
    id: 'dht11', icon: '🌡️', title: 'Sıcaklık & Nem Sensörü',
    desc: 'DHT11 sensörü ile ortam sıcaklığını ve nem oranını ölç. Veriler Serial Monitor\'da anlık gösterilir.',
    materials: ['Arduino Uno', 'DHT11 Sensör', '10kΩ Direnç', 'Breadboard', 'Jumper Kablo x3'],
    steps: [
      'DHT11\'i breadboard\'a yerleştir. Önden bakınca: 1.pin VCC, 2.pin DATA, 4.pin GND.',
      'VCC → 5V, GND → GND bağla.',
      'DATA pinini Pin 2\'ye bağla. DATA ile VCC arasına 10kΩ pull-up direnci koy.',
      'Arduino IDE\'de DHT sensor library\'yi yükle (Manage Libraries → DHT).',
      'Kodu yükle, Serial Monitor\'ı 9600 baud ile aç.',
    ],
    circuit: `<span class="com">// DHT11 Bağlantısı</span>
<span class="com">// ──────────────────────────────</span>
<span class="comp">DHT11</span>   <span class="arr">──→</span>  <span class="comp">Arduino Uno</span>
<span class="pin">VCC</span>     <span class="arr">──→</span>  <span class="pin">5V</span>
<span class="pin">DATA</span>    <span class="arr">──→</span>  <span class="pin">Pin 2</span>
<span class="pin">GND</span>     <span class="arr">──→</span>  <span class="pin">GND</span>
<span class="com">// DATA ile VCC arasına 10kΩ direnç</span>`,
    tips: [
      'DHT11 ölçüm aralığı: 0-50°C sıcaklık, %20-90 nem.',
      '10kΩ pull-up direnci olmadan sensör düzgün çalışmayabilir.',
      'Kütüphane olarak "DHT sensor library by Adafruit" ı yükle.',
    ],
    code: `// DHT11 Sıcaklık & Nem Ölçer
#include <DHT.h>

#define DHTPIN  2
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
  Serial.println("DHT11 Baslatildi");
}

void loop() {
  delay(2000);  // DHT11 en az 2sn bekler

  float nem      = dht.readHumidity();
  float sicaklik = dht.readTemperature();

  if (isnan(nem) || isnan(sicaklik)) {
    Serial.println("Sensor okunamadi!");
    return;
  }

  Serial.print("Sicaklik: ");
  Serial.print(sicaklik);
  Serial.print(" C  |  Nem: ");
  Serial.print(nem);
  Serial.println(" %");
}`
  },

  // ── SES SENSÖRÜ ────────────────────────────────────────────────────
  ses: {
    id: 'ses', icon: '🔊', title: 'Ses Sensörü Alarm',
    desc: 'Ortam sesine göre LED ve buzzer ile alarm ver. Alkış veya yüksek ses algılandığında sistem devreye girer.',
    materials: ['Arduino Uno', 'Ses Sensörü Modülü (KY-038)', 'LED', 'Buzzer', '220Ω Direnç', 'Jumper Kablo'],
    steps: [
      'Ses sensörünü breadboard\'a yerleştir.',
      'VCC → 5V, GND → GND, DO (dijital çıkış) → Pin 7 bağla.',
      'LED\'i 220Ω üzerinden Pin 13\'e bağla.',
      'Buzzer\'ın + ucunu Pin 6\'ya, - ucunu GND\'ye bağla.',
      'Sensör üzerindeki potansiyometre ile hassasiyeti ayarla.',
      'Kodu yükle, el çırp ve alarmın devreye girdiğini gör.',
    ],
    circuit: `<span class="com">// Ses Sensörü + LED + Buzzer</span>
<span class="comp">KY-038</span>    <span class="arr">──→</span>  <span class="comp">Arduino</span>
<span class="pin">VCC</span>       <span class="arr">──→</span>  <span class="pin">5V</span>
<span class="pin">GND</span>       <span class="arr">──→</span>  <span class="pin">GND</span>
<span class="pin">DO</span>        <span class="arr">──→</span>  <span class="pin">Pin 7</span>
<span class="com">// ──────────────────────────────</span>
<span class="pin">Pin 13</span>  <span class="arr">──→</span>  <span class="comp">220Ω</span>  <span class="arr">──→</span>  <span class="comp">LED(+)</span>
<span class="comp">LED(-)</span>  <span class="arr">──→</span>  <span class="pin">GND</span>
<span class="pin">Pin 6</span>   <span class="arr">──→</span>  <span class="comp">Buzzer(+)</span>
<span class="comp">Buzzer(-)</span> <span class="arr">──→</span>  <span class="pin">GND</span>`,
    tips: [
      'Sensör üzerindeki mavi potansiyometre ile hassasiyet ayarlanır. Saat yönü = daha hassas.',
      'DO pini dijital sinyal verir (0 veya 1). AO analog veri verir, daha hassas ölçüm için kullanılabilir.',
      'Alarm süresini uzatmak için alarmDuration değerini artır.',
    ],
    code: `// Ses Sensörü Alarm
// KY-038 ses sensörü ile LED + Buzzer kontrolü

const int sesPin    = 7;
const int ledPin    = 13;
const int buzzerPin = 6;
const int alarmDuration = 500; // ms

void setup() {
  pinMode(sesPin,    INPUT);
  pinMode(ledPin,    OUTPUT);
  pinMode(buzzerPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int ses = digitalRead(sesPin);

  if (ses == HIGH) {
    Serial.println("Ses algilandi! Alarm!");
    digitalWrite(ledPin, HIGH);
    tone(buzzerPin, 1000, alarmDuration);
    delay(alarmDuration);
    digitalWrite(ledPin, LOW);
  }
}`
  },

  // ── SERVO ──────────────────────────────────────────────────────────
  servo: {
    id: 'servo', icon: '⚙️', title: 'Servo Motor Kontrolü',
    desc: 'Potansiyometre ile servo motoru 0°-180° arasında istediğin açıya getir. Servo kütüphanesini ve analogRead kullanımını öğren.',
    materials: ['Arduino Uno', 'SG90 Servo Motor', '10kΩ Potansiyometre', 'Breadboard', 'Jumper Kablo x5'],
    steps: [
      'Servo motorun kırmızı kablosunu 5V\'a, kahverengi/siyahı GND\'ye, sarı/turuncu sinyal kablosunu Pin 9\'a bağla.',
      'Potansiyometrenin sol ucunu GND\'ye, sağ ucunu 5V\'a, ortasını A0\'a bağla.',
      'Kodu yükle.',
      'Potansiyometreyi çevir, servo motorun döndüğünü gör.',
    ],
    circuit: `<span class="com">// Servo + Potansiyometre</span>
<span class="comp">Servo</span>
<span class="pin">Kırmızı (VCC)</span>  <span class="arr">──→</span>  <span class="pin">5V</span>
<span class="pin">Kahve  (GND)</span>   <span class="arr">──→</span>  <span class="pin">GND</span>
<span class="pin">Sarı   (SIG)</span>   <span class="arr">──→</span>  <span class="pin">Pin 9</span>
<span class="com">// ──────────────────────────────</span>
<span class="comp">Potansiyometre</span>
<span class="pin">Sol uç</span>   <span class="arr">──→</span>  <span class="pin">GND</span>
<span class="pin">Sağ uç</span>   <span class="arr">──→</span>  <span class="pin">5V</span>
<span class="pin">Orta</span>     <span class="arr">──→</span>  <span class="pin">A0</span>`,
    tips: [
      'SG90 servo motoru 5V\'ta çalışır. Daha büyük servolar için harici güç kaynağı kullan.',
      'Servo kütüphanesi Arduino IDE\'ye dahildir, ekstra kurulum gerekmez.',
      'map() fonksiyonu 0-1023 analog değeri 0-180 dereceye dönüştürür.',
    ],
    code: `// Servo Motor Kontrolü
// Potansiyometre ile 0-180 derece

#include <Servo.h>

Servo myServo;
const int potPin   = A0;
const int servoPin = 9;

void setup() {
  myServo.attach(servoPin);
  Serial.begin(9600);
}

void loop() {
  int potDeger = analogRead(potPin);          // 0-1023
  int aci      = map(potDeger, 0, 1023, 0, 180); // 0-180

  myServo.write(aci);

  Serial.print("Pot: ");
  Serial.print(potDeger);
  Serial.print("  |  Aci: ");
  Serial.print(aci);
  Serial.println(" derece");

  delay(15);
}`
  },

  // ── LCD ────────────────────────────────────────────────────────────
  lcd: {
    id: 'lcd', icon: '📺', title: 'LCD Ekran Yazı Yazdırma',
    desc: '16x2 LCD ekranda metin ve sayaç göster. I2C modülü ile sadece 2 kablo yeterli.',
    materials: ['Arduino Uno', '16x2 LCD Ekran', 'I2C LCD Modülü (PCF8574)', 'Jumper Kablo x4'],
    steps: [
      'I2C modülünü LCD\'nin arkasına tak (lehimli veya soketli).',
      'VCC → 5V, GND → GND, SDA → A4, SCL → A5 bağla.',
      'Arduino IDE\'de "LiquidCrystal I2C" kütüphanesini yükle.',
      'I2C adresini bulmak için I2C Scanner kodunu çalıştır (genellikle 0x27 veya 0x3F).',
      'Kodu yükle, ekranda yazının belirdiğini gör.',
    ],
    circuit: `<span class="com">// LCD I2C Bağlantısı</span>
<span class="com">// (sadece 4 kablo!)</span>
<span class="comp">I2C Modül</span>  <span class="arr">──→</span>  <span class="comp">Arduino Uno</span>
<span class="pin">VCC</span>        <span class="arr">──→</span>  <span class="pin">5V</span>
<span class="pin">GND</span>        <span class="arr">──→</span>  <span class="pin">GND</span>
<span class="pin">SDA</span>        <span class="arr">──→</span>  <span class="pin">A4</span>
<span class="pin">SCL</span>        <span class="arr">──→</span>  <span class="pin">A5</span>`,
    tips: [
      'I2C adresi 0x27 veya 0x3F olabilir. Çalışmazsa diğerini dene.',
      'Ekranda bir şey görünmüyorsa modül üzerindeki potansiyometreyle kontrast ayarla.',
      '"LiquidCrystal I2C" kütüphanesini Frank de Brabander\'ın versiyonunu kullan.',
    ],
    code: `// LCD I2C Yazı + Sayaç
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// Adres 0x27 veya 0x3F dene
LiquidCrystal_I2C lcd(0x27, 16, 2);

int sayac = 0;

void setup() {
  lcd.init();
  lcd.backlight();

  lcd.setCursor(0, 0);
  lcd.print("Arduino!");

  lcd.setCursor(0, 1);
  lcd.print("Sayac: ");
}

void loop() {
  lcd.setCursor(7, 1);
  lcd.print(sayac);
  lcd.print("   ");  // Eski rakamları sil

  sayac++;
  delay(1000);
}`
  },

  // ── ALARM ──────────────────────────────────────────────────────────
  alarm: {
    id: 'alarm', icon: '🚨', title: 'Alarm Sistemi',
    desc: 'PIR hareket sensörü ile otomatik alarm sistemi. Hareket algılandığında LED yanar, buzzer öter ve Serial Monitor\'a mesaj gelir.',
    materials: ['Arduino Uno', 'PIR Hareket Sensörü (HC-SR501)', 'LED (kırmızı)', 'Buzzer', '220Ω Direnç', 'Jumper Kablo'],
    steps: [
      'PIR sensörün VCC → 5V, GND → GND, OUT → Pin 7 bağla.',
      'LED\'i 220Ω direnç üzerinden Pin 13\'e bağla.',
      'Buzzer\'ın + ucunu Pin 6\'ya bağla.',
      'Kodu yükle. Sensör ilk 30-60 saniyede kendini kalibre eder, bu süre boyunca hareket etme.',
      'Sensörün önünden geç, alarm devreye girsin.',
    ],
    circuit: `<span class="com">// PIR Alarm Sistemi</span>
<span class="comp">HC-SR501</span>
<span class="pin">VCC</span>   <span class="arr">──→</span>  <span class="pin">5V</span>
<span class="pin">GND</span>   <span class="arr">──→</span>  <span class="pin">GND</span>
<span class="pin">OUT</span>   <span class="arr">──→</span>  <span class="pin">Pin 7</span>
<span class="com">// ──────────────────────────────</span>
<span class="pin">Pin 13</span>  <span class="arr">──→</span>  <span class="comp">220Ω</span>  <span class="arr">──→</span>  <span class="comp">LED(+)</span>
<span class="comp">LED(-)</span>  <span class="arr">──→</span>  <span class="pin">GND</span>
<span class="pin">Pin 6</span>   <span class="arr">──→</span>  <span class="comp">Buzzer(+)</span>
<span class="comp">Buzzer(-)</span> <span class="arr">──→</span>  <span class="pin">GND</span>`,
    tips: [
      'PIR sensör ilk açıldığında 30-60 saniyelik kalibrasyon süresi ister.',
      'Sensörün arkasındaki 2 potansiyometre: biri hassasiyet, diğeri gecikme süresi ayarlar.',
      'Sensörün algılama açısı ~110°, menzili ~7 metredir.',
    ],
    code: `// PIR Hareket Sensörü Alarm
// HC-SR501 ile LED + Buzzer

const int pirPin    = 7;
const int ledPin    = 13;
const int buzzerPin = 6;

void setup() {
  pinMode(pirPin,    INPUT);
  pinMode(ledPin,    OUTPUT);
  pinMode(buzzerPin, OUTPUT);
  Serial.begin(9600);
  Serial.println("Sistem hazir. Kalibrasyon bekleniyor...");
  delay(30000);  // PIR kalibrasyonu için bekle
  Serial.println("Alarm aktif!");
}

void loop() {
  int hareket = digitalRead(pirPin);

  if (hareket == HIGH) {
    Serial.println("HAREKET ALGILANDI! ALARM!");
    digitalWrite(ledPin, HIGH);
    tone(buzzerPin, 1000, 200);
    delay(200);
    tone(buzzerPin, 800, 200);
    delay(200);
    tone(buzzerPin, 1000, 200);
    delay(1000);
    digitalWrite(ledPin, LOW);
  }
}`
  },

  // ── YILAN OYUNU ────────────────────────────────────────────────────
  yilan: {
    id: 'yilan', icon: '🐍', title: 'Yılan Oyunu',
    desc: 'OLED ekranda çalışan tam yılan oyunu. Sağ üstte puan, sol üstte süre gösterilir. Her puan alındığında buzzer öter, yılan hızlanır. UP+DOWN ile yeniden başlat.',
    materials: ['Arduino Uno', 'OLED 128x64 (SSD1306 I2C)', '4x Tact Buton', 'Buzzer', 'Breadboard', 'Jumper Kablo x12'],
    steps: [
      'OLED: SDA → A4, SCL → A5, VCC → 5V/3.3V, GND → GND bağla.',
      'Her butonun bir ucunu ilgili pine (9,10,11,12) bağla, diğer ucunu GND\'ye bağla.',
      'Buzzer\'ın + ucunu Pin 6\'ya, - ucunu GND\'ye bağla.',
      'Arduino IDE\'de "Adafruit SSD1306" ve "Adafruit GFX Library" kütüphanelerini yükle.',
      'Kodu yükle. Yılan oyununu oyna!',
    ],
    circuit: `<span class="comp">OLED SSD1306</span>
<span class="pin">SDA</span> <span class="arr">──→</span> <span class="pin">A4</span>  |  <span class="pin">SCL</span> <span class="arr">──→</span> <span class="pin">A5</span>
<span class="pin">VCC</span> <span class="arr">──→</span> <span class="pin">5V</span>  |  <span class="pin">GND</span> <span class="arr">──→</span> <span class="pin">GND</span>
<span class="com">// ──────────────────────────────</span>
<span class="comp">Butonlar</span> <span class="com">(pin → GND)</span>
<span class="comp">Yukarı</span>  <span class="arr">──→</span>  <span class="pin">Pin 9</span>
<span class="comp">Aşağı</span>   <span class="arr">──→</span>  <span class="pin">Pin 10</span>
<span class="comp">Sol</span>     <span class="arr">──→</span>  <span class="pin">Pin 11</span>
<span class="comp">Sağ</span>     <span class="arr">──→</span>  <span class="pin">Pin 12</span>
<span class="comp">Buzzer(+)</span> <span class="arr">──→</span> <span class="pin">Pin 6</span>  |  <span class="comp">(-)</span> <span class="arr">──→</span> <span class="pin">GND</span>`,
    tips: [
      'OLED I2C adresi genellikle 0x3C\'dir. Çalışmazsa 0x3D dene.',
      'Kütüphaneler: Adafruit SSD1306 ve Adafruit GFX Library (Manage Libraries\'den yükle).',
      'Yılan duvardan geçer, kendine çarpınca oyun biter. UP+DOWN aynı anda = yeniden başlat.',
    ],
    code: `#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

#define BTN_UP    9
#define BTN_DOWN  10
#define BTN_RIGHT 12
#define BTN_LEFT  11
#define BUZZER    6

#define GRID_SIZE 4
#define GRID_Y    10
#define GRID_H    54
#define GRID_W    128
#define MAX_SNAKE 100

#define DIR_UP    0
#define DIR_DOWN  1
#define DIR_RIGHT 2
#define DIR_LEFT  3

struct Point { int x, y; };

Point snake[MAX_SNAKE];
int snakeLen, dir, score;
Point food;
unsigned long startTime, gameSpeed;
bool gameOver;

void spawnFood() {
  bool onSnake;
  do {
    onSnake = false;
    food.x = random(0, GRID_W / GRID_SIZE) * GRID_SIZE;
    food.y = GRID_Y + random(0, GRID_H / GRID_SIZE) * GRID_SIZE;
    for (int i = 0; i < snakeLen; i++)
      if (snake[i].x == food.x && snake[i].y == food.y) onSnake = true;
  } while (onSnake);
}

void initGame() {
  snakeLen = 3; dir = DIR_RIGHT; score = 0;
  gameOver = false; gameSpeed = 200;
  startTime = millis();
  snake[0] = {40, 32}; snake[1] = {36, 32}; snake[2] = {32, 32};
  spawnFood();
}

void drawGame() {
  display.clearDisplay();
  display.drawLine(0, 9, 127, 9, WHITE);
  unsigned long elapsed = (millis() - startTime) / 1000;
  display.setTextSize(1); display.setTextColor(WHITE);
  display.setCursor(0, 0);
  display.print("T:"); display.print(elapsed); display.print("s");
  display.setCursor(85, 0);
  display.print("P:"); display.print(score);
  for (int i = 0; i < snakeLen; i++) {
    if (i == 0) display.fillRect(snake[i].x, snake[i].y, GRID_SIZE, GRID_SIZE, WHITE);
    else display.drawRect(snake[i].x, snake[i].y, GRID_SIZE, GRID_SIZE, WHITE);
  }
  display.drawLine(food.x, food.y, food.x+GRID_SIZE-1, food.y+GRID_SIZE-1, WHITE);
  display.drawLine(food.x+GRID_SIZE-1, food.y, food.x, food.y+GRID_SIZE-1, WHITE);
  display.display();
}

void moveSnake() {
  for (int i = snakeLen - 1; i > 0; i--) snake[i] = snake[i-1];
  switch (dir) {
    case DIR_UP:    snake[0].y -= GRID_SIZE; break;
    case DIR_DOWN:  snake[0].y += GRID_SIZE; break;
    case DIR_RIGHT: snake[0].x += GRID_SIZE; break;
    case DIR_LEFT:  snake[0].x -= GRID_SIZE; break;
  }
  if (snake[0].x < 0)              snake[0].x = GRID_W - GRID_SIZE;
  if (snake[0].x >= GRID_W)        snake[0].x = 0;
  if (snake[0].y < GRID_Y)         snake[0].y = GRID_Y + GRID_H - GRID_SIZE;
  if (snake[0].y >= GRID_Y+GRID_H) snake[0].y = GRID_Y;
  for (int i = 1; i < snakeLen; i++) {
    if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
      gameOver = true; tone(BUZZER, 200, 500); return;
    }
  }
  if (snake[0].x == food.x && snake[0].y == food.y) {
    score++;
    if (snakeLen < MAX_SNAKE) snakeLen++;
    tone(BUZZER, 1000, 100);
    if (gameSpeed > 80) gameSpeed -= 10;
    spawnFood();
  }
}

void readButtons() {
  bool up   = digitalRead(BTN_UP)    == LOW;
  bool down = digitalRead(BTN_DOWN)  == LOW;
  bool rght = digitalRead(BTN_RIGHT) == LOW;
  bool left = digitalRead(BTN_LEFT)  == LOW;
  if (gameOver && up && down) { delay(300); initGame(); return; }
  if (gameOver) return;
  if (up   && dir != DIR_DOWN)  dir = DIR_UP;
  if (down && dir != DIR_UP)    dir = DIR_DOWN;
  if (rght && dir != DIR_LEFT)  dir = DIR_RIGHT;
  if (left && dir != DIR_RIGHT) dir = DIR_LEFT;
}

void setup() {
  pinMode(BTN_UP,   INPUT_PULLUP);
  pinMode(BTN_DOWN, INPUT_PULLUP);
  pinMode(BTN_RIGHT,INPUT_PULLUP);
  pinMode(BTN_LEFT, INPUT_PULLUP);
  pinMode(BUZZER,   OUTPUT);
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  display.clearDisplay(); display.display();
  randomSeed(analogRead(A0));
  initGame();
}

void loop() {
  static unsigned long lastMove = 0;
  readButtons();
  if (!gameOver) {
    if (millis() - lastMove >= gameSpeed) { moveSnake(); lastMove = millis(); }
    drawGame();
  } else {
    display.clearDisplay();
    display.setTextSize(1); display.setTextColor(WHITE);
    display.setCursor(25, 10); display.print("GAME OVER!");
    display.setCursor(10, 25); display.print("Puan: "); display.print(score);
    display.setCursor(5,  50); display.print("UP+DOWN = Tekrar");
    display.display();
  }
}`
  }

};

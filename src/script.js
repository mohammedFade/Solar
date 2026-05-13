const PANEL_WATT = 590;
const BATTERY_MARGIN = 1.2;
const MAX_HOURS = 12;

const catalog = [

  { n: "شاشة تلفزيون", w: 150, i: "📺" },
  { n: "مروحة", w: 80, i: "🌀" },
  { n: "ثلاجة عادية", w: 250, i: "🧊" },
  { n: "ثلاجة انفيرتر", w: 90, i: "🥶" },
  { n: "مكيف نسمة", w: 250, i: "❄️" },
  { n: "إنارة LED", w: 40, i: "💡" },
  { n: "مكيف سبليت 12 انفيرتر", w: 850, i: "🛡️" },
  { n: " مكيف سبليت 12 عادي", w: 1800, i: "🌬️" },
  { n: "غسالة ملابس", w: 400, i: "👕" },
  { n: "لابتوب", w: 100, i: "💻" },
  { n: "سخان مياه", w: 2000, i: "🚿" },
  { n: "هيتر طبخ", w: 2500, i: "🍳" },
  { n: "ميكروويف", w: 1200, i: "🍲" },
  { n: "فرن كهربائي", w: 2500, i: "🔥" },
  { n: "موتور 1/2 حصان", w: 400, i: "🚰" },
  { n: "موتور 1 حصان", w: 750, i: "💧" },
  { n: "مكواة", w: 1200, i: "👔" },
  { n: "شاحن هواتف", w: 20, i: "🔋" }

];

let devices = [];
let currentStep = 1;

const catalogContainer = document.getElementById("catalog");
const devicesContainer = document.getElementById("devices");
const resultsContainer = document.getElementById("results");

/* catalog */

function renderCatalog() {

  catalogContainer.innerHTML = "";

  catalog.forEach(device => {

    const exist = devices.find(v => v.n === device.n);

    const card = document.createElement("div");

    card.className = exist
      ? "device-card active"
      : "device-card";

    card.innerHTML = `

      <div class="device-icon">${device.i}</div>

      <div class="device-name">${device.n}</div>

      <div class="device-power">${device.w} واط</div>

    `;

    card.onclick = () => toggleDevice(device);

    catalogContainer.appendChild(card);

  });

}

/* add remove */

function toggleDevice(device) {

  const exist = devices.find(v => v.n === device.n);

  if (exist) {

    devices = devices.filter(v => v.n !== device.n);

  } else {

    devices.push({

      n: device.n,
      w: device.w,
      i: device.i,

      qty: 1,
      day: 1,
      night: 0

    });

  }

  renderCatalog();
  renderDevices();

}

/* controls */

function renderDevices() {

  devicesContainer.innerHTML = "";

  if (devices.length === 0) {

    devicesContainer.innerHTML = `

      <div class="empty-state">

        <div class="empty-icon">⚡</div>

        <h3>لم يتم اختيار أجهزة</h3>

      </div>

    `;

    return;

  }

  devices.forEach((device, index) => {

    const item = document.createElement("div");

    item.className = "device-control";

    item.innerHTML = `

      <div class="device-top">

        <div>

          <h3>${device.i} ${device.n}</h3>

          <small>${device.w} واط</small>

        </div>

      </div>

      <div class="hours-box">

        <div class="counter">

          <div class="counter-label">

            <strong>العدد</strong>

            <small>عدد الأجهزة</small>

          </div>

          <div class="counter-actions">

            <button onclick="changeQty(${index}, -1)">-</button>

            <div class="counter-value">${device.qty}</div>

            <button onclick="changeQty(${index}, 1)">+</button>

          </div>

        </div>

      </div>

      <div class="hours-box">

        <div class="counter">

          <div class="counter-label">

            <strong>☀️ ساعات النهار</strong>

            <small>الحد الأقصى ${MAX_HOURS}</small>

          </div>

          <div class="counter-actions">

            <button onclick="changeDay(${index}, -1)">-</button>

            <div class="counter-value">${device.day}</div>

            <button onclick="changeDay(${index}, 1)">+</button>

          </div>

        </div>

      </div>

      <div class="hours-box">

        <div class="counter">

          <div class="counter-label">

            <strong>🌙 ساعات الليل</strong>

            <small>الحد الأقصى ${MAX_HOURS}</small>

          </div>

          <div class="counter-actions">

            <button onclick="changeNight(${index}, -1)">-</button>

            <div class="counter-value">${device.night}</div>

            <button onclick="changeNight(${index}, 1)">+</button>

          </div>

        </div>

      </div>

    `;

    devicesContainer.appendChild(item);

  });

}

/* qty */

function changeQty(index, value) {

  devices[index].qty += value;

  if (devices[index].qty < 1) {

    devices[index].qty = 1;

  }

  renderDevices();

}

/* day */

function changeDay(index, value) {

  devices[index].day += value;

  if (devices[index].day < 0) {

    devices[index].day = 0;

  }

  if (devices[index].day > MAX_HOURS) {

    devices[index].day = MAX_HOURS;

  }

  renderDevices();

}

/* night */

function changeNight(index, value) {

  devices[index].night += value;

  if (devices[index].night < 0) {

    devices[index].night = 0;

  }

  if (devices[index].night > MAX_HOURS) {

    devices[index].night = MAX_HOURS;

  }

  renderDevices();

}

/* inverter */

function calculateInverter(watts) {

  if (watts < 800) return "2.2 كيلو";
  if (watts < 1800) return "3.2 كيلو";
  if (watts < 3200) return "4.2 كيلو";
  if (watts < 4600) return "6.2 كيلو";
  if (watts < 5600) return "8.2 كيلو";
  if (watts < 7600) return "10.2 كيلو";

  return "منظومة خاصة";

}

/* results */

function calculateResults() {

  if (devices.length === 0) {

    resultsContainer.innerHTML = `
    
      <div class="empty-state">

        <div class="empty-icon">📊</div>

        <h3>لا توجد نتائج</h3>

      </div>

    `;

    return;

  }

  let instantPower = 0;
  let dayConsumption = 0;
  let nightConsumption = 0;

  devices.forEach(device => {

    instantPower += device.w * device.qty;

    dayConsumption +=
      device.w *
      device.qty *
      device.day;

    nightConsumption +=
      device.w *
      device.qty *
      device.night;

  });

  const totalConsumption =
    dayConsumption + nightConsumption;

  const battery =
    ((nightConsumption * BATTERY_MARGIN) / 1000)
      .toFixed(1);

  const panels =
    Math.ceil(totalConsumption / 4200);

  const inverter =
    calculateInverter(instantPower);

  resultsContainer.innerHTML = `

    <div class="result-card">

      <h3>⚡ القدرة اللحظية</h3>

      <p>${instantPower.toLocaleString()} W</p>

    </div>

    <div class="result-card">

      <h3>☀️ استهلاك النهار</h3>

      <p>${dayConsumption.toLocaleString()} W</p>

    </div>

    <div class="result-card">

      <h3>🌙 استهلاك الليل</h3>

      <p>${nightConsumption.toLocaleString()} W</p>

    </div>

    <div class="result-card">

      <h3>📊 الاستهلاك الكلي</h3>

      <p>${totalConsumption.toLocaleString()} W</p>

    </div>

    <div class="result-card">

      <h3>🔋 البطارية</h3>

      <p>${battery} kWh</p>

    </div>

    <div class="result-card">

      <h3>️🔳 عدد الألواح</h3>

      <p>${panels} لوح</p>

    </div>

    <div class="result-card">

      <h3>⚡ الانفيرتر</h3>

      <p>${inverter}</p>

    </div>

  `;

}

/* whatsapp */

function sendWhatsApp() {
  
  if (devices.length === 0) {
    
    alert("أضف أجهزة أولاً");
    
    return;
    
  }
  
  let instantPower = 0;
  let dayConsumption = 0;
  let nightConsumption = 0;
  
  devices.forEach(device => {
    
    instantPower += device.w * device.qty;
    
    dayConsumption +=
      device.w *
      device.qty *
      device.day;
    
    nightConsumption +=
      device.w *
      device.qty *
      device.night;
    
  });
  
  const totalConsumption =
    dayConsumption + nightConsumption;
  
  const battery =
    ((nightConsumption * BATTERY_MARGIN) / 1000)
    .toFixed(1);
  
  const panels =
    Math.ceil(totalConsumption / 4200);
  
  const inverter =
    calculateInverter(instantPower);
  
  let message = `☀️ *نتائج حساب المنظومة الشمسية* ⚡\n\n`;
  
  message += `━━━━━━━━━━━━━━\n`;
  message += `📋 *تفاصيل الأجهزة*\n`;
  message += `━━━━━━━━━━━━━━\n\n`;
  
  devices.forEach(device => {
    
    message += `🔹 *${device.n}*\n`;
    message += `📦 العدد: ${device.qty}\n`;
    message += `☀️ النهار: ${device.day} ساعة\n`;
    message += `🌙 الليل: ${device.night} ساعة\n`;
    message += `⚡ الاستهلاك: ${device.w * device.qty} واط\n\n`;
    
  });
  
  message += `━━━━━━━━━━━━━━\n`;
  message += `📊 *نتائج المنظومة*\n`;
  message += `━━━━━━━━━━━━━━\n\n`;
  
  message += `⚡ القدرة اللحظية: ${instantPower.toLocaleString()} W\n`;
  
  message += `☀️ استهلاك النهار: ${dayConsumption.toLocaleString()} W\n`;
  
  message += `🌙 استهلاك الليل: ${nightConsumption.toLocaleString()} W\n`;
  
  message += `📈 الاستهلاك الكلي: ${totalConsumption.toLocaleString()} W\n`;
  
  message += `🔋 البطارية المقترحة: ${battery} kWh\n`;
  
  message += `☀️ عدد الألواح: ${panels} لوح\n`;
  
  message += `⚡ الانفيرتر المناسب: ${inverter}\n\n`;
  
  message += `━━━━━━━━━━━━━━\n`;
  message += `💚 شكرًا لاستخدامك نظام فادي لحساب الطاقة الشمسية\n`;
  message += `نسعد بخدمتك دائمًا ونتمنى لك تجربة طاقة ذكية وآمنة ☀️✨\n\n`;
  
  window.open(
    
    `https://wa.me/249912341391?text=${encodeURIComponent(message)}`,
    
    "_blank"
    
  );
  
}

/* navigation */

function goStep(step) {

  currentStep = step;

  document.querySelectorAll(".panel")
    .forEach(panel => {

      panel.classList.remove("active");

    });

  document.querySelector(`#panel-${step}`)
    .classList.add("active");

  document.querySelectorAll(".step")
    .forEach(item => {

      item.classList.remove("active");

    });

  document.querySelector(`#step-${step}`)
    .classList.add("active");

  if (step === 3) {

    calculateResults();

  }

}

function nextStep() {

  if (currentStep < 3) {

    currentStep++;

    goStep(currentStep);

  }

}

function prevStep() {

  if (currentStep > 1) {

    currentStep--;

    goStep(currentStep);

  }

}

/* init */

renderCatalog();
renderDevices();
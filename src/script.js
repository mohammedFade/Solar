// البيانات الأساسية
const PANEL_WATT = 590;
const SUN_HOURS = 4;
const BATTERY_MARGIN = 1.2;
const MAX_HOURS = 12; // الحد الأقصى للساعات

// كتالوج الأجهزة
const catalog = [
  { n: "شاشة تلفزيون", w: 150, i: "📺" },
  { n: "مروحة", w: 75, i: "🌀" },
  { n: "ثلاجة عادية", w: 250, i: "🧊" },
  { n: "ثلاجة انفيرتر", w: 90, i: "🥶" },
  { n: "مكيف نسمة", w: 250, i: "❄️" },
  { n: "إنارة LED", w: 40, i: "💡" },
  { n: "مكيف سبليت انفيرتر", w: 800, i: "🛡️" },
  { n: "مكيف سبليت", w: 1800, i: "🌬️" },
  { n: "غسالة أطباق", w: 1500, i: "🧺" },
  { n: "غسالة ملابس", w: 400, i: "👕" },
  { n: "لابتوب", w: 100, i: "💻" },
  { n: "سخان مياه", w: 2000, i: "🚿" },
  { n: "ميكروويف", w: 1200, i: "🍲" },
  { n: "فرن كهربائي", w: 2500, i: "🔥" },
  { n: "موتور 1/2 حصان", w: 400, i: "🚰" },
  { n: "موتور 1 حصان", w: 750, i: "🚰" },
  { n: "مكواة", w: 1200, i: "👔" },
  { n: "شاحن هواتف", w: 20, i: "🔋" },
];

// متغيرات التطبيق
let devices = [];
const cards = document.getElementById("cards");
const devicesDiv = document.getElementById("devices");
const resultDiv = document.getElementById("result");
const inverterResult = document.getElementById("inverter-result");
const devicesCount = document.getElementById("devicesCount");
const totalConsumption = document.getElementById("totalConsumption");

// تهيئة كتالوج الأجهزة
function initCatalog() {
  catalog.forEach((device) => {
    const card = document.createElement("div");
    card.className = "device-card";
    card.innerHTML = `
      <div class="device-icon">${device.i}</div>
      <div class="device-name">${device.n}</div>
      <div class="device-power">${device.w} واط</div>
    `;

    card.onclick = () => {
      if (!devices.find((v) => v.n === device.n)) {
        devices.push({
          n: device.n,
          w: device.w,
          i: device.i,
          c: 1,
          day: 1,
          night: 0,
        });
        card.classList.add("added");
        renderDevices();
        updateStats();
        updateStepStatus();
      }
    };

    cards.appendChild(card);
  });
}

// تحديث الإحصائيات
function updateStats() {
  const count = devices.length;
  devicesCount.textContent = count;

  let instantPower = 0;
  if (devices.length > 0) {
    instantPower = devices.reduce(
      (sum, device) => sum + device.w * device.c,
      0
    );
  }
  totalConsumption.textContent = `${instantPower.toLocaleString()} واط`;
}

// التنقل بين الخطوات
function go(step) {
  // تحديث الخطوات النشطة
  document.querySelectorAll(".step-item").forEach((item, index) => {
    item.classList.toggle("active", index + 1 === step);
  });

  // تحديث اللوحات النشطة
  document.querySelectorAll(".panel").forEach((panel, index) => {
    panel.classList.toggle("active", index + 1 === step);
  });

  // إذا كنا في الخطوة 3، نقوم بالحساب
  if (step === 3) {
    calculateResults();
  }
}

// تحديث حالة الخطوات
function updateStepStatus() {
  const step2 = document.querySelectorAll(".step-item")[1];
  const step3 = document.querySelectorAll(".step-item")[2];

  if (devices.length > 0) {
    step2.classList.add("active-step");
    step3.classList.add("active-step");
  } else {
    step2.classList.remove("active-step");
    step3.classList.remove("active-step");
  }
}

// عرض الأجهزة المضافة
function renderDevices() {
  devicesDiv.innerHTML = "";

  if (devices.length === 0) {
    devicesDiv.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #94a3b8;">
        <i class="fas fa-plug" style="font-size: 3rem; margin-bottom: 20px; display: block;"></i>
        <h3>لم تقم بإضافة أي أجهزة بعد</h3>
        <p>ارجع إلى الخطوة الأولى واختر الأجهزة التي تريد إضافتها</p>
      </div>
    `;
    return;
  }

  devices.forEach((device, index) => {
    const deviceRow = document.createElement("div");
    deviceRow.className = "device-row";
    deviceRow.innerHTML = `
      <div class="device-info">
        <div style="font-size: 1.8rem;">${device.i}</div>
        <div>
          <h3 style="margin-bottom: 5px;">${device.n}</h3>
          <div style="color: var(--accent); font-weight: bold;">${
            device.w
          } واط</div>
        </div>
      </div>
      
      <div class="quantity-control">
        <div class="quantity-label">العدد</div>
        <div class="quantity-buttons">
          <button class="quantity-btn" onclick="updateQuantity(${index}, -1)" ${
      device.c <= 1 ? "disabled" : ""
    }>-</button>
          <input type="number" class="quantity-input" value="${
            device.c
          }" min="1" 
                 onchange="updateQuantity(${index}, 0, this.value)">
          <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
        </div>
      </div>
      
      <div class="hours-control">
        <div class="hours-label">ساعات النهار</div>
        <div class="hours-value">${device.day}</div>
        <div class="hours-limit">(حد أقصى: 12)</div>
        <div class="hours-buttons">
          <button class="hour-btn" onclick="updateHours(${index}, 'day', -1)" ${
      device.day <= 0 ? "disabled" : ""
    }>-</button>
          <button class="hour-btn" onclick="updateHours(${index}, 'day', 1)" ${
      device.day >= MAX_HOURS ? "disabled" : ""
    }>+</button>
        </div>
      </div>
      
      <div class="hours-control">
        <div class="hours-label">ساعات الليل</div>
        <div class="hours-value">${device.night}</div>
        <div class="hours-limit">(حد أقصى: 12)</div>
        <div class="hours-buttons">
          <button class="hour-btn" onclick="updateHours(${index}, 'night', -1)" ${
      device.night <= 0 ? "disabled" : ""
    }>-</button>
          <button class="hour-btn" onclick="updateHours(${index}, 'night', 1)" ${
      device.night >= MAX_HOURS ? "disabled" : ""
    }>+</button>
        </div>
      </div>
    `;

    devicesDiv.appendChild(deviceRow);
  });
}

// تحديث كمية الجهاز
function updateQuantity(index, change, newValue = null) {
  if (newValue !== null) {
    const value = parseInt(newValue) || 1;
    if (value < 1) {
      devices[index].c = 1;
    } else {
      devices[index].c = value;
    }
  } else {
    devices[index].c += change;
    if (devices[index].c < 1) devices[index].c = 1;
  }
  renderDevices();
  updateStats();
  calculateResults();
}

// تحديث ساعات التشغيل
function updateHours(index, type, change) {
  if (type === "day") {
    const newValue = devices[index].day + change;
    if (newValue >= 0 && newValue <= MAX_HOURS) {
      devices[index].day = newValue;
    }
  } else {
    const newValue = devices[index].night + change;
    if (newValue >= 0 && newValue <= MAX_HOURS) {
      devices[index].night = newValue;
    }
  }
  renderDevices();
  updateStats();
  calculateResults();
}

// مسح جميع الأجهزة
function clearAll() {
  devices = [];
  document.querySelectorAll(".device-card").forEach((card) => {
    card.classList.remove("added");
  });
  renderDevices();
  updateStats();
  updateStepStatus();
}

// حساب مواصفات الانفرتر
function calculateInverter(watts) {
  if (watts < 800) return "انفيرتر 2.2 كيلو واط";
  if (watts < 1800) return "انفيرتر 3.2 كيلو واط";
  if (watts < 3300) return "انفيرتر 4.2 كيلو واط";
  if (watts < 4800) return "انفيرتر 6.2 كيلو واط";
  if (watts < 5800) return "انفيرتر 8.2 كيلو واط";
  if (watts < 7800) return "انفيرتر 10.2 كيلو واط";
  return "يرجى التواصل مع مهندس المنظومة";
}

// الحسابات الرئيسية
function calculateResults() {
  if (devices.length === 0) {
    resultDiv.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #94a3b8; grid-column: 1 / -1;">
        <i class="fas fa-calculator" style="font-size: 3rem; margin-bottom: 20px; display: block;"></i>
        <h3>لا توجد بيانات للحساب</h3>
        <p>ارجع إلى الخطوة الأولى واختر الأجهزة التي تريد إضافتها</p>
      </div>
    `;
    inverterResult.textContent = "انفيرتر 2.2 كيلو واط";
    return;
  }

  let instantPower = 0;
  let dayConsumption = 0;
  let nightConsumption = 0;

  devices.forEach((device) => {
    instantPower += device.w * device.c;
    dayConsumption += device.w * device.c * device.day;
    nightConsumption += device.w * device.c * device.night;
  });

  const totalConsumptionVal = dayConsumption + nightConsumption;
  const batteryKwh = ((nightConsumption * BATTERY_MARGIN) / 1000).toFixed(2);
  const panels = Math.ceil(dayConsumption / (PANEL_WATT * SUN_HOURS));
  const inverter = calculateInverter(instantPower);

  // تحديث نتيجة الانفرتر
  inverterResult.textContent = inverter;

  // عرض النتائج
  resultDiv.innerHTML = `
    <div class="result-card">
      <div class="result-icon">🔌</div>
      <div class="result-title">القدرة اللحظية</div>
      <div class="result-value">${instantPower.toLocaleString()} واط</div>
    </div>
    
    <div class="result-card">
      <div class="result-icon">☀️</div>
      <div class="result-title">استهلاك النهار</div>
      <div class="result-value">${dayConsumption.toLocaleString()} واط/ساعة</div>
    </div>
    
    <div class="result-card">
      <div class="result-icon">🌙</div>
      <div class="result-title">استهلاك الليل</div>
      <div class="result-value">${nightConsumption.toLocaleString()} واط/ساعة</div>
    </div>
    
    <div class="result-card">
      <div class="result-icon">📊</div>
      <div class="result-title">الاستهلاك الكلي</div>
      <div class="result-value">${totalConsumptionVal.toLocaleString()} واط/ساعة</div>
    </div>
    
    <div class="result-card">
      <div class="result-icon">🔋</div>
      <div class="result-title">سعة البطارية</div>
      <div class="result-value">${batteryKwh} ك.و.س</div>
    </div>
    
    <div class="result-card">
      <div class="result-icon">🌞</div>
      <div class="result-title">عدد الألواح الشمسية</div>
      <div class="result-value">${panels} لوح</div>
    </div>
  `;
}

// حفظ النتائج كصورة
function saveImage() {
  const resultsSection = document.getElementById("s3");

  html2canvas(resultsSection).then((canvas) => {
    const link = document.createElement("a");
    link.download = `نظام-الطاقة-الشمسية-${new Date().toLocaleDateString(
      "ar-EG"
    )}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();

    // تنبيه للمستخدم
    alert("تم حفظ النتائج كصورة بنجاح!");
  });
}

// إرسال النتائج عبر واتساب
function sendWhatsApp() {
  if (devices.length === 0) {
    alert("يرجى إضافة أجهزة أولاً قبل المشاركة");
    return;
  }

  let deviceList = "";
  devices.forEach((device) => {
    deviceList += `- ${device.n}: ${device.c} جهاز، ${device.day} ساعة نهار، ${device.night} ساعة ليل\n`;
  });

  const instantPower = devices.reduce(
    (sum, device) => sum + device.w * device.c,
    0
  );
  const dayConsumption = devices.reduce(
    (sum, device) => sum + device.w * device.c * device.day,
    0
  );
  const nightConsumption = devices.reduce(
    (sum, device) => sum + device.w * device.c * device.night,
    0
  );
  const totalConsumptionVal = dayConsumption + nightConsumption;
  const batteryKwh = ((nightConsumption * BATTERY_MARGIN) / 1000).toFixed(2);
  const panels = Math.ceil(dayConsumption / (PANEL_WATT * SUN_HOURS));
  const inverter = calculateInverter(instantPower);

  const message = `مرحباً،

أرغب في الحصول على عرض سعر لنظام طاقة شمسية:

📋 *الأجهزة المطلوبة*:
${deviceList}

📊 *نتائج الحساب*:
🔌 القدرة اللحظية: ${instantPower.toLocaleString()} واط
☀️ استهلاك النهار: ${dayConsumption.toLocaleString()} واط/ساعة
🌙 استهلاك الليل: ${nightConsumption.toLocaleString()} واط/ساعة
📊 الاستهلاك الكلي: ${totalConsumptionVal.toLocaleString()} واط/ساعة
🔋 سعة البطارية: ${batteryKwh} ك.و.س
🌞 عدد الألواح الشمسية: ${panels} لوح
⚡ الانفيرتر المقترح: ${inverter}

شكراً لاهتمامكم.`;

  window.open(
    `https://wa.me/249912341391?text=${encodeURIComponent(message)}`,
    "_blank"
  );
}

// تهيئة التطبيق عند التحميل
window.onload = function () {
  initCatalog();
  renderDevices();
  calculateResults();
  updateStats();
};

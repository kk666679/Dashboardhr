#!/usr/bin/env node
/**
 * Locale alignment script (temporary, run-once):
 * 1. For ms/zh/es/id/th/ph/vt/ar: merge the canonical `en` common.json structure,
 *    adding any missing keys (especially the `geolocation` section) with translated
 *    values where provided, English fallback otherwise.
 * 2. For bn/ne: rebuild common.json against the canonical en schema, mapping their
 *    existing translations where key names align (camelCase → snake_case variants),
 *    falling back to English for keys they don't have.
 */
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIR = join(__dirname, "..", "i18n", "locales");

const EN = JSON.parse(readFileSync(join(DIR, "en", "common.json"), "utf8"));

function flatten(obj, prefix = "") {
  const r = {};
  for (const [k, v] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      Object.assign(r, flatten(v, full));
    } else {
      r[full] = v;
    }
  }
  return r;
}

function unflatten(flat) {
  const out = {};
  for (const [key, value] of Object.entries(flat)) {
    const parts = key.split(".");
    let cur = out;
    for (let i = 0; i < parts.length - 1; i++) {
      cur[parts[i]] = cur[parts[i]] || {};
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = value;
  }
  return out;
}

function deepMerge(base, source) {
  const result = { ...base };
  for (const [k, v] of Object.entries(source)) {
    if (v && typeof v === "object" && !Array.isArray(v) &&
        result[k] && typeof result[k] === "object" && !Array.isArray(result[k])) {
      result[k] = deepMerge(result[k], v);
    } else {
      result[k] = v;
    }
  }
  return result;
}

const enFlat = flatten(EN);

// ── 1. Main locales — merge en keys, add translated geolocation where provided ──
// Geolocation translations per locale (best-effort real translations).
const GEOLOCATION = {
  ms: {
    title: "Geolokasi", dashboard: "Papan Pemuka Geolokasi", liveTracking: "Penjejakan Langsung",
    geofences: "Geofens", alerts: "Amaran Lokasi", history: "Sejarah Lokasi",
    analytics: "Analitik Geolokasi", settings: "Tetapan Geolokasi", activeTrackers: "Penjejak Aktif",
    pendingAlerts: "Amaran Tertunda", onlineWorkers: "Pekerja Dalam Talian", activeGeofences: "Geofens Aktif",
    trackingEnabled: "Dayakan Penjejakan Lokasi", consentGiven: "Kebenaran Penjejakan",
    updateFrequency: "Kekerapan Kemas Kini (minit)", privacyLevel: "Tahap Privasi",
    privacyStandard: "Standard", privacyHigh: "Tinggi", privacyMaximum: "Maksimum",
    emergencyContacts: "Hubungan Kecemasan", geofenceTypeWorksite: "Tapak Kerja",
    geofenceTypeRestricted: "Terhad", geofenceTypeAccommodation: "Penginapan",
    geofenceTypeCustom: "Tersuai", alertSeverityCritical: "Kritikal", alertSeverityHigh: "Tinggi",
    alertSeverityMedium: "Sederhana", alertSeverityLow: "Rendah", alertTypeUnauthorizedExit: "Keluar Tanpa Kebenaran",
    alertTypeRestrictedEntry: "Kemasukan Terhad", alertTypeSos: "Kecemasan SOS",
    alertTypeOffline: "Pekerja Luar Talian", alertTypeGeofenceViolation: "Pelanggaran Geofens",
    alertStatusOpen: "Buka", alertStatusResolved: "Selesai", alertStatusAcknowledged: "Diakui",
    geofenceAlertOnExit: "Amaran Semasa Keluar", geofenceAlertOnEntry: "Amaran Semasa Masuk",
    historyExportCsv: "Eksport CSV", liveTrackingRefresh: "Segar Semula", geofenceCreate: "Tambah Geofens",
    geofenceDelete: "Padam Geofens", geofenceToggleActive: "Aktifkan", geofenceToggleInactive: "Nyahaktifkan",
    settingsSave: "Simpan Perubahan", alertAcknowledge: "Akui", alertResolve: "Selesaikan",
    alertFilterAll: "Semua", alertFilterUnresolved: "Belum Selesai", alertFilterResolved: "Selesai",
    deviceBattery: "Bateri", deviceSignal: "Isyarat", deviceAccuracy: "Ketepatan",
    locationCoordinates: "Koordinat", locationTimestamp: "Masa", locationSource: "Sumber",
    complianceGeofenceRate: "Pematuhan Geofens", complianceAlertResolution: "Kadar Penyelesaian Amaran",
    complianceOnlineRate: "Kadar Dalam Talian",
  },
  zh: {
    title: "地理定位", dashboard: "地理定位仪表板", liveTracking: "实时追踪",
    geofences: "地理围栏", alerts: "位置警报", history: "位置历史",
    analytics: "地理定位分析", settings: "地理定位设置", activeTrackers: "活跃追踪器",
    pendingAlerts: "待处理警报", onlineWorkers: "在线工人", activeGeofences: "活跃地理围栏",
    trackingEnabled: "启用位置追踪", consentGiven: "追踪同意",
    updateFrequency: "更新频率（分钟）", privacyLevel: "隐私级别",
    privacyStandard: "标准", privacyHigh: "高", privacyMaximum: "最高",
    emergencyContacts: "紧急联系人", geofenceTypeWorksite: "工作地点",
    geofenceTypeRestricted: "限制区域", geofenceTypeAccommodation: "住宿",
    geofenceTypeCustom: "自定义", alertSeverityCritical: "严重", alertSeverityHigh: "高",
    alertSeverityMedium: "中", alertSeverityLow: "低", alertTypeUnauthorizedExit: "未经授权离开",
    alertTypeRestrictedEntry: "进入限制区域", alertTypeSos: "SOS 紧急",
    alertTypeOffline: "工人离线", alertTypeGeofenceViolation: "地理围栏违规",
    alertStatusOpen: "打开", alertStatusResolved: "已解决", alertStatusAcknowledged: "已确认",
    geofenceAlertOnExit: "离开时警报", geofenceAlertOnEntry: "进入时警报",
    historyExportCsv: "导出 CSV", liveTrackingRefresh: "刷新", geofenceCreate: "添加地理围栏",
    geofenceDelete: "删除地理围栏", geofenceToggleActive: "激活", geofenceToggleInactive: "停用",
    settingsSave: "保存更改", alertAcknowledge: "确认", alertResolve: "解决",
    alertFilterAll: "全部", alertFilterUnresolved: "未解决", alertFilterResolved: "已解决",
    deviceBattery: "电池", deviceSignal: "信号", deviceAccuracy: "精度",
    locationCoordinates: "坐标", locationTimestamp: "时间戳", locationSource: "来源",
    complianceGeofenceRate: "地理围栏合规率", complianceAlertResolution: "警报解决率",
    complianceOnlineRate: "在线率",
  },
  es: {
    title: "Geolocalización", dashboard: "Panel de geolocalización", liveTracking: "Seguimiento en vivo",
    geofences: "Geocercas", alerts: "Alertas de ubicación", history: "Historial de ubicación",
    analytics: "Análisis de geolocalización", settings: "Configuración de geolocalización", activeTrackers: "Rastreadores activos",
    pendingAlerts: "Alertas pendientes", onlineWorkers: "Trabajadores en línea", activeGeofences: "Geocercas activas",
    trackingEnabled: "Habilitar seguimiento de ubicación", consentGiven: "Consentimiento de seguimiento",
    updateFrequency: "Frecuencia de actualización (minutos)", privacyLevel: "Nivel de privacidad",
    privacyStandard: "Estándar", privacyHigh: "Alto", privacyMaximum: "Máximo",
    emergencyContacts: "Contactos de emergencia", geofenceTypeWorksite: "Lugar de trabajo",
    geofenceTypeRestricted: "Restringido", geofenceTypeAccommodation: "Alojamiento",
    geofenceTypeCustom: "Personalizado", alertSeverityCritical: "Crítico", alertSeverityHigh: "Alto",
    alertSeverityMedium: "Medio", alertSeverityLow: "Bajo", alertTypeUnauthorizedExit: "Salida no autorizada",
    alertTypeRestrictedEntry: "Entrada restringida", alertTypeSos: "Emergencia SOS",
    alertTypeOffline: "Trabajador sin conexión", alertTypeGeofenceViolation: "Violación de geocerca",
    alertStatusOpen: "Abierto", alertStatusResolved: "Resuelto", alertStatusAcknowledged: "Reconocido",
    geofenceAlertOnExit: "Alerta al salir", geofenceAlertOnEntry: "Alerta al entrar",
    historyExportCsv: "Exportar CSV", liveTrackingRefresh: "Actualizar", geofenceCreate: "Añadir geocerca",
    geofenceDelete: "Eliminar geocerca", geofenceToggleActive: "Activar", geofenceToggleInactive: "Desactivar",
    settingsSave: "Guardar cambios", alertAcknowledge: "Reconocer", alertResolve: "Resolver",
    alertFilterAll: "Todos", alertFilterUnresolved: "Sin resolver", alertFilterResolved: "Resueltos",
    deviceBattery: "Batería", deviceSignal: "Señal", deviceAccuracy: "Precisión",
    locationCoordinates: "Coordenadas", locationTimestamp: "Marca de tiempo", locationSource: "Fuente",
    complianceGeofenceRate: "Cumplimiento de geocerca", complianceAlertResolution: "Tasa de resolución de alertas",
    complianceOnlineRate: "Tasa en línea",
  },
  id: {
    title: "Geolokasi", dashboard: "Dasbor Geolokasi", liveTracking: "Pelacakan Langsung",
    geofences: "Geofence", alerts: "Peringatan Lokasi", history: "Riwayat Lokasi",
    analytics: "Analitik Geolokasi", settings: "Pengaturan Geolokasi", activeTrackers: "Pelacak Aktif",
    pendingAlerts: "Peringatan Tertunda", onlineWorkers: "Pekerja Online", activeGeofences: "Geofence Aktif",
    trackingEnabled: "Aktifkan Pelacakan Lokasi", consentGiven: "Persetujuan Pelacakan",
    updateFrequency: "Frekuensi Pembaruan (menit)", privacyLevel: "Tingkat Privasi",
    privacyStandard: "Standar", privacyHigh: "Tinggi", privacyMaximum: "Maksimum",
    emergencyContacts: "Kontak Darurat", geofenceTypeWorksite: "Lokasi Kerja",
    geofenceTypeRestricted: "Terbatas", geofenceTypeAccommodation: "Akomodasi",
    geofenceTypeCustom: "Kustom", alertSeverityCritical: "Kritis", alertSeverityHigh: "Tinggi",
    alertSeverityMedium: "Sedang", alertSeverityLow: "Rendah", alertTypeUnauthorizedExit: "Keluar Tanpa Izin",
    alertTypeRestrictedEntry: "Masuk Terbatas", alertTypeSos: "Darurat SOS",
    alertTypeOffline: "Pekerja Offline", alertTypeGeofenceViolation: "Pelanggaran Geofence",
    alertStatusOpen: "Terbuka", alertStatusResolved: "Selesai", alertStatusAcknowledged: "Diakui",
    geofenceAlertOnExit: "Peringatan Saat Keluar", geofenceAlertOnEntry: "Peringatan Saat Masuk",
    historyExportCsv: "Ekspor CSV", liveTrackingRefresh: "Segarkan", geofenceCreate: "Tambah Geofence",
    geofenceDelete: "Hapus Geofence", geofenceToggleActive: "Aktifkan", geofenceToggleInactive: "Nonaktifkan",
    settingsSave: "Simpan Perubahan", alertAcknowledge: "Akui", alertResolve: "Selesaikan",
    alertFilterAll: "Semua", alertFilterUnresolved: "Belum Selesai", alertFilterResolved: "Selesai",
    deviceBattery: "Baterai", deviceSignal: "Sinyal", deviceAccuracy: "Akurasi",
    locationCoordinates: "Koordinat", locationTimestamp: "Stempel Waktu", locationSource: "Sumber",
    complianceGeofenceRate: "Kepatuhan Geofence", complianceAlertResolution: "Tingkat Penyelesaian Peringatan",
    complianceOnlineRate: "Tingkat Online",
  },
  th: {
    title: "ตำแหน่งทางภูมิศาสตร์", dashboard: "แดชบอร์ดตำแหน่งทางภูมิศาสตร์", liveTracking: "ติดตามสด",
    geofences: "รั้วภูมิศาสตร์", alerts: "การแจ้งเตือนตำแหน่ง", history: "ประวัติตำแหน่ง",
    analytics: "การวิเคราะห์ตำแหน่งทางภูมิศาสตร์", settings: "การตั้งค่าตำแหน่งทางภูมิศาสตร์", activeTrackers: "เครื่องติดตามที่ใช้งาน",
    pendingAlerts: "การแจ้งเตือนที่รอ", onlineWorkers: "พนักงานออนไลน์", activeGeofences: "รั้วภูมิศาสตร์ที่ใช้งาน",
    trackingEnabled: "เปิดใช้งานการติดตามตำแหน่ง", consentGiven: "ความยินยอมในการติดตาม",
    updateFrequency: "ความถี่การอัปเดต (นาที)", privacyLevel: "ระดับความเป็นส่วนตัว",
    privacyStandard: "มาตรฐาน", privacyHigh: "สูง", privacyMaximum: "สูงสุด",
    emergencyContacts: "ผู้ติดต่อฉุกเฉิน", geofenceTypeWorksite: "สถานที่ทำงาน",
    geofenceTypeRestricted: "จำกัด", geofenceTypeAccommodation: "ที่พัก",
    geofenceTypeCustom: "กำหนดเอง", alertSeverityCritical: "วิกฤต", alertSeverityHigh: "สูง",
    alertSeverityMedium: "ปานกลาง", alertSeverityLow: "ต่ำ", alertTypeUnauthorizedExit: "ออกโดยไม่ได้รับอนุญาต",
    alertTypeRestrictedEntry: "เข้าพื้นที่จำกัด", alertTypeSos: "ฉุกเฉิน SOS",
    alertTypeOffline: "พนักงานออฟไลน์", alertTypeGeofenceViolation: "ละเมิดรั้วภูมิศาสตร์",
    alertStatusOpen: "เปิด", alertStatusResolved: "แก้ไขแล้ว", alertStatusAcknowledged: "รับทราบ",
    geofenceAlertOnExit: "แจ้งเตือนเมื่อออก", geofenceAlertOnEntry: "แจ้งเตือนเมื่อเข้า",
    historyExportCsv: "ส่งออก CSV", liveTrackingRefresh: "รีเฟรช", geofenceCreate: "เพิ่มรั้วภูมิศาสตร์",
    geofenceDelete: "ลบรั้วภูมิศาสตร์", geofenceToggleActive: "เปิดใช้งาน", geofenceToggleInactive: "ปิดใช้งาน",
    settingsSave: "บันทึกการเปลี่ยนแปลง", alertAcknowledge: "รับทราบ", alertResolve: "แก้ไข",
    alertFilterAll: "ทั้งหมด", alertFilterUnresolved: "ยังไม่แก้ไข", alertFilterResolved: "แก้ไขแล้ว",
    deviceBattery: "แบตเตอรี่", deviceSignal: "สัญญาณ", deviceAccuracy: "ความแม่นยำ",
    locationCoordinates: "พิกัด", locationTimestamp: "ประทับเวลา", locationSource: "แหล่งที่มา",
    complianceGeofenceRate: "อัตราการปฏิบัติตามรั้วภูมิศาสตร์", complianceAlertResolution: "อัตราการแก้ไขการแจ้งเตือน",
    complianceOnlineRate: "อัตราออนไลน์",
  },
  ph: {
    title: "Geolocation", dashboard: "Dashboard ng Geolocation", liveTracking: "Live Tracking",
    geofences: "Geofences", alerts: "Mga Alerto sa Lokasyon", history: "Kasaysayan ng Lokasyon",
    analytics: "Analytics ng Geolocation", settings: "Mga Setting ng Geolocation", activeTrackers: "Mga Aktibong Tracker",
    pendingAlerts: "Mga Nakabinbing Alerto", onlineWorkers: "Mga Online na Manggagawa", activeGeofences: "Mga Aktibong Geofence",
    trackingEnabled: "Paganahin ang Pagsubaybay sa Lokasyon", consentGiven: "Pahintulot sa Pagsubaybay",
    updateFrequency: "Dalas ng Update (minuto)", privacyLevel: "Antas ng Privacy",
    privacyStandard: "Standard", privacyHigh: "Mataas", privacyMaximum: "Pinakamataas",
    emergencyContacts: "Mga Emergency Contact", geofenceTypeWorksite: "Lugar ng Trabaho",
    geofenceTypeRestricted: "Pinaghihigpitan", geofenceTypeAccommodation: "Tirahan",
    geofenceTypeCustom: "Kustom", alertSeverityCritical: "Kritikal", alertSeverityHigh: "Mataas",
    alertSeverityMedium: "Katamtaman", alertSeverityLow: "Mababa", alertTypeUnauthorizedExit: "Hindi Awtorisadong Paglabas",
    alertTypeRestrictedEntry: "Pinaghihigpitang Pagpasok", alertTypeSos: "Emergency SOS",
    alertTypeOffline: "Offline na Manggagawa", alertTypeGeofenceViolation: "Paglabag sa Geofence",
    alertStatusOpen: "Bukas", alertStatusResolved: "Nalutas", alertStatusAcknowledged: "Kinilala",
    geofenceAlertOnExit: "Alerto Kapag Lumabas", geofenceAlertOnEntry: "Alerto Kapag Pumasok",
    historyExportCsv: "I-export ang CSV", liveTrackingRefresh: "I-refresh", geofenceCreate: "Magdagdag ng Geofence",
    geofenceDelete: "Tanggalin ang Geofence", geofenceToggleActive: "I-activate", geofenceToggleInactive: "I-deactivate",
    settingsSave: "I-save ang Mga Pagbabago", alertAcknowledge: "Kilalanin", alertResolve: "Lutasin",
    alertFilterAll: "Lahat", alertFilterUnresolved: "Hindi Nalutas", alertFilterResolved: "Nalutas",
    deviceBattery: "Baterya", deviceSignal: "Signal", deviceAccuracy: "Katumpakan",
    locationCoordinates: "Mga Coordinate", locationTimestamp: "Timestamp", locationSource: "Pinagmulan",
    complianceGeofenceRate: "Rate ng Pagsunod sa Geofence", complianceAlertResolution: "Rate ng Pagresolba ng Alerto",
    complianceOnlineRate: "Rate ng Online",
  },
  vt: {
    title: "Định vị", dashboard: "Bảng điều khiển định vị", liveTracking: "Theo dõi trực tiếp",
    geofences: "Hàng rào địa lý", alerts: "Cảnh báo vị trí", history: "Lịch sử vị trí",
    analytics: "Phân tích định vị", settings: "Cài đặt định vị", activeTrackers: "Thiết bị theo dõi đang hoạt động",
    pendingAlerts: "Cảnh báo đang chờ", onlineWorkers: "Công nhân trực tuyến", activeGeofences: "Hàng rào địa lý đang hoạt động",
    trackingEnabled: "Bật theo dõi vị trí", consentGiven: "Đồng ý theo dõi",
    updateFrequency: "Tần suất cập nhật (phút)", privacyLevel: "Mức độ riêng tư",
    privacyStandard: "Tiêu chuẩn", privacyHigh: "Cao", privacyMaximum: "Tối đa",
    emergencyContacts: "Liên hệ khẩn cấp", geofenceTypeWorksite: "Nơi làm việc",
    geofenceTypeRestricted: "Hạn chế", geofenceTypeAccommodation: "Chỗ ở",
    geofenceTypeCustom: "Tùy chỉnh", alertSeverityCritical: "Nghiêm trọng", alertSeverityHigh: "Cao",
    alertSeverityMedium: "Trung bình", alertSeverityLow: "Thấp", alertTypeUnauthorizedExit: "Ra ngoài trái phép",
    alertTypeRestrictedEntry: "Vào khu vực hạn chế", alertTypeSos: "Khẩn cấp SOS",
    alertTypeOffline: "Công nhân ngoại tuyến", alertTypeGeofenceViolation: "Vi phạm hàng rào địa lý",
    alertStatusOpen: "Mở", alertStatusResolved: "Đã giải quyết", alertStatusAcknowledged: "Đã xác nhận",
    geofenceAlertOnExit: "Cảnh báo khi ra", geofenceAlertOnEntry: "Cảnh báo khi vào",
    historyExportCsv: "Xuất CSV", liveTrackingRefresh: "Làm mới", geofenceCreate: "Thêm hàng rào địa lý",
    geofenceDelete: "Xóa hàng rào địa lý", geofenceToggleActive: "Kích hoạt", geofenceToggleInactive: "Vô hiệu hóa",
    settingsSave: "Lưu thay đổi", alertAcknowledge: "Xác nhận", alertResolve: "Giải quyết",
    alertFilterAll: "Tất cả", alertFilterUnresolved: "Chưa giải quyết", alertFilterResolved: "Đã giải quyết",
    deviceBattery: "Pin", deviceSignal: "Tín hiệu", deviceAccuracy: "Độ chính xác",
    locationCoordinates: "Tọa độ", locationTimestamp: "Thời gian", locationSource: "Nguồn",
    complianceGeofenceRate: "Tỷ lệ tuân thủ hàng rào địa lý", complianceAlertResolution: "Tỷ lệ giải quyết cảnh báo",
    complianceOnlineRate: "Tỷ lệ trực tuyến",
  },
  ar: {
    title: "تحديد المواقع", dashboard: "لوحة تحكم تحديد المواقع", liveTracking: "تتبع مباشر",
    geofences: "الأسوار الجغرافية", alerts: "تنبيهات الموقع", history: "سجل المواقع",
    analytics: "تحليلات تحديد المواقع", settings: "إعدادات تحديد المواقع", activeTrackers: "أجهزة التتبع النشطة",
    pendingAlerts: "تنبيهات معلقة", onlineWorkers: "العمال المتصلون", activeGeofences: "أسوار جغرافية نشطة",
    trackingEnabled: "تفعيل تتبع الموقع", consentGiven: "موافقة التتبع",
    updateFrequency: "تكرار التحديث (دقائق)", privacyLevel: "مستوى الخصوصية",
    privacyStandard: "قياسي", privacyHigh: "مرتفع", privacyMaximum: "أقصى",
    emergencyContacts: "جهات الاتصال للطوارئ", geofenceTypeWorksite: "موقع العمل",
    geofenceTypeRestricted: "مقيد", geofenceTypeAccommodation: "السكن",
    geofenceTypeCustom: "مخصص", alertSeverityCritical: "حرج", alertSeverityHigh: "مرتفع",
    alertSeverityMedium: "متوسط", alertSeverityLow: "منخفض", alertTypeUnauthorizedExit: "خروج غير مصرح به",
    alertTypeRestrictedEntry: "دخول مقيد", alertTypeSos: "طوارئ SOS",
    alertTypeOffline: "عامل غير متصل", alertTypeGeofenceViolation: "انتهاك السياج الجغرافي",
    alertStatusOpen: "مفتوح", alertStatusResolved: "تم الحل", alertStatusAcknowledged: "تم الإقرار",
    geofenceAlertOnExit: "تنبيه عند الخروج", geofenceAlertOnEntry: "تنبيه عند الدخول",
    historyExportCsv: "تصدير CSV", liveTrackingRefresh: "تحديث", geofenceCreate: "إضافة سياج جغرافي",
    geofenceDelete: "حذف السياج الجغرافي", geofenceToggleActive: "تفعيل", geofenceToggleInactive: "تعطيل",
    settingsSave: "حفظ التغييرات", alertAcknowledge: "إقرار", alertResolve: "حل",
    alertFilterAll: "الكل", alertFilterUnresolved: "غير محلول", alertFilterResolved: "محلول",
    deviceBattery: "البطارية", deviceSignal: "الإشارة", deviceAccuracy: "الدقة",
    locationCoordinates: "الإحداثيات", locationTimestamp: "الطابع الزمني", locationSource: "المصدر",
    complianceGeofenceRate: "معدل الامتثال للسياج الجغرافي", complianceAlertResolution: "معدل حل التنبيهات",
    complianceOnlineRate: "معدل الاتصال",
  },
};

// ── 2. bn/ne key mapping: snake_case variants in bn/ne → camelCase en keys ──
function toCamel(s) {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function buildMappedFlat(src) {
  const flat = flatten(src);
  const mapped = {};
  for (const [key, value] of Object.entries(flat)) {
    const camel = key.split(".").map(toCamel).join(".");
    mapped[camel] = value;
  }
  return mapped;
}

const MAIN_LOCALES = ["ms", "zh", "es", "id", "th", "ph", "vt", "ar"];
const BN_NE = ["bn", "ne"];

for (const locale of MAIN_LOCALES) {
  const file = join(DIR, locale, "common.json");
  const current = JSON.parse(readFileSync(file, "utf8"));
  const geo = GEOLOCATION[locale] || {};
  const merged = deepMerge(EN, current);
  // Override geolocation with real translations
  merged.geolocation = { ...(EN.geolocation || {}), ...(merged.geolocation || {}), ...geo };
  writeFileSync(file, JSON.stringify(merged, null, 2) + "\n");
  console.log(`Aligned [${locale}] — merged en keys + translated geolocation (${Object.keys(geo).length} keys)`);
}

for (const locale of BN_NE) {
  const file = join(DIR, locale, "common.json");
  const current = JSON.parse(readFileSync(file, "utf8"));
  const srcFlat = buildMappedFlat(current);

  const outFlat = {};
  for (const [key, enValue] of Object.entries(enFlat)) {
    // Prefer existing bn/ne translation where available
    outFlat[key] = srcFlat[key] ?? enValue;
  }
  // Keep extra bn/ne keys that don't exist in en as-is (preserve richness)
  for (const [key, value] of Object.entries(srcFlat)) {
    if (!(key in outFlat)) outFlat[key] = value;
  }

  const rebuilt = unflatten(outFlat);
  // Ensure section ordering matches en where possible
  writeFileSync(file, JSON.stringify(rebuilt, null, 2) + "\n");
  console.log(`Rebuilt [${locale}] — canonical en schema with existing translations preserved (${Object.keys(outFlat).length} keys)`);
}

// ── Verify ──
console.log("\n── Verification ──");
for (const locale of [...MAIN_LOCALES, ...BN_NE, "en"]) {
  const t = flatten(JSON.parse(readFileSync(join(DIR, locale, "common.json"), "utf8")));
  const missing = Object.keys(enFlat).filter((k) => !(k in t));
  console.log(`[${locale}] keys=${Object.keys(t).length} missingFromEn=${missing.length}`);
}


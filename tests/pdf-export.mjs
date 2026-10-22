import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const htmlPath = path.join(root, "index.html");
const outputDir = path.join(root, "test-artifacts", "pdf");
await fs.mkdir(outputDir, { recursive: true });

const templates = ["executive", "minimal", "modern", "creative", "corporate", "academic", "technical", "elegant", "timeline", "ats"];
const profiles = [
  {
    key: "compact",
    name: "نگار احمدی",
    title: "کارشناس منابع انسانی",
    email: "negar.ahmadi@example.com",
    phone: "۰۹۱۲۱۲۳۴۵۶۷",
    location: "تهران",
    linkedin: "linkedin.com/in/negar-ahmadi",
    summary: "کارشناس منابع انسانی با تجربه جذب نیرو، هماهنگی فرایندهای استخدام و بهبود تجربه کارکنان. علاقه‌مند به تصمیم‌گیری مبتنی بر داده و ساخت محیط کاری سالم.",
    jobs: [{ role: "کارشناس منابع انسانی", company: "راهکار نوین", start: "۱۴۰۲", end: "اکنون", description: "• هماهنگی فرایند جذب و مصاحبه\n• نگهداری و به‌روزرسانی پرونده کارکنان\n• تهیه گزارش ماهانه استخدام و حضور و غیاب" }],
    education: [{ degree: "کارشناسی مدیریت", school: "دانشگاه تهران", start: "۱۳۹۷", end: "۱۴۰۱", details: "معدل ۱۷٫۸۰" }],
    skills: ["جذب و استخدام", "مصاحبه", "Excel", "ارتباطات"]
  },
  {
    key: "standard",
    name: "آرمان رضایی",
    title: "طراح محصول دیجیتال",
    email: "arman.rezaei@example.com",
    phone: "۰۹۳۵۱۲۳۴۵۶۷",
    location: "اصفهان",
    linkedin: "linkedin.com/in/arman-rezaei",
    summary: "طراح محصول با تمرکز بر پژوهش کاربر، معماری اطلاعات و طراحی رابط‌های دسترس‌پذیر. در پروژه‌های چندتخصصی از کشف مسئله تا تحویل نهایی محصول همکاری کرده‌ام و تصمیم‌ها را با شواهد پژوهشی و داده‌های رفتاری پشتیبانی می‌کنم.",
    jobs: [
      { role: "طراح محصول ارشد", company: "راهکار دیجیتال سپهر", start: "۱۴۰۲", end: "اکنون", description: "• طراحی جریان‌های اصلی کاربر برای محصول وب و موبایل\n• اجرای مصاحبه با کاربران و تبدیل یافته‌ها به نیازمندی‌های قابل اجرا\n• همکاری روزانه با تیم محصول، توسعه و تحلیل داده\n• بازبینی شاخص‌های استفاده و پیشنهاد بهبودهای مرحله‌ای" },
      { role: "طراح تجربه کاربری", company: "استودیو مسیر", start: "۱۴۰۰", end: "۱۴۰۲", description: "• ساخت وایرفریم و نمونه تعاملی برای آزمون کاربردپذیری\n• تدوین کتابخانه اجزای رابط و مستندات طراحی\n• بهبود دسترس‌پذیری فرم‌ها و مسیرهای ثبت‌نام" },
      { role: "طراح رابط کاربری", company: "فناوران آبی", start: "۱۳۹۸", end: "۱۴۰۰", description: "• طراحی صفحات بازاریابی و پنل‌های مدیریتی\n• هماهنگی با توسعه‌دهندگان برای تحویل دقیق طرح‌ها" }
    ],
    education: [
      { degree: "کارشناسی طراحی صنعتی", school: "دانشگاه هنر اصفهان", start: "۱۳۹۴", end: "۱۳۹۸", details: "پروژه پایانی: طراحی خدمات دیجیتال" },
      { degree: "دوره تخصصی پژوهش تجربه کاربر", school: "مرکز آموزش طراحی", start: "۱۴۰۱", end: "۱۴۰۱", details: "مصاحبه، آزمون کاربردپذیری و تحلیل یافته‌ها" }
    ],
    skills: ["Figma", "پژوهش کاربر", "طراحی سیستم", "نمونه‌سازی", "دسترس‌پذیری", "تحلیل داده"]
  },
  {
    key: "long",
    name: "سارا محمدی",
    title: "مدیر پروژه و تحلیلگر کسب‌وکار",
    email: "sara.mohammadi@example.com",
    phone: "۰۹۱۷۱۲۳۴۵۶۷",
    location: "شیراز",
    linkedin: "linkedin.com/in/sara-mohammadi",
    summary: "مدیر پروژه و تحلیلگر کسب‌وکار با بیش از هشت سال تجربه در هدایت پروژه‌های نرم‌افزاری، تحلیل فرایندهای سازمانی، مدیریت ذی‌نفعان و هماهنگی تیم‌های میان‌رشته‌ای. توانمند در تبدیل اهداف کلان به برنامه اجرایی، تعریف شاخص‌های سنجش، مدیریت ریسک و گزارش‌دهی شفاف به مدیران. در پروژه‌های تحول دیجیتال تلاش کرده‌ام کیفیت تحویل، تجربه مشتری و بهره‌وری تیم را هم‌زمان ارتقا دهم.",
    jobs: [
      { role: "مدیر پروژه ارشد", company: "گروه فناوری آفتاب", start: "۱۴۰۳", end: "اکنون", description: "• برنامه‌ریزی نقشه راه پروژه و تبدیل اهداف کسب‌وکار به محدوده، زمان‌بندی و معیارهای پذیرش روشن\n• هدایت جلسات هفتگی با ذی‌نفعان و ثبت تصمیم‌ها، وابستگی‌ها و اقدامات بعدی\n• مدیریت ریسک‌ها و موانع اجرایی و ارائه گزینه‌های جایگزین برای حفظ زمان تحویل\n• تدوین داشبورد وضعیت پروژه و گزارش دوره‌ای پیشرفت، هزینه، کیفیت و رضایت کاربران\n• هماهنگی بین تیم‌های محصول، طراحی، توسعه، تضمین کیفیت و پشتیبانی" },
      { role: "تحلیلگر ارشد کسب‌وکار", company: "سامانه‌پردازان پارس", start: "۱۴۰۱", end: "۱۴۰۳", description: "• برگزاری کارگاه کشف نیازمندی و مستندسازی فرایندهای موجود و مطلوب\n• نگارش سناریوهای کاربری، معیارهای پذیرش و مستندات تحلیل برای تیم توسعه\n• تحلیل داده‌های عملیاتی و شناسایی گلوگاه‌هایی که موجب افزایش زمان پاسخ می‌شدند\n• همکاری با تیم کنترل کیفیت برای طراحی سناریوهای آزمون و بررسی پوشش نیازمندی‌ها\n• ارائه پیشنهادهای بهبود مبتنی بر داده و پیگیری نتایج پس از استقرار" },
      { role: "کارشناس برنامه‌ریزی پروژه", company: "پیشرو سیستم", start: "۱۳۹۹", end: "۱۴۰۱", description: "• تهیه برنامه زمان‌بندی و پیگیری نقاط عطف و وابستگی‌های بین تیمی\n• ثبت تغییرات محدوده و ارزیابی اثر آن‌ها بر زمان و منابع پروژه\n• آماده‌سازی صورت‌جلسه، گزارش وضعیت و مستندات تحویل\n• هماهنگی فعالیت‌های پیمانکاران و بررسی انطباق خروجی‌ها با قرارداد" },
      { role: "کارشناس عملیات", company: "راهکار هوشمند", start: "۱۳۹۷", end: "۱۳۹۹", description: "• پایش شاخص‌های عملکردی و تهیه گزارش‌های مدیریتی\n• بررسی شکایت‌های مشتریان و پیشنهاد اصلاح مراحل پاسخ‌گویی\n• مستندسازی رویه‌های پرتکرار و آموزش اعضای تازه‌وارد تیم" },
      { role: "دستیار تحلیل کسب‌وکار", company: "داده‌نگار", start: "۱۳۹۶", end: "۱۳۹۷", description: "• جمع‌آوری داده‌های اولیه و بررسی کیفیت و کامل بودن اطلاعات\n• تهیه نمودارهای ساده برای جلسات تصمیم‌گیری\n• همکاری در مستندسازی نیازمندی‌ها و ثبت بازخورد کاربران" },
      { role: "هماهنگ‌کننده پروژه", company: "نگاه نو", start: "۱۳۹۵", end: "۱۳۹۶", description: "• تنظیم برنامه جلسات، ثبت تصمیم‌ها و پیگیری اقدامات باز\n• هماهنگی دریافت محتوا و فایل‌ها از تیم‌های مختلف\n• آماده‌سازی گزارش پیشرفت هفتگی برای مدیر پروژه" },
      { role: "کارآموز تحلیل سیستم", company: "مرکز توسعه فناوری", start: "۱۳۹۴", end: "۱۳۹۵", description: "• بررسی مستندات سامانه و تهیه فهرست نیازمندی‌های اولیه\n• اجرای آزمون‌های پذیرش تحت نظارت تحلیلگر ارشد\n• ثبت ایرادها و پیگیری اصلاح آن‌ها تا تأیید نهایی" }
    ],
    education: [
      { degree: "کارشناسی ارشد مدیریت فناوری اطلاعات", school: "دانشگاه شیراز", start: "۱۳۹۸", end: "۱۴۰۰", details: "پایان‌نامه درباره موفقیت پروژه‌های تحول دیجیتال" },
      { degree: "کارشناسی مهندسی صنایع", school: "دانشگاه صنعتی اصفهان", start: "۱۳۹۰", end: "۱۳۹۴", details: "گرایش برنامه‌ریزی و تحلیل سیستم‌ها" }
    ],
    skills: ["مدیریت پروژه", "تحلیل کسب‌وکار", "مدیریت ریسک", "مستندسازی", "Excel", "SQL", "Jira", "گزارش‌دهی", "مدیریت ذی‌نفعان", "بهبود فرایند"]
  }
];

const browser = await chromium.launch({ headless: true });
const results = [];
const failures = [];
try {
  for (const profile of profiles) {
    for (const template of templates) {
      const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
      const pageErrors = [];
      page.on("pageerror", error => pageErrors.push(error.message));
      await page.goto("file://" + htmlPath, { waitUntil: "domcontentloaded" });
      await page.evaluate(() => { try { localStorage.clear(); } catch {} });
      await page.reload({ waitUntil: "domcontentloaded" });

      const setValueFromLocator = async (locator, value) => locator.evaluate((el, v) => {
        el.value = v;
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
      }, value);
      const setValue = async (selector, value) => setValueFromLocator(page.locator(selector), value);
      for (const field of ["name", "title", "email", "phone", "location", "linkedin", "summary"]) {
        await setValue("#" + field, profile[field]);
      }
      await setValue("#languages", "فارسی (زبان مادری)؛ انگلیسی (پیشرفته)؛ عربی (مقدماتی)");
      await setValue("#certificates", "مدیریت حرفه‌ای پروژه · ۱۴۰۲\\nتحلیل داده و گزارش‌دهی · ۱۴۰۱\\nارتباط مؤثر و مذاکره · ۱۴۰۰");
      await setValue("#projects", "پروژه بازطراحی فرایندهای سازمانی: تحلیل وضعیت موجود، مصاحبه با ذی‌نفعان، تدوین نقشه راه و تعریف شاخص‌های سنجش موفقیت.\\nپروژه داشبورد مدیریتی: تجمیع داده‌های عملیاتی و طراحی گزارش‌های دوره‌ای برای پشتیبانی از تصمیم‌گیری.");
      await setValue("#awards", "کارمند برتر تیم پروژه · ۱۴۰۲\\nتقدیر بابت بهبود فرایند پاسخ‌گویی · ۱۴۰۱");
      await setValue("#website", "https://portfolio.example.com");
      await page.evaluate(({ jobs, education, skills }) => {
        while (document.querySelectorAll("#experienceList .entry").length < jobs) addExp();
        while (document.querySelectorAll("#educationList .entry").length < education) addEdu();
        while (document.querySelectorAll("#skillsList .skill").length < skills) addSkill();
      }, { jobs: profile.jobs.length, education: profile.education.length, skills: profile.skills.length });
      const jobEntries = page.locator("#experienceList .entry");
      for (let i = 0; i < profile.jobs.length; i++) {
        const job = profile.jobs[i], entry = jobEntries.nth(i);
        for (const field of ["role", "company", "start", "end", "description"]) await setValueFromLocator(entry.locator('[data-k="' + field + '"]'), job[field]);
      }
      const eduEntries = page.locator("#educationList .entry");
      for (let i = 0; i < profile.education.length; i++) {
        const edu = profile.education[i], entry = eduEntries.nth(i);
        for (const field of ["degree", "school", "start", "end", "details"]) await setValueFromLocator(entry.locator('[data-k="' + field + '"]'), edu[field]);
      }
      const skillRows = page.locator("#skillsList .skill");
      for (let i = 0; i < profile.skills.length; i++) await setValueFromLocator(skillRows.nth(i).locator('[data-k="skill"]'), profile.skills[i]);
      await page.evaluate(id => chooseTemplate(id), template);
      await page.evaluate(() => document.fonts.ready);
      await page.emulateMedia({ media: "print" });
      const pdf = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
      const pdfPath = path.join(outputDir, profile.key + "-" + template + ".pdf");
      await fs.writeFile(pdfPath, pdf);
      const parsed = await pdfjs.getDocument({ data: new Uint8Array(pdf) }).promise;
      let extracted = "";
      const pageTexts = [];
      for (let n = 1; n <= parsed.numPages; n++) {
        const pg = await parsed.getPage(n);
        const content = await pg.getTextContent();
        const pageText = content.items.map(item => item.str || "").join(" ").trim();
        pageTexts.push(pageText);
        extracted += pageText + " ";
      }
      const row = { profile: profile.key, template, pages: parsed.numPages, bytes: pdf.length, hasPersianText: /[\u0600-\u06FF]/.test(extracted), lastPageTextLength: pageTexts.at(-1)?.length || 0, file: path.relative(root, pdfPath) };
      results.push(row);
      try {
        assert.ok(pdf.length > 5000, "PDF output unexpectedly small");
        assert.ok(parsed.numPages >= 1, "PDF should contain at least one page");
        assert.ok(row.hasPersianText, "Extracted PDF text should contain Persian/Arabic Unicode");
        if (profile.key === "long") {
          assert.ok(parsed.numPages >= 2, "Long resume should span multiple pages");
          assert.ok(row.lastPageTextLength >= 100, "Long resume should not end with a nearly empty orphan page");
        }
        assert.deepEqual(pageErrors, [], "Browser JavaScript errors detected");
        console.log("PASS", JSON.stringify(row));
      } catch (error) {
        failures.push({ ...row, error: error.message, pageErrors });
        console.error("FAIL", JSON.stringify(failures.at(-1)));
      }
      await parsed.destroy();
      await page.close();
    }
  }
} finally {
  await browser.close();
}
await fs.writeFile(path.join(root, "test-artifacts", "pdf", "results.json"), JSON.stringify({ total: results.length, passed: results.length - failures.length, failed: failures.length, results, failures }, null, 2));
console.log(JSON.stringify({ total: results.length, passed: results.length - failures.length, failed: failures.length }));
if (failures.length) process.exitCode = 1;

<template>
  <v-sheet class="pa-6 text-center glass-card" elevation="3" width="100%">
    <p class="text-h4 font-weight-bold mb-4 glass-text">نکات امنیتی</p>

    <p class="text-body-1 mb-2 glass-text">
      <strong>ایمنو</strong> یک ابزار حرفه‌ای برای ذخیره و مدیریت
      <strong>نام کاربری و رمزهای اپلیکیشن‌ها</strong> است که
      <strong>تمام داده‌ها تنها روی دستگاه شما ذخیره می‌شوند</strong>. به همین دلیل،
      <strong>پس از رفرش یا ترک صفحه</strong>، برای محافظت از اطلاعاتتان لازم است دوباره نام کاربری
      و رمز عبور خود را وارد کنید.
    </p>

    <p class="text-body-1 mb-2 glass-text">
      حفظ حریم خصوصی و امنیت شما اولویت اصلی است. بنابراین، مسئولیت یادآوری
      <strong>نام کاربری و رمز عبور</strong> کاملاً بر عهده شما است. بدون داشتن این اطلاعات،
      <strong>بازگرداندن داده‌ها غیرممکن خواهد بود</strong>.
    </p>
    <p class="text-body-1 mb-2 glass-text">
      با هر بار ایجاد یا ویرایش یک فایل، نسخه‌ی جدید به‌صورت خودکار تولید شده و دانلود می‌شود. برای
      سهولت در مدیریت و جلوگیری از انباشت فایل‌ها، لطفاً پس از دریافت نسخه‌ی جدید، فایل‌های قبلی را
      حذف کنید.
    </p>

    <p class="text-body-1 mb-2 glass-text">
      لطفاً دقت کنید که فایل‌های ذخیره شده در حافظه دستگاه شما هستند و
      <strong>در هیچ سرور یا فضای ابری ذخیره نمی‌شوند</strong>. هرگونه حذف فایل‌ها یا تغییر در حافظه
      دستگاه ممکن است باعث از دست رفتن داده‌ها شود.
    </p>

    <p class="text-body-1 mb-2 glass-text">
      برای امنیت بیشتر، توصیه می‌شود رمزها و نام‌های کاربری خود را در جای امن نگه دارید و از دسترسی
      افراد غیرمجاز به دستگاه خود جلوگیری کنید. همچنین، به یاد داشته باشید که داده‌ها پس از خروج یا
      رفرش صفحه
      <strong>پاک نمی‌شوند، اما برای ورود بعدی نیازمند اطلاعات ورود هستند</strong>.
    </p>
  </v-sheet>
</template>

<style scoped>
/* Glassy card effect */
.glass-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* Glassy animated text with softer colors */
.glass-text {
  background: linear-gradient(
    270deg,
    rgba(255, 255, 255, 0.8),
    rgba(160, 233, 255, 0.5),
    rgba(255, 255, 255, 0.8),
    rgba(160, 233, 255, 0.5)
  );
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: glassTextAnimation 4s ease infinite;
}

@keyframes glassTextAnimation {
  0% {
    background-position: 0% 100%;
  }
  50% {
    background-position: 100% 0%;
  }
  100% {
    background-position: 0% 100%;
  }
}
</style>

# Reem Manager Pro

نسخة احترافية أولى لإدارة محلات الشحن الإلكتروني والاشتراكات.

## التشغيل

```bash
npm install
npm run dev
```

## إعداد Supabase

1. أنشئ مشروعًا في Supabase.
2. افتح SQL Editor.
3. شغّل الملف `database/schema.sql`.
4. انسخ Project URL و anon key.
5. أنشئ ملف `.env.local` وضع:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## الصفحات

- `/login` تسجيل الدخول
- `/onboarding` إعداد المحل
- `/dashboard` لوحة التحكم
- `/customers` الزبائن
- `/services` الخدمات
- `/packages` الباقات
- `/orders` الطلبات
- `/debts` الديون
- `/reports` التقارير
- `/settings` الإعدادات

## النشر

ارفع المشروع إلى GitHub ثم انشره على Vercel، وأضف مفاتيح البيئة داخل Vercel.

# 🚀 Railway Deployment Guide

## 📋 خطوات الرفع على Railway

### 1. تجهيز المشروع ✅
- تم إضافة `railway.toml` للإعدادات
- تم إضافة `nixpacks.toml` للبناء
- تم إضافة `server.js` للـ Express
- تم تحديث `package.json` بالسكريبتات المطلوبة

### 2. رفع المشروع على Railway

**الطريقة الأولى: GitHub Integration**
1. ارفع المشروع على GitHub
2. في Railway: Connect → GitHub Repo
3. اختار الـ Repository
4. هيبني ويرفع تلقائي

**الطريقة الثانية: Direct Deployment**
1. في Railway: New Project → Deploy from GitHub
2. أو ارفع الملفات مباشرة

### 3. المتطلبات
- GitHub repo بالمشروع
- حساب Railway مجاني
- صورة Captain MoMasry في `public/captain-momasry.jpg`

### 4. بعد الرفع
- هيديك URL مثل: `momasry-production.up.railway.app`
- هيشتغل كـ Express server
- كل الميزات شغالة

### 5. ملاحظات هامة
- البيانات لسه في localStorage (هتضيع لما تعمل ريفرش)
- لو عايز قاعدة بيانات حقيقية، نضيف PostgreSQL من Railway
- الصورة لازم تكون موجودة قبل الرفع

## 🔧 إعدادات Railway

**Environment Variables:**
```
NODE_ENV=production
PORT=3000
```

**Build Command:**
```
npm run build
```

**Start Command:**
```
npm start
```

## 📱 بعد الرفع

الموقع هيشتغل على:
- Railway URL
- مع كل الميزات
- محسن للتابلت
- بالتصميم الداكن والنيون يلو

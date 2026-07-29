#!/bin/bash

# رابط الـ ngrok الجديد الخاص بك
API_URL="https://tetragonally-homotypic-armando.ngrok-free.dev/api"

echo "=============================================="
echo "🔄 جاري تحديث رابط الباك إند على Vercel..."
echo "=============================================="

# حذف الرابط القديم لتجنب التكرار
npx vercel env rm VITE_API_URL production -y 2>/dev/null || true
npx vercel env rm VITE_API_URL preview -y 2>/dev/null || true
npx vercel env rm VITE_API_URL development -y 2>/dev/null || true

# إضافة الرابط الجديد
npx vercel env add VITE_API_URL production "$API_URL"
npx vercel env add VITE_API_URL preview "$API_URL"
npx vercel env add VITE_API_URL development "$API_URL"

echo "=============================================="
echo "🚀 جاري إعادة نشر الموقع على Vercel (Redeploy)..."
echo "=============================================="
npx vercel --prod --yes

echo "=============================================="
echo "✅ تم التحديث والنشر بنجاح!"
echo "=============================================="

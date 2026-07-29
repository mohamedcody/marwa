#!/bin/bash

# ألوان للتنسيق في الطرفية
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}==================================================${NC}"
echo -e "${GREEN}      مشروع مطعم المروة - تشغيل الباك إند والفرونت إند      ${NC}"
echo -e "${BLUE}==================================================${NC}"

# التحقق من وجود ملف .env في الباك إند
if [ ! -f "backend/.env" ]; then
    echo -e "${RED}[خطأ] ملف backend/.env غير موجود! يرجى إنشاؤه أولاً.${NC}"
    exit 1
fi

# تحميل متغيرات البيئة من ملف backend/.env
echo -e "${YELLOW}[1/3] تحميل متغيرات البيئة...${NC}"
export $(grep -v '^#' backend/.env | xargs)
echo -e "${GREEN}تم تحميل متغيرات البيئة بنجاح!${NC}"
echo -e "منفذ خادم الباك إند (SERVER_PORT): ${GREEN}$SERVER_PORT${NC}"

# عرض الخيارات للمستخدم
echo -e "\n${YELLOW}اختر طريقة تشغيل المشروع:${NC}"
echo -e "1) تشغيل محلي بالكامل (باستخدام Maven و NPM)"
echo -e "2) تشغيل الباك إند عبر Docker والفرونت إند محلياً (NPM)"
echo -e "3) تشغيل الباك إند فقط (محلياً)"
echo -e "4) تشغيل الفرونت إند فقط (محلياً)"
read -p "أدخل رقم الاختيار (1-4): " OPTION

case $OPTION in
    1)
        echo -e "\n${YELLOW}[2/3] جاري تثبيت حزم الفرونت إند (npm install)...${NC}"
        cd project && npm install
        cd ..

        echo -e "\n${GREEN}[3/3] تشغيل الباك إند والفرونت إند معاً...${NC}"
        echo -e "${BLUE}سيتم تشغيل الخادمين وعرض السجلات (Logs) في نفس النافذة.${NC}"
        echo -e "${BLUE}اضغط Ctrl+C لإيقاف التشغيل.${NC}"
        
        # استخدام npx concurrently لتشغيل الأمرين معاً وعرض مخرجاتهما بشكل منظم
        npx concurrently \
          --names "Backend,Frontend" \
          --prefix-colors "blue,green" \
          "cd backend && mvn spring-boot:run" \
          "cd project && npm run dev"
        ;;
    2)
        echo -e "\n${YELLOW}[2/3] تشغيل الباك إند عبر Docker Compose...${NC}"
        cd backend
        docker-compose up --build -d
        cd ..
        echo -e "${GREEN}الباك إند يعمل الآن في الخلفية عبر Docker على المنفذ $SERVER_PORT!${NC}"

        echo -e "\n${YELLOW}[3/3] جاري تثبيت حزم الفرونت إند وتشغيلها...${NC}"
        cd project
        npm install
        npm run dev
        ;;
    3)
        echo -e "\n${GREEN}تشغيل الباك إند فقط محلياً...${NC}"
        cd backend && mvn spring-boot:run
        ;;
    4)
        echo -e "\n${GREEN}تشغيل الفرونت إند فقط محلياً...${NC}"
        cd project && npm install && npm run dev
        ;;
    *)
        echo -e "${RED}اختيار غير صالح!${NC}"
        exit 1
        ;;
esac

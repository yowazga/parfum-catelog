#!/bin/bash

echo "🚀 Starting Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📦 Building Backend...${NC}"
cd backend
./mvnw clean package -DskipTests
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Backend build failed!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Backend built successfully!${NC}"
cd ..

echo -e "${BLUE}📦 Building Frontend...${NC}"
cd frontend
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend build failed!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Frontend built successfully!${NC}"
cd ..

echo -e "${BLUE}📝 Committing build artifacts...${NC}"
git add .
git commit -m "🚀 Production build ready for deployment"

echo -e "${GREEN}🎉 Build completed successfully!${NC}"
echo -e "${YELLOW}📋 Next steps:${NC}"
echo -e "1. Push to GitHub: git push origin main"
echo -e "2. Deploy backend to Railway"
echo -e "3. Deploy frontend to Vercel"
echo -e "4. Update environment variables"

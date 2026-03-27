# GIAI ĐOẠN 1: Build (Xây dựng)
FROM node:20-alpine AS builder

# Thiết kế thư mục làm việc
WORKDIR /app

# Copy các file cấu hình package trước để tận dụng Docker Cache
COPY package*.json ./

# Cài đặt toàn bộ dependencies (bao gồm cả devDependencies để build)
RUN npm install

# Copy toàn bộ mã nguồn vào container
COPY . .

# Build dự án NestJS sang thư mục /dist
RUN npm run build

# GIAI ĐOẠN 2: Production (Vận hành)
FROM node:20-alpine AS handler

WORKDIR /app

# Chỉ copy file package.json
COPY package*.json ./

# Chỉ cài đặt các dependencies cần thiết cho việc chạy (loại bỏ devDependencies)
RUN npm install --only=production

# Copy thư mục đã build từ Giai đoạn 1 sang
COPY --from=builder /app/dist ./dist

# Mở port (thường là 3000 cho NestJS hoặc port bạn chọn cho Auth Service)
EXPOSE 3000

# Lệnh khởi chạy ứng dụng
CMD ["node", "dist/main"]

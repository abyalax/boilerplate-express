
---

# Cara Menjalankan Project

Pastikan sudah menginstal semua dependensi:

```bash
pnpm install
```

## Mode Development

Menjalankan server dengan hot reload (menggunakan `tsx watch`):

```bash
pnpm run dev
```

Server akan otomatis restart ketika ada perubahan di file `src/`.

## Build & Compile Project

1. **Compile TypeScript + alias path:**

   ```bash
   pnpm run compile
   ```

   Ini akan menghasilkan file JS di folder `build/`.

2. **Build menggunakan esbuild:**

   ```bash
   pnpm run build
   ```

   Output akan mengikuti konfigurasi di `esbuild.config.js`.

## Menjalankan Server Production

Setelah build selesai, jalankan server:

```bash
pnpm start
```

Ini akan mengeksekusi file `build/server.cjs`.

## Linting

Untuk memeriksa code style menggunakan ESLint:

```bash
pnpm run lint
```

---

## **Prisma Commands**

Gunakan perintah berikut untuk mengelola database dengan Prisma:

1. **Generate Prisma Client (ORM Types)**

   ```bash
   pnpm prisma generate
   ```

   Membuat ulang Prisma Client beserta tipe TypeScript dari schema `prisma/schema.prisma`.

2. **Create & Run Migration**

   ```bash
   pnpm prisma migrate dev
   ```

   Membuat file migration berdasarkan perubahan schema dan langsung menjalankannya ke database.

3. **Push Seed Data**

   ```bash
   pnpm seed
   ```

   Menjalankan script seeding (biasanya ada di `prisma/seed.ts` atau `src/common/infrastructure/database/seed.ts`) untuk mengisi data awal.

---

## **Struktur Proyek Express**

```
src/
├── common/
│   ├── http/
│   │   ├── exception.ts         # Custom error classes & utilities
│   │   ├── http.ts              # HTTP status codes atau helper response
│   │   ├── response.ts          # Standard response formatter
│   │   ├── router.ts            # Utility untuk routing modular
│   │
│   ├── infrastructure/
│   │   └── database/
│   │       ├── delete.ts        # Utility untuk reset / delete data
│   │       ├── prisma.ts        # Prisma client instance
│   │       ├── seed.ts          # Script untuk seeding database
│   │
│   └── middleware/
│       ├── auth.middleware.ts   # Middleware autentikasi JWT/session
│       ├── catch.middleware.ts  # Middleware penangkap error (global)
│       ├── handler.middleware.ts# Middleware finalizer response (format output)
│       ├── log.middleware.ts    # Logger request/response
│       ├── zod.middleware.ts    # Middleware validasi request pakai Zod
│
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts   # Logic endpoint auth
│   │   ├── auth.routes.ts       # Daftar route auth
│   │
│   ├── division/
│   │   ├── division.controller.ts
│   │   ├── division.routes.ts
│   │
│   ├── employee/
│   │   ├── employee.controller.ts
│   │   ├── employee.routes.ts
│   │
│   └── user/
│       ├── user.controller.ts
│       ├── user.routes.ts
│
├── index.ts                     # Entry point server (Express app)
└── routes.ts                    # Register seluruh module route
```

---

## **Pola Handler Seperti NestJS**

Controller cukup mengembalikan object, tanpa perlu memanggil `res.json()` manual. Middleware `handler.middleware.ts` akan:

* menangkap nilai return dari handler,
* membungkus ke format response standar,
* mengirim ke client.

**Contoh:**

```ts
export const createEmployee = async (req: Request) => {
  const employee = req.body;
  const created = await prisma.employee.create({ data: employee });
  return {
    message: "Success Create Employee",
    data: created,
  };
};
```

* **Controller fokus ke business logic** (mirip NestJS controller).
* **Middleware mengatur response & error handling**, jadi konsisten untuk semua endpoint.


Berikut dokumentasi versi lengkap setelah ditambahkan informasi tentang **tsx** dan skrip-skripnya:

---

## **Prisma Commands**

Gunakan perintah berikut untuk mengelola database dengan Prisma:

1. **Generate Prisma Client (ORM Types)**

   ```bash
   pnpm prisma generate
   ```

   Membuat ulang Prisma Client beserta tipe TypeScript dari schema `prisma/schema.prisma`.

2. **Create & Run Migration**

   ```bash
   pnpm prisma migrate dev
   ```

   Membuat file migration berdasarkan perubahan schema dan langsung menjalankannya ke database.

3. **Push Seed Data**

   ```bash
   pnpm seed
   ```

   Menjalankan script seeding (biasanya ada di `prisma/seed.ts` atau `src/common/infrastructure/database/seed.ts`) untuk mengisi data awal.

---

## **Scripts di package.json**

Berikut penjelasan masing-masing skrip:

```jsonc
"scripts": {
  "lint": "eslint .",                            // Jalankan ESLint
  "start": "node build/server.cjs",              // Jalankan server hasil build
  "dev": "npx tsx watch src/index.ts",           // Development mode (auto reload)
  "compile": "npx tsc && npx tsc-alias && node extension.js", // Compile TS + perbaiki alias
  "build": "node esbuild.config.js",             // Build pakai esbuild
  "seed": "npx tsx src/common/infrastructure/database/seed.ts", // Jalankan seed
  "delete": "npx tsx src/common/infrastructure/database/delete.ts", // Hapus data
  "test": "echo \"Error: no test specified\" && exit 1"           // Placeholder test
}
```

* **`dev`** → Jalankan app TypeScript langsung dengan reload otomatis.
* **`seed`** → Isi data awal ke database.
* **`delete`** → Reset / hapus data database.
* **`compile`** → Compile TS ke JS (CommonJS/ESM) dan sesuaikan import alias.
* **`build`** → Build project pakai esbuild.
* **`start`** → Jalankan hasil build.

---

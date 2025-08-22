# Tabungan Ku - Vue 3

Aplikasi tabungan berbasis web yang dibangun menggunakan Vue 3 + TypeScript dengan Firebase sebagai backend. Aplikasi ini memungkinkan pengguna untuk mengelola data member dan mencatat transaksi tabungan serta jimpitan.

## 🚀 Fitur Utama

- **Dashboard**: Ringkasan statistik tabungan dan aktivitas terbaru
- **Manajemen Member**: Tambah, edit, hapus, dan kelola data member
- **Transaksi**: Catat transaksi tabungan dan jimpitan
- **Authentication**: Login dengan username/password menggunakan Firebase Auth
- **Responsive Design**: UI yang responsif untuk desktop dan mobile

## 🛠️ Technology Stack

- **Frontend**: Vue 3 + TypeScript + Vite
- **UI Framework**: Tailwind CSS
- **Backend**: Firebase (Authentication + Firestore)
- **State Management**: Pinia
- **Testing**: Vitest + Vue Test Utils
- **Package Manager**: pnpm
- **Linting**: ESLint

## 📁 Struktur Project

```
src/
├── components/          # Komponen Vue yang dapat digunakan ulang
│   ├── AppLayout.vue    # Layout utama aplikasi
│   └── AppNavigation.vue # Komponen navigasi
├── views/              # Halaman-halaman utama
│   ├── LoginView.vue    # Halaman login
│   ├── DashboardView.vue # Dashboard utama
│   ├── MembersView.vue  # Kelola member
│   └── TransactionsView.vue # Kelola transaksi
├── stores/             # Pinia state management
│   ├── auth.ts         # Store untuk authentication
│   └── counter.ts      # Store contoh (dapat dihapus)
├── firebase/           # Konfigurasi Firebase
│   ├── config.ts       # Konfigurasi Firebase
│   └── auth.ts         # Service authentication
├── router/             # Vue Router configuration
└── assets/             # Asset statis (CSS, gambar)
```

## 🚀 Quick Start

### Prasyarat

- Node.js (^20.19.0 || >=22.12.0)
- pnpm (package manager)
- Firebase project

### Instalasi

1. Clone repository:

```bash
git clone <repository-url>
cd tabungan-ku-vue3
```

2. Install dependencies:

```bash
pnpm install
```

3. Setup environment variables:

```bash
cp .env.example .env
```

4. Edit `.env` dan isi dengan konfigurasi Firebase Anda:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

5. Jalankan development server:

```bash
pnpm dev
```

6. Buka browser dan akses `http://localhost:5173`

## 🔐 Authentication

Aplikasi menggunakan Firebase Authentication dengan format email khusus:

- Username yang diinput akan dikonversi ke format: `username@tabungan.app`
- Misalnya: username `admin` menjadi `admin@tabungan.app`

### Setup Firebase

1. Buat project Firebase di [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication dan pilih Email/Password provider
3. Enable Firestore Database
4. Tambahkan user di Authentication console dengan format email `username@tabungan.app`

## 📊 Data Structure

### Member

```typescript
interface Member {
  id: string
  name: string           // Nama member (unik per user)
  note: string           // Catatan tambahan
  savings: Saving[]      // Array transaksi tabungan
}
```

### Saving/Transaction

```typescript
interface Saving {
  date: string           // Tanggal (ISO format)
  bills: {
    tabungan: number     // Jumlah tabungan (IDR)
    jimpitan: number     // Jumlah jimpitan (IDR)
  }
}
```

## 🎨 UI/UX Features

- **Modern Design**: Menggunakan Tailwind CSS dengan desain yang clean
- **Loading States**: Animasi loading untuk semua operasi async
- **Alert System**: Notifikasi sukses/error yang responsif
- **Form Validation**: Validasi form di client-side
- **Responsive**: Mendukung desktop dan mobile device
- **Dark Mode Ready**: Struktur siap untuk implementasi dark mode

## 📱 Halaman-halaman

### 1. Login (`/login`)

- Form login dengan username/password
- Toggle visibility password
- Auto-redirect jika sudah login
- Error handling dengan pesan yang user-friendly

### 2. Dashboard (`/dashboard`)

- Statistik ringkasan (total member, tabungan, jimpitan)
- Aktivitas terbaru
- Quick access ke fitur utama
- Navigation menu

### 3. Member Management (`/members`)

- Daftar semua member dengan search
- Add/Edit/Delete member
- View detail member dan total tabungannya
- Modal form untuk input data

### 4. Transactions (`/transactions`)

- Daftar semua transaksi dengan filter
- Filter berdasarkan member dan periode
- Add/Edit/Delete transaksi
- Summary statistik per periode

## 🔒 Security & Best Practices

- **Route Guards**: Proteksi halaman yang memerlukan authentication
- **Type Safety**: Full TypeScript untuk type safety
- **Error Handling**: Proper error handling di semua level
- **Input Validation**: Validasi input di frontend dan backend
- **Security Rules**: Firebase security rules untuk data protection

## 🧪 Testing

```bash
# Run unit tests
pnpm test:unit

# Run tests in watch mode
pnpm test:unit --watch
```

## 🏗️ Build & Deployment

```bash
# Build untuk production
pnpm build

# Preview build hasil
pnpm preview

# Type checking
pnpm type-check

# Linting
pnpm lint
```

## 🔧 Development

### Menambah Fitur Baru

1. Buat interface TypeScript di file yang sesuai
2. Tambah/update Pinia store jika diperlukan
3. Buat komponen Vue dengan Composition API
4. Tambah route di `router/index.ts`
5. Update navigation jika perlu
6. Tulis test untuk fitur baru

### Code Style

- Gunakan Composition API dengan `<script setup>`
- Follow Vue 3 best practices
- Gunakan TypeScript secara konsisten
- Ikuti konvensi penamaan yang sudah ada
- Write self-documenting code dengan comment seperlunya

## 🐛 Troubleshooting

### Firebase Connection Issues

- Pastikan Firebase config sudah benar
- Check Firebase console untuk error logs
- Verify Firebase security rules

### Development Server Issues

- Restart development server: `pnpm dev`
- Clear cache: `rm -rf node_modules/.vite`
- Check port availability (default: 5173)

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

Jika ada pertanyaan atau issue, silakan buat issue di repository ini atau hubungi maintainer.

---

**Happy Coding! 🚀**

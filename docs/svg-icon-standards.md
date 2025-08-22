# SVG Icon Standards untuk Dashboard

## Ukuran Icon yang Konsisten

### 1. Stat Card Icons

- **Ukuran**: `h-6 w-6` (24x24px)
- **Warna**: `text-gray-400`
- **Konteks**: Icons untuk kartu statistik (Total Member, Tabungan, Jimpitan, dll)

### 2. Activity Timeline Icons  

- **Ukuran**: `h-6 w-6` (24x24px)
- **Warna**: `text-white` (pada background biru)
- **Container**: `h-10 w-10` rounded circle dengan `bg-blue-500`
- **Konteks**: Icons untuk timeline aktivitas terbaru

### 3. Empty State Illustration

- **Ukuran**: `h-12 w-12` (48x48px)
- **Warna**: `text-gray-400`
- **Konteks**: Icon besar sebagai ilustrasi saat tidak ada data

### 4. Button Icons

- **Ukuran**: `h-5 w-5` (20x20px)
- **Warna**: `text-white` atau sesuai konteks button
- **Konteks**: Icons di dalam button actions

## Standar Teknis SVG

### Atribut Konsisten

```vue
<svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="...">
  </path>
</svg>
```

### Properti Wajib

- `fill="none"` - Untuk outline icons
- `stroke="currentColor"` - Menggunakan warna dari class CSS
- `viewBox="0 0 24 24"` - Konsisten untuk semua icons
- `stroke-width="2"` - Ketebalan garis yang seragam
- `stroke-linecap="round"` dan `stroke-linejoin="round"` - Ujung garis yang halus

## Hierarchy Visual

1. **Largest**: Empty state illustrations (`h-12 w-12`)
2. **Medium**: Stat cards & timeline icons (`h-6 w-6`)
3. **Smallest**: Button icons (`h-5 w-5`)

## Timeline Activity Layout

- **Container circle**: `h-10 w-10` untuk proporsi yang seimbang
- **Timeline line position**: `top-5 left-5` mengikuti center container
- **Icon size dalam circle**: `h-6 w-6` untuk visibility yang optimal

## Color Scheme

- **Primary icons**: `text-gray-400` untuk netral
- **Active/highlighted**: `text-white` pada background berwarna
- **Interactive**: Mengikuti state button (hover, focus, dll)

Standar ini memastikan konsistensi visual dan user experience yang baik di seluruh dashboard.

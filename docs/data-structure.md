# Struktur Data Firebase - Aplikasi Tabungan

## Overview

Aplikasi tabungan ini menggunakan Firebase Firestore sebagai database dengan struktur hierarki yang terorganisir berdasarkan user authentication. Setiap user memiliki koleksi member yang terisolasi dan data tabungan yang tersimpan dalam format nested array.

## Struktur Hirarki Firebase

```text
Root Collection
└── users/
    └── {userId}/
        └── members/
            └── {memberId}/
                ├── name: string
                ├── note: string
                └── savings: array
```

### Path Structure

```text
users/{currentUser.uid}/members/{auto-generated-id}
```

## Skema Data

### 1. Root Document (Member)

Setiap member dalam koleksi memiliki struktur berikut:

```javascript
{
  id: "string",           // ID dokumen Firestore (auto-generated)
  name: "string",         // Nama member (required, unique per user)
  note: "string",         // Catatan tambahan (optional)
  savings: []             // Array data tabungan dan jimpitan
}
```

**Field Details:**

- `id`: Document ID yang di-generate otomatis oleh Firestore
- `name`: Nama member, wajib diisi dan harus unik (case-insensitive validation)
- `note`: Catatan opsional untuk member
- `savings`: Array yang berisi riwayat transaksi tabungan

### 2. Savings Array Structure

Setiap elemen dalam array `savings` memiliki struktur:

```javascript
{
  date: "ISO_string",     // Timestamp dalam format ISO
  bills: {
    tabungan: number,     // Jumlah tabungan (IDR)
    jimpitan: number      // Jumlah jimpitan (IDR)
  }
}
```

**Field Details:**

- `date`: Tanggal transaksi dalam format ISO 8601 (contoh: "2025-08-22T10:30:00.000Z")
- `bills.tabungan`: Jumlah tabungan dalam rupiah (integer)
- `bills.jimpitan`: Jumlah jimpitan dalam rupiah (integer)

## Contoh Data Lengkap

```javascript
// Member dengan beberapa transaksi tabungan
{
  id: "abc123def456ghi789",
  name: "John Doe",
  note: "Member aktif sejak Januari 2024",
  savings: [
    {
      date: "2025-08-22T10:30:00.000Z",
      bills: {
        tabungan: 100000,
        jimpitan: 15000
      }
    },
    {
      date: "2025-08-15T09:15:00.000Z",
      bills: {
        tabungan: 50000,
        jimpitan: 10000
      }
    },
    {
      date: "2025-08-08T11:45:00.000Z",
      bills: {
        tabungan: 75000,
        jimpitan: 12000
      }
    }
  ]
}
```

## Business Rules & Validations

### Member Validation

1. **Nama Unik**: Nama member harus unik dalam scope user yang sama (case-insensitive)
2. **Nama Required**: Field name wajib diisi
3. **Note Optional**: Field note bersifat opsional

### Savings Validation

1. **Minimal Amount**: Minimal salah satu dari tabungan atau jimpitan harus > 0
2. **Number Format**: Hanya menerima angka positif
3. **Date Auto**: Tanggal otomatis menggunakan timestamp saat transaksi

## Operations & Queries

### Create Operations

```javascript
// Menambah member baru
db.collection('users')
  .doc(currentUser.uid)
  .collection('members')
  .add(newMemberData)

// Menambah savings untuk member
db.collection('users')
  .doc(currentUser.uid)
  .collection('members')
  .doc(memberId)
  .update({
    savings: updatedSavingsArray
  })
```

### Read Operations

```javascript
// Mengambil semua member untuk user
db.collection('users')
  .doc(currentUser.uid)
  .collection('members')
  .get()
```

### Update Operations

```javascript
// Update data member
db.collection('users')
  .doc(currentUser.uid)
  .collection('members')
  .doc(memberId)
  .update(updatedData)
```

### Delete Operations

```javascript
// Hapus member
db.collection('users')
  .doc(currentUser.uid)
  .collection('members')
  .doc(memberId)
  .delete()
```

## Security & Access Control

### Authentication-based Isolation

- Setiap user hanya dapat mengakses data dalam path `users/{currentUser.uid}/`
- Data member terisolasi per user account
- Authentication state di-handle oleh Firebase Auth

### Data Integrity

- Local state management untuk konsistensi UI
- Real-time sync dengan Firestore
- Error handling untuk operasi gagal

## Performance Considerations

### Optimizations

1. **Nested Arrays**: Data savings disimpan dalam nested array untuk mengurangi read operations
2. **Local State**: Menggunakan local JavaScript array untuk performa UI
3. **Batch Operations**: Update dilakukan secara batch untuk efisiensi
4. **Pagination**: Implementasi pagination untuk member list

### Limitations

1. **Array Size**: Firestore memiliki limit 1MB per document
2. **Concurrent Updates**: Nested array update dapat menyebabkan conflict pada concurrent access
3. **Query Complexity**: Query pada nested array terbatas

## Data Flow

### 1. User Authentication

```text
User Login → Firebase Auth → Set currentUser → Access user's data path
```

### 2. Member Management

```text
Create Member → Validate → Add to Firestore → Update Local State → Render UI
```

### 3. Savings Management

```text
Add Savings → Validate → Update Member Document → Update Local Array → Refresh UI
```

## Summary Statistics

Aplikasi menghitung statistik agregat dari data member:

- **Total Members**: Jumlah member aktif
- **Total Tabungan**: Akumulasi semua tabungan dari semua member
- **Total Jimpitan**: Akumulasi semua jimpitan dari semua member
- **Grand Total**: Total keseluruhan (tabungan + jimpitan)

Perhitungan dilakukan di client-side dengan iterasi melalui semua member dan savings array untuk menghindari kompleksitas query Firestore.

---

*Dokumentasi ini menjelaskan struktur data Firebase Firestore yang digunakan dalam aplikasi tabungan. Struktur ini dirancang untuk mendukung multi-user dengan isolasi data yang baik dan performa yang optimal.*
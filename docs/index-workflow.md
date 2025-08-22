# Dokumentasi Alur Kerja Index.html - Aplikasi Tabungan

## Overview

File `index.html` merupakan halaman utama aplikasi tabungan yang menampilkan dashboard untuk mengelola data member dan tabungan. Halaman ini terintegrasi dengan Firebase Authentication dan Firestore untuk operasi CRUD data member dan tabungan.

## Arsitektur Aplikasi

### Technology Stack

```text
Frontend: HTML5 + CSS3 (Tailwind) + JavaScript (jQuery)
Backend: Firebase (Auth + Firestore)
State Management: Local JavaScript Arrays
UI Framework: Tailwind CSS + Font Awesome Icons
```

### Struktur Komponen Utama

```text
├── Authentication Layer
├── Header (Navigation + User Info)
├── Main Dashboard
│   ├── Summary Statistics Panel
│   ├── Member Management Interface
│   ├── Search & Filter Controls
│   └── Pagination System
├── Modal System (CRUD Operations)
└── Alert Notification System
```

## Alur Kerja Aplikasi

### 1. Initialization Flow

```text
Page Load → Authentication Check → User Verification → Data Fetch → UI Render
```

**Tahapan Detail:**

1. **Authentication State Check**

   ```javascript
   firebase.auth().onAuthStateChanged(function(user) {
       if (user) {
           // User authenticated - proceed to app
           loadUserData();
       } else {
           // Redirect to login
           window.location.href = "login.html";
       }
   });
   ```

2. **Loading Screen Management**
   - Tampilkan loading screen saat verifikasi
   - Hide loading setelah authentication success
   - Extract username dari email untuk display

3. **Data Initialization**
   - Fetch members dari Firestore
   - Initialize local state arrays
   - Render UI components

### 2. User Interface Components

#### A. Header Section

**Komponen:**

- Logo dan title aplikasi
- User display (username dari email)  
- Logout button dengan konfirmasi

**Fungsionalitas:**

```javascript
// User display
const username = user.email.split('@')[0];
$('#usernameDisplay').text(username);

// Logout functionality
$('#btnLogout').click(() => {
    firebase.auth().signOut();
});
```#### B. Summary Statistics Panel

**Metrics yang Ditampilkan:**

- **Total Members**: Jumlah member terdaftar
- **Total Tabungan**: Akumulasi semua tabungan
- **Total Jimpitan**: Akumulasi semua jimpitan  
- **Grand Total**: Total keseluruhan (tabungan + jimpitan)

**Update Mechanism:**
```javascript
function updateSummaryStats() {
    const totalMembers = members.length;
    let totalTabungan = 0;
    let totalJimpitan = 0;
    
    members.forEach(member => {
        member.savings.forEach(saving => {
            totalTabungan += saving.bills.tabungan || 0;
            totalJimpitan += saving.bills.jimpitan || 0;
        });
    });
    
    // Update UI elements
    $('#totalMemberCount').text(totalMembers);
    $('#totalTabunganAmount').text(formatRupiah(totalTabungan));
    // ... dst
}
```

#### C. Member Management Interface

**Features:**

- **Add Member**: Modal form untuk tambah member baru
- **Search**: Real-time search berdasarkan nama
- **Sort**: Sorting A-Z atau Z-A
- **Filter**: Filter berdasarkan catatan member
- **Pagination**: Navigation untuk dataset besar

**Search & Filter Implementation:**
```javascript
// Real-time search
$('#memberSearch').on('input', function() {
    const searchTerm = $(this).val().toLowerCase();
    filteredMembers = members.filter(member => 
        member.name.toLowerCase().includes(searchTerm)
    );
    renderMembers();
});

// Sort functionality
$('#sortMembers').on('change', function() {
    const sortType = $(this).val();
    applySort(sortType);
    renderMembers();
});
```

### 3. CRUD Operations Workflow

#### A. Create Member Flow

```text
Click Add Button → Open Modal → Fill Form → Validation → Save to Firebase → Update Local State → Refresh UI
```

**Implementation Steps:**

1. **Modal Display**
   ```javascript
   $('#btnAddMember').on('click', function() {
       $('#memberModal').removeClass('hidden');
       $('#memberName').focus();
   });
   ```

2. **Form Validation**
   - Required field checking
   - Duplicate name validation (case-insensitive)
   - Trim whitespace

3. **Firebase Save**
   ```javascript
   const newMember = {
       name: name.trim(),
       note: note.trim(),
       savings: []
   };
   
   db.collection('users').doc(currentUser.uid)
     .collection('members').add(newMember);
   ```

4. **UI Update**
   - Add to local array
   - Close modal
   - Refresh member list
   - Update statistics
   - Show success notification

#### B. Read Members Flow

```text
Authentication Success → Fetch from Firebase → Populate Local Array → Render UI → Enable Interactions
```

**Data Flow:**
```javascript
function fetchMembers() {
    db.collection('users').doc(currentUser.uid)
      .collection('members').get()
      .then((querySnapshot) => {
          members = [];
          querySnapshot.forEach((doc) => {
              members.push({
                  id: doc.id,
                  name: doc.data().name,
                  note: doc.data().note || '',
                  savings: doc.data().savings || []
              });
          });
          renderMembers();
          updateSummaryStats();
      });
}
```

#### C. Update Member Flow

```text
Click Edit → Open Edit Modal → Pre-fill Form → Modify Data → Validation → Update Firebase → Refresh UI
```

**Key Features:**
- Pre-populate form dengan data existing
- Same validation rules sebagai create
- Real-time UI update tanpa full reload

#### D. Delete Member Flow

```text
Click Delete → Show Confirmation Modal → Confirm Action → Delete from Firebase → Update Local State → Refresh UI
```

**Safety Features:**
- Confirmation dialog dengan member name
- Warning tentang data tabungan yang ikut terhapus
- Error handling untuk operasi gagal

### 4. Savings Management Workflow

#### A. Detail Savings Modal

**Functionality:**

- **View Savings**: Tabel dengan semua transaksi member
- **Add Savings**: Form inline untuk tambah tabungan baru
- **Edit Savings**: Edit transaksi existing
- **Delete Savings**: Hapus transaksi tertentu
- **Total Calculation**: Total tabungan + jimpitan per member

**Data Display:**
```javascript
function refreshSavingsDetail(memberIndex) {
    const member = members[memberIndex];
    
    // Sort by date (newest first)
    const sortedSavings = [...member.savings].sort((a, b) =>
        new Date(b.date) - new Date(a.date)
    );
    
    // Render table
    sortedSavings.forEach((saving, index) => {
        const row = createSavingsRow(saving, index);
        $('#savingsDetailTable').append(row);
    });
}
```

#### B. Add Savings Workflow

```text
Open Detail Modal → Fill Amount Form → Validation → Update Member Document → Refresh Detail View → Update Statistics
```

**Data Structure:**
```javascript
const newSaving = {
    date: new Date().toISOString(),
    bills: {
        tabungan: parseCurrency(tabunganAmount) || 0,
        jimpitan: parseCurrency(jimpitanAmount) || 0
    }
};
```

#### C. Currency Formatting

**Real-time Input Formatting:**
```javascript
function formatCurrency(input) {
    let value = input.val().replace(/\D/g, '');
    if (value !== '') {
        value = parseInt(value, 10);
        let formattedValue = value.toLocaleString('id-ID');
        input.val(formattedValue);
    }
    return value;
}
```

### 5. State Management

#### A. Local State Variables

```javascript
let members = [];           // Array member dengan data lengkap
let currentUser = null;     // Firebase user object
let isLoading = true;       // Loading state indicator

// Pagination config
const paginationConfig = {
    membersPerPage: 5,
    currentPage: 1,
    totalPages: Math.ceil(members.length / 5)
};
```

#### B. State Synchronization

**Local ↔ Firebase Sync:**

- **Create**: Local add → Firebase save → Success feedback
- **Update**: Local modify → Firebase update → UI refresh  
- **Delete**: Firebase delete → Local remove → UI update
- **Read**: Firebase fetch → Local populate → UI render

### 6. UI/UX Features

#### A. Loading States

**Authentication Loading:**
```javascript
// Show loading screen during auth check
$('#authLoadingScreen').show();

// Hide after successful auth
$('#authLoadingScreen').fadeOut(500);
```

**Operation Loading:**
- Button loading states dengan spinner
- Form disable during submission
- Progress indicators

#### B. Responsive Design

**Mobile Optimization:**

- Horizontal scrolling untuk tabs
- Stacked layout pada mobile
- Touch-friendly button sizes
- Responsive tables dengan overflow scroll

**CSS Features:**
```css
/* Mobile scrolling optimization */
nav ul {
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
}

/* Responsive grid */
.grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
```

#### C. Alert System

**Alert Types & Usage:**

- **Success**: Operasi berhasil (hijau)
- **Error**: Operasi gagal (merah)  
- **Warning**: Peringatan (kuning)
- **Info**: Informasi umum (biru)

**Auto-dismiss Features:**
```javascript
function showAlert(message, type = 'info', duration = 4000) {
    const alert = createAlertElement(message, type);
    $('#alertContainer').append(alert);
    
    // Auto-close after duration
    setTimeout(() => closeAlert(alert), duration);
}
```

### 7. Performance Optimizations

#### A. Data Management

**Efficient Operations:**
- Local array manipulation untuk UI responsiveness
- Batch Firebase operations
- Minimal DOM manipulation
- Event delegation untuk dynamic content

#### B. Memory Management

```javascript
// Event delegation instead of individual bindings
$(document).on('click', '.btn-delete-member', function() {
    const index = $(this).data('index');
    deleteMember(index);
});
```

#### C. Pagination Implementation

**Benefits:**
- Improved load times dengan dataset besar
- Better user experience
- Reduced DOM elements
- Memory efficiency

```javascript
function getPaginatedMembers() {
    const start = (currentPage - 1) * membersPerPage;
    const end = start + membersPerPage;
    return members.slice(start, end);
}
```

### 8. Error Handling & Validation

#### A. Form Validation

**Client-side Validation:**

- Required field checking
- Format validation (currency, email)
- Duplicate prevention
- Input sanitization

#### B. Firebase Error Handling

```javascript
.catch((error) => {
    console.error("Error operation:", error);
    
    // User-friendly error messages
    const message = getErrorMessage(error.code);
    showAlert(message, 'error');
    
    // Reset UI state
    resetLoadingState();
});
```

#### C. Network Error Handling

- Connection timeout handling
- Retry mechanisms
- Offline state detection
- Graceful degradation

### 9. Accessibility Features

#### A. Keyboard Navigation

- Tab order optimization
- Enter key shortcuts
- Escape key untuk close modals
- Arrow keys untuk navigation

#### B. Screen Reader Support

```html
<!-- ARIA labels dan roles -->
<div role="tabpanel" aria-labelledby="tab-member">
<div aria-live="assertive" aria-atomic="true">
<button aria-label="Close modal">
```

#### C. Visual Accessibility

- High contrast colors
- Focus indicators
- Loading states
- Error states dengan visual cues

### 10. Security Considerations

#### A. Authentication Protection

- Route protection via auth state
- Automatic redirect untuk unauthenticated users
- Session timeout handling

#### B. Data Validation

```javascript
// Server-side style validation
function validateMemberData(data) {
    if (!data.name || data.name.trim().length === 0) {
        throw new Error('Nama member wajib diisi');
    }
    
    // Sanitize input
    data.name = data.name.trim();
    data.note = data.note ? data.note.trim() : '';
    
    return data;
}
```

#### C. Firebase Security

- User-scoped data access
- Firestore security rules
- Input sanitization
- XSS protection

---

*Dokumentasi ini menjelaskan alur kerja lengkap dari halaman utama aplikasi tabungan, mulai dari authentication hingga operasi CRUD data member dan tabungan, dengan fokus pada user experience yang optimal dan keamanan data.*

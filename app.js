$(document).ready(function () {
    // Data structure to hold members and their savings
    let members = [];

    // Loading state indicator
    let isLoading = true;

    // Show loading indicator function
    function showLoading() {
        $('#membersList').html(`
            <div class="text-center py-8">
                <div class="flex justify-center mb-4">
                    <i class="fas fa-spinner fa-spin text-blue-500 text-5xl"></i>
                </div>
                <p class="text-center text-gray-500">Memuat data member...</p>
            </div>
        `);
    }

    // Show initial loading
    showLoading();

    // Fetch data from Firestore
    function fetchMembers() {
        isLoading = true;
        showLoading();

        // Get members collection from Firestore
        db.collection('members').get().then((querySnapshot) => {
            members = [];
            querySnapshot.forEach((doc) => {
                const memberData = doc.data();
                members.push({
                    id: doc.id,  // Store Firestore document ID
                    name: memberData.name,
                    note: memberData.note || '',
                    savings: memberData.savings || []
                });
            });

            isLoading = false;
            renderMembers();
        }).catch((error) => {
            console.error("Error fetching members: ", error);
            isLoading = false;
            showAlert('Gagal memuat data dari Firebase.', 'error');
            renderMembers();
        });
    }

    // Initial data fetch
    fetchMembers();

    // Pagination configuration
    const paginationConfig = {
        membersPerPage: 5,
        currentPage: 1,
        totalPages: Math.ceil(members.length / 5)
    };

    // Format number to Indonesian Rupiah currency format
    function formatRupiah(number) {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
    }

    // Format date to dd-mm-yyyy
    function formatDate(date) {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    }

    // Show alert function
    function showAlert(message, type = 'info', duration = 4000) {
        const id = `alert-${Date.now()}`;
        const colors = {
            info: 'bg-blue-100 text-blue-800',
            success: 'bg-green-100 text-green-800',
            error: 'bg-red-100 text-red-800',
            warning: 'bg-yellow-100 text-yellow-800',
        };
        const icons = {
            info: '<i class="fas fa-info-circle mr-2"></i>',
            success: '<i class="fas fa-check-circle mr-2"></i>',
            error: '<i class="fas fa-exclamation-circle mr-2"></i>',
            warning: '<i class="fas fa-exclamation-triangle mr-2"></i>',
        };

        const alert = $(`
            <div id="${id}" role="alert" class="flex items-center ${colors[type] || colors.info} rounded-md shadow-md p-3 animate-[slideInRight_0.3s_ease_forwards]">
                <span class="flex-shrink-0 text-lg">${icons[type] || icons.info}</span>
                <p class="flex-grow text-sm font-medium">${message}</p>
                <button aria-label="Tutup notifikasi" class="ml-3 text-lg font-bold focus:outline-none hover:text-opacity-70 transition" type="button">&times;</button>
            </div>
        `);

        $('#alertContainer').append(alert);

        // Close button event
        alert.find('button').on('click', function () {
            closeAlert(alert);
        });

        // Auto close after duration
        setTimeout(function () {
            closeAlert(alert);
        }, duration);
    }

    // Close alert with animation
    function closeAlert(alert) {
        alert.css('animation', 'slideOutRight 0.3s ease forwards');
        alert.on('animationend', function () {
            $(this).remove();
        });
    }

    // Get paginated members
    function getPaginatedMembers() {
        const startIndex = (paginationConfig.currentPage - 1) * paginationConfig.membersPerPage;
        const endIndex = startIndex + paginationConfig.membersPerPage;
        return members.slice(startIndex, endIndex);
    }

    // Render pagination controls
    function renderPagination() {
        const totalPages = Math.ceil(members.length / paginationConfig.membersPerPage);
        paginationConfig.totalPages = totalPages;

        if (totalPages <= 1) {
            $('#paginationControls').addClass('hidden');
            return;
        }

        $('#paginationControls').removeClass('hidden');

        let paginationHTML = '';

        // Previous button
        paginationHTML += `
            <button id="prevPage" class="px-3 py-1 rounded-md flex items-center ${paginationConfig.currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}"
            ${paginationConfig.currentPage === 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left mr-1"></i> Prev
            </button>
        `;

        let pages = [];
        const currentPage = paginationConfig.currentPage;

        // Always show first page
        pages.push(1);

        // Show ellipsis after first page if needed
        if (currentPage > 3) {
            pages.push('...');
        }

        // Show pages around current page
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            pages.push(i);
        }

        // Show ellipsis before last page if needed
        if (currentPage < totalPages - 2) {
            pages.push('...');
        }

        // Always show last page if there is more than one page
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        // Render page numbers
        pages.forEach(page => {
            if (page === '...') {
                paginationHTML += `
                    <span class="px-3 py-1 text-gray-500">...</span>
                `;
            } else {
                paginationHTML += `
                    <button class="page-number px-3 py-1 rounded-md ${page === currentPage ?
                        'bg-blue-600 text-white' :
                        'text-gray-700 hover:bg-blue-100'}" 
                        data-page="${page}">
                        ${page}
                    </button>
                `;
            }
        });

        // Next button
        paginationHTML += `
            <button id="nextPage" class="px-3 py-1 rounded-md flex items-center ${paginationConfig.currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}"
            ${paginationConfig.currentPage === totalPages ? 'disabled' : ''}>
                Next <i class="fas fa-chevron-right ml-1"></i>
            </button>
        `;

        $('#paginationControls').html(paginationHTML);

        // Add event listeners for pagination
        $('.page-number').on('click', function () {
            paginationConfig.currentPage = parseInt($(this).data('page'));
            renderMembers();
        });

        $('#prevPage').on('click', function () {
            if (paginationConfig.currentPage > 1) {
                paginationConfig.currentPage--;
                renderMembers();
            }
        });

        $('#nextPage').on('click', function () {
            if (paginationConfig.currentPage < totalPages) {
                paginationConfig.currentPage++;
                renderMembers();
            }
        });
    }

    // Render members list with total tabungan and total jimpitan
    function renderMembers() {
        $('#membersList').empty();

        // Get paginated members
        const paginatedMembers = getPaginatedMembers();

        if (members.length === 0) {
            $('#membersList').html(`
                <div class="text-center py-8">
                    <div class="flex justify-center mb-4">
                        <i class="fas fa-users text-gray-300 text-5xl"></i>
                    </div>
                    <p class="text-center text-gray-500">Belum ada member terdaftar.</p>
                    <p class="text-sm text-gray-400 mt-2">Tambahkan member baru dengan mengklik tombol "Tambah Data Member"</p>
                </div>
            `);
            $('#paginationControls').addClass('hidden');
            return;
        }

        // Show member counter
        const startIndex = (paginationConfig.currentPage - 1) * paginationConfig.membersPerPage;
        const endIndex = Math.min(startIndex + paginationConfig.membersPerPage, members.length);
        $('#memberCounter').html(`Menampilkan ${startIndex + 1}-${endIndex} dari ${members.length} member`);

        $.each(paginatedMembers, function (index, member) {
            const totalTabungan = member.savings
                .reduce((acc, cur) => acc + (cur.bills.tabungan || 0), 0);

            const totalJimpitan = member.savings
                .reduce((acc, cur) => acc + (cur.bills.jimpitan || 0), 0);

            const totalSaved = totalTabungan + totalJimpitan;

            const memberCard = $(`
                <div class="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 relative">
                    <div class="absolute top-2 right-2 flex gap-2">
                        <button class="btn-menu-member text-gray-600 hover:text-blue-800 text-sm flex items-center gap-1 p-1" data-index="${startIndex + index}" aria-haspopup="true" aria-expanded="false">
                            <i class="fa-solid fa-ellipsis-vertical"></i>
                        </button>
                        <div class="member-dropdown-menu absolute right-0 top-full mt-1 bg-white shadow-lg rounded-md py-1 z-10 hidden min-w-[200px]">
                            <button class="btn-detail-savings w-full text-left px-4 py-2 text-gray-600 hover:bg-blue-50 flex items-center gap-2" data-index="${startIndex + index}">
                                <i class="fas fa-list"></i> Detail Tabungan
                            </button>
                            <button class="btn-edit-member w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50 flex items-center gap-2" data-index="${startIndex + index}">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn-delete-member w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2" data-index="${startIndex + index}">
                                <i class="fas fa-trash-alt"></i> Hapus
                            </button>
                        </div>
                    </div>
                    <div class="flex-grow">
                        <h3 class="text-lg font-semibold text-blue-800">${member.name}</h3>
                        <p class="text-gray-600">Total Tabungan: <span class="font-semibold">${formatRupiah(totalTabungan)}</span></p>
                        <p class="text-gray-600">Total Jimpitan: <span class="font-semibold">${formatRupiah(totalJimpitan)}</span></p>
                        ${member.note ? `<div class="mt-2 bg-yellow-50 p-2 rounded-md">
                            <p class="text-gray-700 text-sm"><i class="fas fa-sticky-note text-yellow-500 mr-1"></i> <span class="italic">${member.note}</span></p>
                        </div>` : ''}
                    </div>
                    <div class="w-full sm:w-48 flex flex-col gap-1">
                        <p class="text-sm font-medium text-gray-700 text-right">Total: ${formatRupiah(totalSaved)}</p>
                    </div>
                </div>
            `);

            $('#membersList').append(memberCard);
        });

        // Render pagination controls
        renderPagination();

        // Update select options
        $('#selectMember').html('<option value="" disabled selected>Pilih member</option>');

        $.each(members, function (index, member) {
            $('#selectMember').append(`<option value="${index}">${member.name}</option>`);
        });
    }

    // Handle member registration
    $('#memberForm').on('submit', function (e) {
        e.preventDefault();
        const name = $('#memberName').val().trim();

        if (!name) {
            showAlert('Mohon isi data dengan benar.', 'error');
            return;
        }

        // Check if member name already exists (case insensitive)
        const exists = members.some(m => m.name && m.name.toLowerCase() === name.toLowerCase());
        if (exists) {
            showAlert('Member dengan nama tersebut sudah terdaftar.', 'warning');
            return;
        }

        // Show loading during save
        showLoading();

        const newMember = {
            name,
            note: $('#memberNote').val().trim(),
            savings: []
        };

        // Add to Firestore
        db.collection('members').add(newMember)
            .then((docRef) => {
                // Update local data with the document ID
                newMember.id = docRef.id;
                members.push(newMember);

                $(this)[0].reset();
                $('#memberModal').addClass('hidden');
                $('body').css('overflow', '');

                // After adding a new member, go to the last page to show the new member
                paginationConfig.currentPage = Math.ceil(members.length / paginationConfig.membersPerPage);
                renderMembers();
                showAlert(`Member "${name}" berhasil didaftarkan.`, 'success');
            })
            .catch((error) => {
                console.error("Error adding member: ", error);
                showAlert(`Gagal mendaftarkan member: ${error.message}`, 'error');
                renderMembers();
            });
    });

    // Initial render
    renderMembers();

    // ===== Edit Member Functionality =====

    // Toggle dropdown menu for members
    $(document).on('click', '.btn-menu-member', function (e) {
        e.stopPropagation(); // Prevent event bubbling
        const dropdown = $(this).siblings('.member-dropdown-menu');

        // Close all other dropdowns first
        $('.member-dropdown-menu').not(dropdown).addClass('hidden');

        // Toggle current dropdown
        dropdown.toggleClass('hidden');

        // Update aria-expanded state
        $(this).attr('aria-expanded', !dropdown.hasClass('hidden'));
    });

    // Close all dropdowns when clicking outside
    $(document).on('click', function () {
        $('.member-dropdown-menu').addClass('hidden');
        $('.btn-menu-member').attr('aria-expanded', 'false');
    });

    // Open edit member modal
    $(document).on('click', '.btn-edit-member', function () {
        const index = $(this).data('index');
        const member = members[index];

        $('#editMemberIndex').val(index);
        $('#editMemberName').val(member.name);
        $('#editMemberNote').val(member.note || '');

        $('#editMemberModal').removeClass('hidden');
        $('#editMemberName').focus();
        $('body').css('overflow', 'hidden');
    });

    // Close edit member modal
    $('#closeEditModal').on('click', function () {
        $('#editMemberModal').addClass('hidden');
        $('body').css('overflow', '');
    });

    // Close edit modal when clicking outside
    $('#editMemberModal').on('click', function (e) {
        if (e.target === this) {
            $('#editMemberModal').addClass('hidden');
            $('body').css('overflow', '');
        }
    });

    // Close edit modal on Escape key
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape' && !$('#editMemberModal').hasClass('hidden')) {
            $('#editMemberModal').addClass('hidden');
            $('body').css('overflow', '');
        }
    });

    // Save edit member form
    $('#editMemberForm').on('submit', function (e) {
        e.preventDefault();
        const index = parseInt($('#editMemberIndex').val());
        const name = $('#editMemberName').val().trim();

        if (!name) {
            showAlert('Mohon isi data dengan benar.', 'error');
            return;
        }

        // Check if new name already exists (excluding the current member)
        const nameExists = members.some((m, i) => i !== index && m.name.toLowerCase() === name.toLowerCase());
        if (nameExists) {
            showAlert('Member dengan nama tersebut sudah terdaftar.', 'warning');
            return;
        }

        const member = members[index];

        // Show loading state
        showLoading();

        // Update data in Firestore
        db.collection('members').doc(member.id).update({
            name: name,
            note: $('#editMemberNote').val().trim()
        })
            .then(() => {
                // Update the member data locally
                members[index].name = name;
                members[index].note = $('#editMemberNote').val().trim();

                $('#editMemberModal').addClass('hidden');
                $('body').css('overflow', '');
                renderMembers();
                showAlert(`Data member "${name}" berhasil diperbarui.`, 'success');
            })
            .catch((error) => {
                console.error("Error updating member: ", error);
                showAlert(`Gagal memperbarui member: ${error.message}`, 'error');
                renderMembers();
            });
    });

    // ===== Delete Member Functionality =====

    // Open delete confirmation modal
    $(document).on('click', '.btn-delete-member', function () {
        const index = $(this).data('index');
        const member = members[index];

        $('#deleteMemberIndex').val(index);
        $('#deleteMemberName').text(member.name);

        $('#deleteMemberModal').removeClass('hidden');
        $('body').css('overflow', 'hidden');
    });

    // Cancel delete
    $('#cancelDelete').on('click', function () {
        $('#deleteMemberModal').addClass('hidden');
        $('body').css('overflow', '');
    });

    // Confirm delete
    $('#confirmDelete').on('click', function () {
        const index = parseInt($('#deleteMemberIndex').val());
        const member = members[index];
        const memberName = member.name;

        // Show loading state
        showLoading();

        // Delete from Firestore
        db.collection('members').doc(member.id).delete()
            .then(() => {
                // Remove from local array
                members.splice(index, 1);

                $('#deleteMemberModal').addClass('hidden');
                $('body').css('overflow', '');
                renderMembers();
                showAlert(`Member "${memberName}" berhasil dihapus.`, 'success');
            })
            .catch((error) => {
                console.error("Error deleting member: ", error);
                showAlert(`Gagal menghapus member: ${error.message}`, 'error');
                renderMembers();
            });
    });

    // Close delete modal when clicking outside
    $('#deleteMemberModal').on('click', function (e) {
        if (e.target === this) {
            $('#deleteMemberModal').addClass('hidden');
            $('body').css('overflow', '');
        }
    });

    // Close delete modal on Escape key
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape' && !$('#deleteMemberModal').hasClass('hidden')) {
            $('#deleteMemberModal').addClass('hidden');
            $('body').css('overflow', '');
        }
    });

    // ===== Detail Savings Functionality =====

    // Open detail savings modal
    $(document).on('click', '.btn-detail-savings', function () {
        const index = $(this).data('index');
        const member = members[index];

        // Set member name in modal title and store member index for adding savings
        $('#savingsMemberName').text(member.name);
        $('#detailSavingsMemberIndex').val(index);

        // Clear previous content and form values
        $('#addSavingsDetailForm')[0].reset();

        refreshSavingsDetail(index);

        // Show modal
        $('#detailSavingsModal').removeClass('hidden');
        $('body').css('overflow', 'hidden');
    });

    // Handle adding savings from detail modal
    $('#addSavingsDetailForm').on('submit', function (e) {
        e.preventDefault();
        const memberIndex = parseInt($('#detailSavingsMemberIndex').val());
        const amountTabungan = parseInt($('#detailAmountTabungan').val()) || 0;
        const amountJimpitan = parseInt($('#detailAmountJimpitan').val()) || 0;

        if (isNaN(memberIndex) || memberIndex < 0 || memberIndex >= members.length) {
            showAlert('Member tidak valid.', 'error');
            return;
        }

        if ((amountTabungan <= 0 && amountJimpitan <= 0) || (isNaN(amountTabungan) && isNaN(amountJimpitan))) {
            showAlert('Masukkan jumlah tabungan atau jimpitan yang valid.', 'error');
            return;
        }

        const today = new Date().toISOString();
        const member = members[memberIndex];

        // Create a copy of the member's savings
        const updatedSavings = [...member.savings];

        // Add tabungan entry if amount is provided
        updatedSavings.push({
            date: today,
            bills: {
                tabungan: amountTabungan,
                jimpitan: amountJimpitan
            }
        });

        // Update Firestore
        db.collection('members').doc(member.id).update({
            savings: updatedSavings
        })
            .then(() => {
                // Update local data
                members[memberIndex].savings = updatedSavings;

                // Reset form
                $(this)[0].reset();

                // Re-open the detail modal to refresh the data
                refreshSavingsDetail(memberIndex);

                // Update the main screen if needed
                renderMembers();

                showAlert(`Tabungan berhasil ditambahkan untuk member "${member.name}".`, 'success');
            })
            .catch((error) => {
                console.error("Error adding saving: ", error);
                showAlert(`Gagal menambahkan tabungan: ${error.message}`, 'error');
            });
    });

    // Close detail savings modal
    $('#closeDetailSavingsModal').on('click', function () {
        $('#detailSavingsModal').addClass('hidden');
        $('body').css('overflow', '');
    });

    // Close detail savings modal when clicking outside
    $('#detailSavingsModal').on('click', function (e) {
        if (e.target === this) {
            $(this).addClass('hidden');
            $('body').css('overflow', '');
        }
    });

    // Close detail savings modal on Escape key
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape' && !$('#detailSavingsModal').hasClass('hidden')) {
            $('#detailSavingsModal').addClass('hidden');
            $('body').css('overflow', '');
        }
    });

    // Modal functionality
    $('#btnAddMember').on('click', function () {
        $('#memberModal').removeClass('hidden');
        $('#memberName').focus();
        $('body').css('overflow', 'hidden');
    });

    $('#closeModal').on('click', function () {
        $('#memberModal').addClass('hidden');
        $('body').css('overflow', '');
    });

    // Close modal when clicking outside of it
    $('#memberModal').on('click', function (e) {
        if (e.target === this) {
            $('#memberModal').addClass('hidden');
            $('body').css('overflow', '');
        }
    });

    // Close modal on Escape key
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape' && !$('#memberModal').hasClass('hidden')) {
            $('#memberModal').addClass('hidden');
            $('body').css('overflow', '');
        }
    });

    // Set up member filter functionality
    function setupMemberFilters() {
        // Toggle filter panel
        $('#btnFilterMembers').on('click', function () {
            $('#memberFilterPanel').slideToggle(200);
        });

        // Reset filters
        $('#btnResetMemberFilters').on('click', function () {
            $('#filterNotes').val('');
            $('#memberSearch').val('');
            $('#sortMembers').val('name-asc');
            applyMemberFilters();
        });

        // Apply filters
        $('#btnApplyMemberFilters').on('click', function () {
            applyMemberFilters();
        });

        // Search as you type
        $('#memberSearch').on('input', function () {
            applyMemberFilters();
        });

        // Sort change
        $('#sortMembers').on('change', function () {
            applyMemberFilters();
        });
    }

    // Apply member filters
    function applyMemberFilters() {
        const searchText = $('#memberSearch').val().toLowerCase();
        const notesKeyword = $('#filterNotes').val().toLowerCase();
        const sortOption = $('#sortMembers').val();

        // Create a copy of the members array for filtering and sorting
        let filteredMembers = [...members];

        // Filter by search text (member name)
        if (searchText) {
            filteredMembers = filteredMembers.filter(member =>
                member.name.toLowerCase().includes(searchText)
            );
        }

        // Filter by notes content
        if (notesKeyword) {
            filteredMembers = filteredMembers.filter(member =>
                member.note && member.note.toLowerCase().includes(notesKeyword)
            );
        }

        // Sort the filtered results
        switch (sortOption) {
            case 'name-asc':
                filteredMembers.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filteredMembers.sort((a, b) => b.name.localeCompare(a.name));
                break;
        }

        // Update members data and render with pagination
        renderFilteredMembers(filteredMembers);
    }

    // Render filtered members with pagination
    function renderFilteredMembers(filteredMembers) {
        // Update pagination configuration for filtered results
        paginationConfig.totalPages = Math.ceil(filteredMembers.length / paginationConfig.membersPerPage);

        // Reset to first page when filters change
        if (paginationConfig.currentPage > paginationConfig.totalPages && paginationConfig.totalPages > 0) {
            paginationConfig.currentPage = 1;
        }

        $('#membersList').empty();

        // Check if we have results
        if (filteredMembers.length === 0) {
            $('#membersList').html(`
                <div class="text-center py-8">
                    <div class="flex justify-center mb-4">
                        <i class="fas fa-search text-gray-400 text-5xl"></i>
                    </div>
                    <p class="text-center text-gray-500">Tidak ada member yang sesuai dengan kriteria filter.</p>
                    <p class="text-sm text-gray-400 mt-2">Coba ubah filter atau kriteria pencarian.</p>
                </div>
            `);
            $('#paginationControls').addClass('hidden');
            $('#memberCounter').text('');
            return;
        }

        // Get current page of filtered members
        const startIndex = (paginationConfig.currentPage - 1) * paginationConfig.membersPerPage;
        const paginatedMembers = filteredMembers.slice(
            startIndex,
            startIndex + paginationConfig.membersPerPage
        );

        // Render each member card
        $.each(paginatedMembers, function (index, member) {
            const memberIndex = members.findIndex(m => m.name === member.name); // Find original index

            const totalTabungan = member.savings
                .filter(saving => saving.type === 'tabungan')
                .reduce((acc, cur) => acc + cur.amount, 0);

            const totalJimpitan = member.savings
                .filter(saving => saving.type === 'jimpitan')
                .reduce((acc, cur) => acc + cur.amount, 0);

            const totalSaved = totalTabungan + totalJimpitan;

            const memberCard = $(`
                <div class="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 relative">
                    <div class="absolute top-2 right-2 flex gap-2">
                        <button class="btn-menu-member text-gray-600 hover:text-blue-800 text-sm flex items-center gap-1 p-1" data-index="${memberIndex}" aria-haspopup="true" aria-expanded="false">
                            <i class="fa-solid fa-ellipsis-vertical"></i>
                        </button>
                        <div class="member-dropdown-menu absolute right-0 top-full mt-1 bg-white shadow-lg rounded-md py-1 z-10 hidden min-w-[200px]">
                            <button class="btn-detail-savings w-full text-left px-4 py-2 text-gray-600 hover:bg-blue-50 flex items-center gap-2" data-index="${memberIndex}">
                                <i class="fas fa-list"></i> Detail Tabungan
                            </button>
                            <button class="btn-edit-member w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50 flex items-center gap-2" data-index="${memberIndex}">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn-delete-member w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2" data-index="${memberIndex}">
                                <i class="fas fa-trash-alt"></i> Hapus
                            </button>
                        </div>
                    </div>
                    <div class="flex-grow">
                        <h3 class="text-lg font-semibold text-blue-800">${member.name}</h3>
                        <p class="text-gray-600">Total Tabungan: <span class="font-semibold">${formatRupiah(totalTabungan)}</span></p>
                        <p class="text-gray-600">Total Jimpitan: <span class="font-semibold">${formatRupiah(totalJimpitan)}</span></p>
                        ${member.note ? `<div class="mt-2 bg-yellow-50 p-2 rounded-md">
                            <p class="text-gray-700 text-sm"><i class="fas fa-sticky-note text-yellow-500 mr-1"></i> <span class="italic">${member.note}</span></p>
                        </div>` : ''}
                    </div>
                    <div class="w-full sm:w-48 flex flex-col gap-1">
                        <p class="text-sm font-medium text-gray-700 text-right">Total: ${formatRupiah(totalSaved)}</p>
                    </div>
                </div>
            `);

            $('#membersList').append(memberCard);
        });

        // Update member counter
        const endIndex = Math.min(startIndex + paginationConfig.membersPerPage, filteredMembers.length);
        $('#memberCounter').html(`Menampilkan ${startIndex + 1}-${endIndex} dari ${filteredMembers.length} member`);

        // Render pagination
        renderPagination();
    }

    // Initialize member filters
    setupMemberFilters();

    // ===== Edit Savings Functionality =====

    // Open edit savings modal
    $(document).on('click', '.btn-edit-saving', function () {
        const memberIndex = $(this).data('member-index');
        const savingIndex = $(this).data('saving-index');
        const amount = $(this).data('amount');
        const type = $(this).data('type');

        $('#editSavingsMemberIndex').val(memberIndex);
        $('#editSavingsIndex').val(savingIndex);
        $('#editSavingsAmount').val(amount);
        $('#editSavingsType').val(type);

        $('#editSavingsModal').removeClass('hidden');
        $('#editSavingsAmount').focus();
        $('body').css('overflow', 'hidden');
    });

    // Close edit savings modal
    $('#closeEditSavingsModal').on('click', function () {
        $('#editSavingsModal').addClass('hidden');
        $('body').css('overflow', '');
    });

    // Close edit modal when clicking outside
    $('#editSavingsModal').on('click', function (e) {
        if (e.target === this) {
            $('#editSavingsModal').addClass('hidden');
            $('body').css('overflow', '');
        }
    });

    // Close edit modal on Escape key
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape' && !$('#editSavingsModal').hasClass('hidden')) {
            $('#editSavingsModal').addClass('hidden');
            $('body').css('overflow', '');
        }
    });

    // Save edit savings form
    $('#editSavingsForm').on('submit', function (e) {
        e.preventDefault();
        const memberIndex = parseInt($('#editSavingsMemberIndex').val());
        const savingIndex = parseInt($('#editSavingsIndex').val());
        const amount = parseInt($('#editSavingsAmount').val());
        const type = $('#editSavingsType').val();

        if (isNaN(amount) || amount <= 0) {
            showAlert('Mohon isi jumlah tabungan dengan benar.', 'error');
            return;
        }

        const member = members[memberIndex];

        // Create a new array of savings with the updated item
        const updatedSavings = [...member.savings];
        updatedSavings[savingIndex] = {
            ...updatedSavings[savingIndex],
            amount: amount,
            type: type
        };

        // Update Firestore
        db.collection('members').doc(member.id).update({
            savings: updatedSavings
        })
            .then(() => {
                // Update local data
                members[memberIndex].savings = updatedSavings;

                $('#editSavingsModal').addClass('hidden');
                $('body').css('overflow', '');

                // Refresh the detail savings modal
                refreshSavingsDetail(memberIndex);

                // Update the main view
                renderMembers();
                showAlert('Data tabungan berhasil diperbarui.', 'success');
            })
            .catch((error) => {
                console.error("Error updating saving: ", error);
                showAlert(`Gagal memperbarui tabungan: ${error.message}`, 'error');
            });
    });

    // ===== Delete Savings Functionality =====

    // Open delete saving confirmation modal
    $(document).on('click', '.btn-delete-saving', function () {
        const memberIndex = $(this).data('member-index');
        const savingIndex = $(this).data('saving-index');

        $('#deleteSavingsMemberIndex').val(memberIndex);
        $('#deleteSavingsIndex').val(savingIndex);

        $('#deleteSavingsModal').removeClass('hidden');
        $('body').css('overflow', 'hidden');
    });

    // Cancel delete saving
    $('#cancelDeleteSavings').on('click', function () {
        $('#deleteSavingsModal').addClass('hidden');
        $('body').css('overflow', '');
    });

    // Confirm delete saving
    $('#confirmDeleteSavings').on('click', function () {
        const memberIndex = parseInt($('#deleteSavingsMemberIndex').val());
        const savingIndex = parseInt($('#deleteSavingsIndex').val());
        const member = members[memberIndex];

        // Create a new array of savings without the deleted item
        const updatedSavings = member.savings.filter((_, index) => index !== savingIndex);

        // Update Firestore
        db.collection('members').doc(member.id).update({
            savings: updatedSavings
        })
            .then(() => {
                // Update local data
                members[memberIndex].savings = updatedSavings;

                $('#deleteSavingsModal').addClass('hidden');
                $('body').css('overflow', '');

                // Refresh the detail savings modal
                refreshSavingsDetail(memberIndex);

                // Update the main view
                renderMembers();
                showAlert('Catatan tabungan berhasil dihapus.', 'success');
            })
            .catch((error) => {
                console.error("Error deleting saving: ", error);
                showAlert(`Gagal menghapus tabungan: ${error.message}`, 'error');
            });
    });

    // Close delete savings modal when clicking outside
    $('#deleteSavingsModal').on('click', function (e) {
        if (e.target === this) {
            $('#deleteSavingsModal').addClass('hidden');
            $('body').css('overflow', '');
        }
    });

    // Close delete modal on Escape key
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape' && !$('#deleteSavingsModal').hasClass('hidden')) {
            $('#deleteSavingsModal').addClass('hidden');
            $('body').css('overflow', '');
        }
    });

    // Helper function to refresh savings detail view
    function refreshSavingsDetail(memberIndex) {
        const member = members[memberIndex];

        // Clear previous content
        $('#savingsDetailTable').empty();

        // Sort savings by date (newest first)
        const sortedSavings = [...member.savings].sort((a, b) =>
            new Date(b.date) - new Date(a.date)
        );

        // Calculate total savings
        const totalSavings = member.savings.reduce((acc, cur) => acc + cur.bills.tabungan + cur.bills.jimpitan, 0);

        // Display each saving entry
        $.each(sortedSavings, function (i, saving) {
            const formattedDate = formatDate(saving.date);
            const formattedAmountTabungan = formatRupiah(saving.bills.tabungan || 0);
            const formattedAmountJimpitan = formatRupiah(saving.bills.jimpitan || 0);

            // Find the original index in member's savings array
            const originalIndex = member.savings.findIndex(s =>
                s.date === saving.date && s.amount === saving.amount && s.type === saving.type
            );

            const row = $(`
                <tr class="${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}">
                    <td class="px-4 py-2 whitespace-nowrap">${formattedDate}</td>
                    <td class="px-4 py-2 text-right font-medium">${formattedAmountTabungan}</td>
                    <td class="px-4 py-2 text-right font-medium">${formattedAmountJimpitan}</td>
                    <td class="px-4 py-2 text-right min-w-[100px]">
                        <button class="btn-edit-saving text-blue-600 hover:text-blue-800 mx-1" 
                            data-member-index="${memberIndex}" data-saving-index="${originalIndex}"
                            data-amount="${saving.amount}" data-type="${saving.type || 'tabungan'}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-delete-saving text-red-600 hover:text-red-800 mx-1" 
                            data-member-index="${memberIndex}" data-saving-index="${originalIndex}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>
            `);

            $('#savingsDetailTable').append(row);
        });

        // Show total amount
        $('#totalSavingsAmount').text(formatRupiah(totalSavings));
    }

    // Auto-backup data to Firestore every 5 minutes
    setInterval(function () {
        console.log('Auto-backup is running...');
        // Nothing to do here as we're directly writing to Firestore on each change
    }, 5 * 60 * 1000); // 5 minutes in milliseconds
});

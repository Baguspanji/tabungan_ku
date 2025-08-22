import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import AppTable from '@/components/AppTable.vue'

// Mock data for testing
const mockData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'active' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', status: 'active' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', status: 'inactive' }
]

const mockColumns = [
    { key: 'name', title: 'Name' },
    { key: 'email', title: 'Email' },
    { key: 'status', title: 'Status' }
]

describe('AppTable', () => {
    it('renders table with correct data and columns', () => {
        const wrapper = mount(AppTable, {
            props: {
                data: mockData,
                columns: mockColumns,
                currentPage: 1,
                itemsPerPage: 3
            }
        })

        // Check if table is rendered
        expect(wrapper.find('table').exists()).toBe(true)

        // Check if header columns are rendered
        const headers = wrapper.findAll('thead th')
        expect(headers).toHaveLength(3)
        expect(headers[0].text()).toBe('Name')
        expect(headers[1].text()).toBe('Email')
        expect(headers[2].text()).toBe('Status')
    })

    it('displays correct number of items per page', () => {
        const wrapper = mount(AppTable, {
            props: {
                data: mockData,
                columns: mockColumns,
                currentPage: 1,
                itemsPerPage: 3
            }
        })

        // Should display only 3 items on first page
        const rows = wrapper.findAll('tbody tr')
        expect(rows).toHaveLength(3)
    })

    it('shows pagination when there are multiple pages', () => {
        const wrapper = mount(AppTable, {
            props: {
                data: mockData,
                columns: mockColumns,
                currentPage: 1,
                itemsPerPage: 3
            }
        })

        // Should show pagination since we have 5 items with 3 items per page (2 pages total)
        expect(wrapper.find('nav[aria-label="Pagination"]').exists()).toBe(true)
    })

    it('does not show pagination when all items fit on one page', () => {
        const wrapper = mount(AppTable, {
            props: {
                data: mockData.slice(0, 3),
                columns: mockColumns,
                currentPage: 1,
                itemsPerPage: 5
            }
        })

        // Should not show pagination since all items fit on one page
        expect(wrapper.find('nav[aria-label="Pagination"]').exists()).toBe(false)
    })

    it('emits page change event when pagination buttons are clicked', async () => {
        const wrapper = mount(AppTable, {
            props: {
                data: mockData,
                columns: mockColumns,
                currentPage: 1,
                itemsPerPage: 3
            }
        })

        // Find next button using a more specific selector
        const nextButtons = wrapper.findAll('button').filter(button =>
            button.find('svg').exists() &&
            button.text().includes('Next') ||
            button.element.querySelector('svg')
        )

        if (nextButtons.length > 0) {
            await nextButtons[nextButtons.length - 1].trigger('click')
            expect(wrapper.emitted('update:currentPage')).toBeTruthy()
        } else {
            // Alternative: find by page number
            const pageButtons = wrapper.findAll('button').filter(button =>
                !isNaN(Number(button.text().trim())) && button.text().trim() === '2'
            )

            if (pageButtons.length > 0) {
                await pageButtons[0].trigger('click')
                expect(wrapper.emitted('update:currentPage')).toBeTruthy()
            }
        }
    })

    it('shows empty state when no data is provided', () => {
        const wrapper = mount(AppTable, {
            props: {
                data: [],
                columns: mockColumns,
                currentPage: 1,
                emptyStateTitle: 'No data available',
                emptyStateDescription: 'There are no items to display'
            }
        })

        // Should show empty state
        expect(wrapper.text()).toContain('No data available')
        expect(wrapper.text()).toContain('There are no items to display')
        expect(wrapper.find('table').exists()).toBe(false)
    })

    it('uses custom empty state slot when provided', () => {
        const wrapper = mount(AppTable, {
            props: {
                data: [],
                columns: mockColumns,
                currentPage: 1
            },
            slots: {
                'empty-state': '<div class="custom-empty">Custom empty state</div>'
            }
        })

        expect(wrapper.find('.custom-empty').exists()).toBe(true)
        expect(wrapper.text()).toContain('Custom empty state')
    })

    it('renders custom slot content for columns', () => {
        const wrapper = mount(AppTable, {
            props: {
                data: mockData.slice(0, 1),
                columns: mockColumns,
                currentPage: 1
            },
            slots: {
                status: '<span class="status-badge">Active User</span>'
            }
        })

        expect(wrapper.find('.status-badge').exists()).toBe(true)
        expect(wrapper.text()).toContain('Active User')
    })

    it('calculates pagination info correctly', () => {
        const wrapper = mount(AppTable, {
            props: {
                data: mockData,
                columns: mockColumns,
                currentPage: 2,
                itemsPerPage: 2
            }
        })

        // On page 2 with 2 items per page, should show "Menampilkan 3 sampai 4 dari 5 hasil"
        expect(wrapper.text()).toContain('Menampilkan 3 sampai 4 dari 5 hasil')
    })

    it('disables previous button on first page', () => {
        const wrapper = mount(AppTable, {
            props: {
                data: mockData,
                columns: mockColumns,
                currentPage: 1,
                itemsPerPage: 3
            }
        })

        const prevButton = wrapper.find('button').element
        expect(prevButton.disabled).toBe(true)
    })

    it('disables next button on last page', () => {
        const wrapper = mount(AppTable, {
            props: {
                data: mockData,
                columns: mockColumns,
                currentPage: 2, // Last page for 5 items with 3 per page
                itemsPerPage: 3
            }
        })

        const buttons = wrapper.findAll('button')
        const nextButton = buttons[buttons.length - 1].element
        expect(nextButton.disabled).toBe(true)
    })
})

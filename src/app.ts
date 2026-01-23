import './tailwind.css'
import './custom.scss'
import { createApp, onMounted, onBeforeUnmount, ref, computed, watch } from 'vue'
import { searchClient as algoliasearch } from '@algolia/client-search'
import { groupBy } from './utils'
import Clarity from '@microsoft/clarity'

const client = algoliasearch(algoliaAppId, algoliaApiKey)

// Initialize Vue app
createApp({
	setup() {
		Clarity.init(clarityProjectId)

		// Search related refs
		const searchText = ref('')
		const numberOfHits = ref<number>(0)
		const hits = ref<Record<string, any[]>>({})
		const searchModelRef = ref<HTMLElement>()
		const searchInput = ref<HTMLInputElement>()
		const isLoading = ref<boolean>(false)
		const selectedIndex = ref<number>(-1)

		// Computed flat list for navigation
		const flatHits = computed(() => {
			const flat: any[] = []
			Object.keys(hits.value).forEach((key) => {
				hits.value[key].forEach((item) => {
					flat.push(item)
				})
			})
			return flat
		})

		// Reset selection on search
		watch(searchText, () => {
			selectedIndex.value = -1
		})

		// Mobile menu ref
		const mobileMenuOpen = ref(false)

		// Image modal refs
		const imageModalVisible = ref(false)
		const imageModalSrc = ref('')
		const imageModalAlt = ref('')

		onMounted(() => {
			console.log('Welcome to gollahalli.com!', __GIT_HASH__)
			document.addEventListener('keydown', keyListener)
			initImageModal()
		})

		onBeforeUnmount(() => {
			document.removeEventListener('keydown', keyListener)
		})

		function keyListener(e: KeyboardEvent) {
			// Search Navigation
			if (!searchModelRef.value?.classList.contains('hidden')) {
				if (e.key === 'ArrowDown') {
					e.preventDefault()
					selectedIndex.value = Math.min(selectedIndex.value + 1, flatHits.value.length - 1)
					scrollToSelected()
				} else if (e.key === 'ArrowUp') {
					e.preventDefault()
					selectedIndex.value = Math.max(selectedIndex.value - 1, -1)
					scrollToSelected()
				} else if (e.key === 'Enter' && selectedIndex.value > -1) {
					e.preventDefault()
					const item = flatHits.value[selectedIndex.value]
					if (item) {
						window.location.href = item.uri
					}
				}
			}

			if (e.key === 'Escape') {
				if (!searchModelRef.value?.classList.contains('hidden')) {
					showSearchToggle()
				}
				if (imageModalVisible.value) {
					closeImageModal()
				}
			}
		}

		function scrollToSelected() {
			// Simple logic to scroll the selected item into view would go here
			// For now we rely on standard behavior or add specific logic if needed
			// But we need to expose selectedIndex to template to show highlighting
		}

		function toggleMobileMenu() {
			mobileMenuOpen.value = !mobileMenuOpen.value
		}

		function showSearchToggle() {
			if (searchModelRef.value?.classList.contains('hidden')) {
				searchModelRef.value.classList.remove('hidden')
				searchInput.value?.focus()
				selectedIndex.value = -1
			} else {
				searchModelRef.value?.classList.add('hidden')
				selectedIndex.value = -1
			}
		}

		async function searchAlgolia() {
			if (searchText.value === '') {
				hits.value = {}
				numberOfHits.value = 0
				return
			}

			isLoading.value = true

			try {
				const value = await client.searchSingleIndex({
					indexName: algoliaIndexName,
					searchParams: { query: searchText.value, hitsPerPage: 100 },
				})
				hits.value = groupBy(value.hits, 'section')
				numberOfHits.value = value.hits.length
			} catch (error) {
				console.error(error)
				hits.value = {}
				numberOfHits.value = 0
			} finally {
				isLoading.value = false
			}
		}

		// Image modal functions
		function initImageModal() {
			document.querySelectorAll('.prose img').forEach((img) => {
				const imgEl = img as HTMLImageElement
				if (imgEl.width < 100 || imgEl.height < 100) return

				imgEl.style.cursor = 'zoom-in'
				imgEl.addEventListener('click', () => {
					openImageModal(imgEl.src, imgEl.alt)
				})
			})
		}

		function openImageModal(src: string, alt: string) {
			imageModalSrc.value = src
			imageModalAlt.value = alt
			imageModalVisible.value = true
		}

		function closeImageModal() {
			imageModalVisible.value = false
			imageModalSrc.value = ''
			imageModalAlt.value = ''
		}

		function checkSelected(uri: string) {
			if (selectedIndex.value === -1) return false
			const selected = flatHits.value[selectedIndex.value]
			return selected && selected.uri === uri
		}

		return {
			// Search
			searchModelRef,
			searchInput,
			searchText,
			numberOfHits,
			hits,
			isLoading,
			selectedIndex, // Exported for template
			checkSelected, // Exported helper
			showSearchToggle,
			searchAlgolia,
			// Mobile menu
			mobileMenuOpen,
			toggleMobileMenu,
			// Image modal
			imageModalVisible,
			imageModalSrc,
			imageModalAlt,
			openImageModal,
			closeImageModal,
		}
	},
}).mount('#search-app')

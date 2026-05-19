import './tailwind.css'
import './custom.scss'
import { createApp, onMounted, onBeforeUnmount, ref, computed, watch, nextTick } from 'vue'
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
		const searchOpen = ref<boolean>(false)

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

			// Homepage-only background animation, lazy-loaded by type
			const automataCanvas = document.getElementById('automata-bg') as HTMLCanvasElement | null
			if (automataCanvas) {
				const type = automataCanvas.dataset.type
				if (type === 'mandelbrot') {
					import('./mandelbrot').then(({ initMandelbrot }) => initMandelbrot(automataCanvas))
				} else if (type === 'julia') {
					import('./julia').then(({ initJulia }) => initJulia(automataCanvas))
				} else if (type === 'attractors') {
					import('./attractors').then(({ initAttractors }) => initAttractors(automataCanvas))
				} else if (type === 'rd') {
					import('./rd').then(({ initRD }) => initRD(automataCanvas))
				} else if (type === 'physarum') {
					import('./physarum').then(({ initPhysarum }) => initPhysarum(automataCanvas))
				} else if (type === 'boids') {
					import('./boids').then(({ initBoids }) => initBoids(automataCanvas))
				} else if (type === 'lsystem') {
					import('./lsystem').then(({ initLSystem }) => initLSystem(automataCanvas))
				} else if (type === 'lissajous') {
					import('./lissajous').then(({ initLissajous }) => initLissajous(automataCanvas))
				} else if (type === 'penrose') {
					import('./penrose').then(({ initPenrose }) => initPenrose(automataCanvas))
				} else if (type === 'bubble') {
					import('./bubble').then(({ initBubble }) => initBubble(automataCanvas))
				} else if (type === 'buddhabrot') {
					import('./buddhabrot').then(({ initBuddhabrot }) => initBuddhabrot(automataCanvas))
				} else {
					import('./automata').then(({ initAutomata }) => initAutomata(automataCanvas))
				}
			}
		})

		onBeforeUnmount(() => {
			document.removeEventListener('keydown', keyListener)
		})

		function keyListener(e: KeyboardEvent) {
			// Search Navigation
			if (searchOpen.value) {
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
				} else if (e.key === 'Tab') {
					trapFocus(e)
				}
			}

			if (e.key === 'Escape') {
				if (searchOpen.value) {
					showSearchToggle()
				}
				if (imageModalVisible.value) {
					closeImageModal()
				}
			}
		}

		// Keep keyboard focus within the open search modal
		function trapFocus(e: KeyboardEvent) {
			const modal = searchModelRef.value
			if (!modal) return
			const focusable = Array.from(
				modal.querySelectorAll<HTMLElement>('a[href], button, input, [tabindex]:not([tabindex="-1"])'),
			).filter((el) => el.offsetParent !== null)
			if (focusable.length === 0) return

			const first = focusable[0]
			const last = focusable[focusable.length - 1]
			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault()
				last.focus()
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault()
				first.focus()
			}
		}

		// Scroll the highlighted search result into view during arrow-key navigation
		function scrollToSelected() {
			if (selectedIndex.value < 0) return
			nextTick(() => {
				const results = document.querySelectorAll<HTMLElement>('.search-result')
				results[selectedIndex.value]?.scrollIntoView({ block: 'nearest' })
			})
		}

		function toggleMobileMenu() {
			mobileMenuOpen.value = !mobileMenuOpen.value
		}

		function showSearchToggle() {
			searchOpen.value = !searchOpen.value
			selectedIndex.value = -1
			if (searchOpen.value) {
				nextTick(() => searchInput.value?.focus())
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
				// Make the zoomable image operable by keyboard, not just mouse.
				imgEl.tabIndex = 0
				imgEl.setAttribute('role', 'button')
				imgEl.setAttribute('aria-label', `Enlarge image${imgEl.alt ? `: ${imgEl.alt}` : ''}`)
				const open = () => openImageModal(imgEl.src, imgEl.alt)
				imgEl.addEventListener('click', open)
				imgEl.addEventListener('keydown', (e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault()
						open()
					}
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
			searchOpen, // Drives modal visibility / aria-expanded
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

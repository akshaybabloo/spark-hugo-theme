import './tailwind.css'
import './custom.scss'
import { createApp, reactive, onMounted, onBeforeUnmount, ref } from 'vue'
import {
	externalLink,
	facebook,
	github,
	hashTag,
	link,
	linkedin,
	mail,
	pinterest,
	reddit,
	search,
	times,
	twitter,
	maximize,
	pen,
	arrowLeft,
	arrowRight,
	rss,
} from './icons'
import { searchClient as algoliasearch } from '@algolia/client-search'
import { groupBy, getIconHtml } from './utils'
import Clarity from '@microsoft/clarity'

const client = algoliasearch(algoliaAppId, algoliaApiKey)

createApp({
	setup() {
		Clarity.init(clarityProjectId)

		const state = reactive({
			// Icons
			icons: {
				linkedin: getIconHtml(linkedin),
				github: getIconHtml(github),
				twitter: getIconHtml(twitter),
				search: getIconHtml(search),
				times: getIconHtml(times),
				hashTag: getIconHtml(hashTag),
				facebook: getIconHtml(facebook),
				pinterest: getIconHtml(pinterest),
				reddit: getIconHtml(reddit),
				mail: getIconHtml(mail),
				externalLink: getIconHtml(externalLink),
				link: getIconHtml(link),
				maximize: getIconHtml(maximize),
				pen: getIconHtml(pen),
				arrowRight: getIconHtml(arrowRight),
				arrowLeft: getIconHtml(arrowLeft),
				rss: getIconHtml(rss),
			},
		})

		// Search related refs
		const searchText = ref('')
		let numberOfHits = ref<number>(0)
		let hits = ref<Record<string, any[]>>({})
		const searchModelRef = ref<HTMLElement>()
		const searchInput = ref<HTMLInputElement>()
		const showMenu = ref<boolean>(true)
		const isLoading = ref<boolean>(false)

		// Image-related refs
		const imageModel = ref<HTMLElement>()
		const imageModelSrc = ref<HTMLImageElement>()

		onMounted(() => {
			console.log('Welcome to my gollahalli.com!', __GIT_HASH__)
			document.addEventListener('keydown', escapeKeyListener)
		})

		onBeforeUnmount(() => {
			document.removeEventListener('keydown', escapeKeyListener)
		})

		function escapeKeyListener(e: KeyboardEvent) {
			if (e.key === 'Escape' && !searchModelRef.value?.classList.contains('hidden')) {
				showSearchToggle()
			}
		}

		function showMenuToggle() {
			console.log('showMenuToggle')
			showMenu.value = !showMenu.value
		}

		function showSearchToggle() {
			if (searchModelRef.value?.classList.contains('hidden')) {
				searchModelRef.value.classList.remove('hidden')
				searchInput.value?.focus()
			} else {
				searchModelRef.value?.classList.add('hidden')
			}
		}

		function toggleMaximizeImage() {
			if (imageModel.value?.classList.contains('hidden')) {
				imageModel.value.classList.remove('hidden')
			} else {
				imageModel.value?.classList.add('hidden')
				if (imageModelSrc.value) {
					imageModelSrc.value.src = ''
				}
			}
		}

		function maximizeImage(event: PointerEvent, imgSrc: string) {
			if (imageModelSrc.value) {
				imageModelSrc.value.src = imgSrc
			}
		}

		function outsideClick(event: PointerEvent, from: string) {
			switch (from) {
				case 'searchModelRef':
					showSearchToggle()
					break
				case 'imageModel':
					toggleMaximizeImage()
					break
				default:
					break
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

		return {
			...state,
			searchModelRef,
			searchInput,
			imageModel,
			imageModelSrc,
			searchText,
			numberOfHits,
			hits,
			isLoading,
			escapeKeyListener,
			showMenuToggle,
			showSearchToggle,
			toggleMaximizeImage,
			maximizeImage,
			outsideClick,
			searchAlgolia,
			showMenu,
		}
	},
}).mount('#profile')

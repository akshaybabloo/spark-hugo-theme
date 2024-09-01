import "./main.scss";
import {createApp, reactive, onMounted, onBeforeUnmount, ref} from "vue";
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
} from "./icons";
import {liteClient as algoliasearch} from "algoliasearch/lite";
import {groupBy, getIconHtml} from "./utils";

// @ts-ignore
const client = algoliasearch(algoliaAppId, algoliaApiKey);

createApp({
    setup() {
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
        });

        // Search related refs
        const searchText = ref("");
        let numberOfHits = ref<number>(0);
        let hits = ref<Record<string, any[]>>({})
        const searchModelRef = ref<HTMLElement>();
        const showMenu = ref<boolean>(true);

        // Image related refs
        const imageModel = ref<HTMLElement>();
        const imageModelSrc = ref<HTMLImageElement>();

        onMounted(() => {
            console.log("Welcome to my gollahalli.com!", __GIT_HASH__);
            document.addEventListener('keydown', escapeKeyListener);
        });

        onBeforeUnmount(() => {
            document.removeEventListener('keydown', escapeKeyListener);
        });

        function escapeKeyListener(e: KeyboardEvent) {
            if (e.key === 'Escape' && !searchModelRef.value?.classList.contains("hidden")) {
                showSearchToggle();
            }
        }

        function showMenuToggle() {
            console.log("showMenuToggle")
            showMenu.value = !showMenu.value;
        }

        function showSearchToggle() {
            if (searchModelRef.value?.classList.contains("hidden")) {
                searchModelRef.value.classList.remove("hidden");
            } else {
                searchModelRef.value?.classList.add("hidden");
            }
        }

        function toggleMaximizeImage() {
            if (imageModel.value?.classList.contains("hidden")) {
                imageModel.value.classList.remove("hidden");
            } else {
                imageModel.value?.classList.add("hidden");
                if (imageModelSrc.value) {
                    imageModelSrc.value.src = "";
                }
            }
        }

        function maximizeImage(event: PointerEvent, imgSrc: string) {
            if (imageModelSrc.value) {
                imageModelSrc.value.src = imgSrc;
            }
        }

        function outsideClick(event: PointerEvent, from: string) {
            switch (from) {
                case "searchModelRef":
                    showSearchToggle();
                    break;
                case "imageModel":
                    toggleMaximizeImage();
                    break;
                default:
                    break;
            }
        }

        async function searchAlgolia() {
            if (searchText.value === "") {
                hits.value = {};
                numberOfHits.value = 0;
                return;
            }

            try {
                //@ts-ignore
                const value = await client.search({
                    requests: [
                        {query: searchText.value, indexName: algoliaIndexName}
                    ],
                });
                hits.value = groupBy(value.results[0].hits, "section");
                numberOfHits.value = value.results[0].hits.length;
            } catch (error) {
                console.error(error);
                hits.value = {};
                numberOfHits.value = 0;
            }
        }

        return {
            ...state,
            searchModelRef,
            imageModel,
            imageModelSrc,
            searchText,
            numberOfHits,
            hits,
            escapeKeyListener,
            showMenuToggle,
            showSearchToggle,
            toggleMaximizeImage,
            maximizeImage,
            outsideClick,
            searchAlgolia,
            showMenu
        };
    }
}).mount("#profile");

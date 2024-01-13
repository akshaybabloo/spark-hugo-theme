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
import algoliasearch from "algoliasearch/lite";
import {groupBy, getIconHtml} from "./utils";

// @ts-ignore
const client = algoliasearch(algoliaAppId, algoliaApiKey);
// @ts-ignore
const index = client.initIndex(algoliaIndexName);

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
            searchText: "",
            hits: [],
            numberOfHits: 0,
            showMenu: true,
        });

        const searchModel = ref(null);
        const imageModel = ref(null);
        const imageModelSrc = ref(null);

        onMounted(() => {
            document.addEventListener('keydown', escapeKeyListener);
        });

        onBeforeUnmount(() => {
            document.removeEventListener('keydown', escapeKeyListener);
        });

        function escapeKeyListener(e) {
            if (e.key === 'Escape' && !searchModel.value.classList.contains("hidden")) {
                showSearchToggle();
            }
        }

        function showMenuToggle() {
            state.showMenu = !state.showMenu;
        }

        function showSearchToggle() {
            if (searchModel.value.classList.contains("hidden")) {
                searchModel.value.classList.remove("hidden");
            } else {
                searchModel.value.classList.add("hidden");
            }
        }

        function toggleMaximizeImage() {
            if (imageModel.value.classList.contains("hidden")) {
                imageModel.value.classList.remove("hidden");
            } else {
                imageModel.value.classList.add("hidden");
                imageModelSrc.value.src = "";
            }
        }

        function maximizeImage(event, imgSrc) {
            imageModelSrc.value.src = imgSrc;
        }

        function outsideClick(event, from) {
            switch (from) {
                case "searchModel":
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
            if (state.searchText === "") {
                state.hits = [];
                state.numberOfHits = 0;
                return;
            }

            try {
                const value = await index.search(state.searchText);
                state.hits = groupBy(value.hits, "section");
                state.numberOfHits = value.nbHits;
            } catch (error) {
                console.error(error);
                state.hits = [];
                state.numberOfHits = 0;
            }
        }

        return {
            ...state,
            searchModel,
            imageModel,
            imageModelSrc,
            escapeKeyListener,
            showMenuToggle,
            showSearchToggle,
            toggleMaximizeImage,
            maximizeImage,
            outsideClick,
            searchAlgolia
        };
    }
}).mount("#profile");

import './main.scss';
import {createApp} from "vue";
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
    arrowRight
} from "./icons";
import algoliasearch from "algoliasearch/lite";
import {groupBy} from "lodash";
import { Icon } from '@fortawesome/fontawesome-svg-core';


// @ts-ignore
const client = algoliasearch(algoliaAppId, algoliaApiKey);
// @ts-ignore
const index = client.initIndex(algoliaIndexName);

function getIconHtml(icon: Icon) {
    return icon.html.pop();
}

createApp({
    data() {
        return {
            // icons
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

            searchText: "",
            hits: [],
            numberOfHits: 0,

            showMenu: true,
        }
    },
    methods: {
        showMenuToggle: function () {
            this.showMenu = !this.showMenu;
        },
        showSearchToggle: function () {
            const searchModel = this.$refs.searchModel as HTMLDivElement;
            if (searchModel.classList.contains("hidden")) {
                searchModel.classList.remove("hidden");
            } else {
                searchModel.classList.add("hidden");
            }
        },
        toggleMaximizeImage: function () {
            const imageModel = this.$refs.imageModel as HTMLDivElement;
            const imageModelSrc = this.$refs.imageModelSrc as HTMLImageElement;
            if (imageModel.classList.contains("hidden")) {
                imageModel.classList.remove("hidden");
            } else {
                imageModel.classList.add("hidden");
                imageModelSrc.src = "";
            }
        },
        maximizeImage: function (event: PointerEvent, imgSrc: string) {
            const imageModelSrc = this.$refs.imageModelSrc as HTMLImageElement;
            imageModelSrc.src = imgSrc;            
        },
        outsideClick: function (event: PointerEvent) {
            const searchModel = this.$refs.innerContainer as HTMLDivElement;
            if (!searchModel.contains(event.target as Node)) {
                this.showSearchToggle();
            }
        },
        searchAlgolia: async function () {
            // Clear results when the search text is empty
            if (this.searchText === "") {
                this.hits = [];
                this.numberOfHits = 0;
                return;
            }
        
            try {
                // Get the results from Algolia
                const value = await index.search(this.searchText);
        
                // Update the hits and number of hits
                this.hits = groupBy(value.hits, "section");
                this.numberOfHits = value.nbHits;
            } catch (error) {
                // Log the error and clear the results
                console.error(error);
                this.hits = [];
                this.numberOfHits = 0;
            }
        }
    }
}).mount("#profile");


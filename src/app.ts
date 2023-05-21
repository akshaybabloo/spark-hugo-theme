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
import {groupBy, includes} from "lodash";
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
            if (includes(imageModel.classList, "hidden")) {
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
        searchAlgolia: function (event: HTMLInputElement) {
            if (this.searchText === "") {
                this.numberOfHits = 0;
                this.hits = [];
                return;
            }
            index.search(this.searchText).then(value => {
                this.numberOfHits = value.nbHits;
                // @ts-ignore
                this.hits = groupBy(value.hits, "section");
            }).catch(reason => {
                console.error(reason);
            })
        }
    }
}).mount("#profile");


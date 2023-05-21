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


// @ts-ignore
const client = algoliasearch(algoliaAppId, algoliaApiKey);
// @ts-ignore
const index = client.initIndex(algoliaIndexName);

createApp({
    data() {
        return {
            // icons
            linkedin: linkedin.html.pop(),
            github: github.html.pop(),
            twitter: twitter.html.pop(),
            search: search.html.pop(),
            times: times.html.pop(),
            hashTag: hashTag.html.pop(),
            facebook: facebook.html.pop(),
            pinterest: pinterest.html.pop(),
            reddit: reddit.html.pop(),
            mail: mail.html.pop(),
            externalLink: externalLink.html.pop(),
            link: link.html.pop(),
            maximize: maximize.html.pop(),
            pen: pen.html.pop(),
            arrowRight: arrowRight.html.pop(),
            arrowLeft: arrowLeft.html.pop(),

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
            if (includes(searchModel.classList, "hidden")) {
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


import {icon, library,} from '@fortawesome/fontawesome-svg-core'
import {faFacebook, faGithub, faLinkedin, faPinterest, faReddit, faTwitter} from '@fortawesome/free-brands-svg-icons';
import {faEnvelope, faExternalLinkAlt, faHashtag, faSearch, faTimes, faLink} from '@fortawesome/free-solid-svg-icons';

library.add(
    faGithub,
    faTwitter,
    faLinkedin,
    faSearch,
    faTimes,
    faHashtag,
    faFacebook,
    faPinterest,
    faReddit,
    faEnvelope,
    faExternalLinkAlt,
    faLink
);

export const linkedin = icon({prefix: 'fab', iconName: 'linkedin'}, {transform: {size: 30}});
export const github = icon({prefix: 'fab', iconName: 'github'}, {transform: {size: 30}});
export const twitter = icon({prefix: 'fab', iconName: 'twitter'}, {transform: {size: 30}});
export const facebook = icon({prefix: 'fab', iconName: 'facebook'}, {transform: {size: 30}});
export const pinterest = icon({prefix: 'fab', iconName: 'pinterest'}, {transform: {size: 30}});
export const reddit = icon({prefix: 'fab', iconName: 'reddit'}, {transform: {size: 30}});

export const search = icon({prefix: 'fas', iconName: 'search'}, {transform: {size: 20}});
export const times = icon({prefix: 'fas', iconName: 'times'}, {transform: {size: 20}});
export const hashTag = icon({prefix: 'fas', iconName: 'hashtag'});
export const externalLink = icon({prefix: 'fas', iconName: 'external-link-alt'});
export const mail = icon({prefix: 'fas', iconName: 'envelope'}, {transform: {size: 30}});
export const link = icon({prefix: 'fas', iconName: 'link'}, {transform: {size: 10}});

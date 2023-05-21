import { Icon } from "@fortawesome/fontawesome-svg-core";

export function groupBy(array: Array<any>, key: string) {
    return array.reduce((result, currentItem) => {
        (result[currentItem[key]] = result[currentItem[key]] || []).push(currentItem);
        return result;
    }, {});
}

export function getIconHtml(icon: Icon) {
	return icon.html.pop();
}

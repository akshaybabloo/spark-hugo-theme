import { Icon } from "@fortawesome/fontawesome-svg-core";

export function groupBy(array: Array<any>, key: string): { [key: string]: any[] } {
    return array.reduce((result, currentItem) => {
        (result[currentItem[key]] = result[currentItem[key]] || []).push(currentItem);
        return result;
    }, {});
}

export function getIconHtml(icon: Icon): string | undefined {
	return icon.html[0];
}

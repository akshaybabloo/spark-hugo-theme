import { Icon } from "@fortawesome/fontawesome-svg-core";

/**
 * This function groups an array of objects by a specific key.
 * 
 * @param array - The array of objects that you want to group.
 * @param key - The key in the objects that you want to group by.
 * @returns An object where each key is a unique value from the 'key' parameter, 
 * and each value is an array of objects from the input array that have that key's value.
 *
 * @example
 *
 *    let arr = [{section: 'A', value: 1}, {section: 'B', value: 2}, {section: 'A', value: 3}];
 *    let grouped = groupBy(arr, 'section');
 *    console.log(grouped); // Output: { 'A': [{section: 'A', value: 1}, {section: 'A', value: 3}], 'B': [{section: 'B', value: 2}] }
 */
export function groupBy<T extends object>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce((result: Record<string, T[]>, currentItem: T) => {
        (result[String(currentItem[key])] = result[String(currentItem[key])] || []).push(currentItem);
        return result;
    }, {});
}

export function getIconHtml(icon: Icon) {
    return icon.html.pop();
}

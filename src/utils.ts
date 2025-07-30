import { Icon } from '@fortawesome/fontawesome-svg-core'

/**
 * Group an array of objects by a key
 *
 * @param array Source array
 * @param key Key to group by
 */
export function groupBy(array: Array<any>, key: string): Record<string, any[]> {
	return array.reduce((result, currentItem) => {
		;(result[currentItem[key]] = result[currentItem[key]] || []).push(currentItem)
		return result
	}, {})
}

/**
 * Get the first html string from an icon object
 *
 * @param icon Icon object
 */
export function getIconHtml(icon: Icon): string | undefined {
	return icon.html[0]
}

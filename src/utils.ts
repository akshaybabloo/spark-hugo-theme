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

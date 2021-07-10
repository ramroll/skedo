import {fetchJsonFactory, fetchUploadImageFactory} from '@skedo/core'
export default class Fetch {
	static fetchJson = fetchJsonFactory(fetch)
	static fetchUploadImage = fetchUploadImageFactory(fetch, FormData)
}

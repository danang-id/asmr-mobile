import {Dirs, FileSystem} from 'react-native-file-access';
import {API_BASE_URL} from '@env';
import Logger from '../common/Logger';

class FileCaching {
	static #tag = FileCaching.name;
	static #getResourceId = (resourceUrl: string) => resourceUrl.substring(resourceUrl.lastIndexOf('/') + 1);
	static #getResourcePath = (resourceUrl: string) =>
		Dirs.CacheDir + '/' + FileCaching.#getResourceId(resourceUrl) + '.rescache';

	// Return true if resource successfully cached
	static async fetchToCache(resourceUrl: string): Promise<boolean> {
		const resourcePath = FileCaching.#getResourcePath(resourceUrl);
		const isResourceExist = await FileSystem.exists(resourcePath);
		if (!isResourceExist) {
			Logger.info(FileCaching.#tag, 'Cache does not exist, fetching from ' + resourceUrl);
			const response = await FileSystem.fetch(API_BASE_URL + resourceUrl, {
				path: resourcePath,
			});

			Logger.info(FileCaching.#tag, 'Is fetching ok?', response.ok);
			return response.ok;
		} else {
			Logger.info(FileCaching.#tag, 'Cache exists');
		}

		return true;
	}

	// Return base-64 encoded resource file
	static async readCacheOrFetch(resourceUrl: string): Promise<string> {
		const resourcePath = FileCaching.#getResourcePath(resourceUrl);
		Logger.info(FileCaching.#tag, 'Read cache or fetch from ' + resourcePath);
		return (await this.fetchToCache(resourceUrl)) ? await FileSystem.readFile(resourcePath, 'base64') : '';
	}

	static async removeCache(resourceUrl: string) {
		const resourcePath = FileCaching.#getResourcePath(resourceUrl);
		const isResourceExist = await FileSystem.exists(resourcePath);
		if (isResourceExist) {
			Logger.info(FileCaching.#tag, 'Removing cache from ' + resourcePath);
			await FileSystem.unlink(resourcePath);
		}
	}
}

export default FileCaching;

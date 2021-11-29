import {CancelTokenSource} from 'axios';
import ResponseModelBase from '../core/common/ResponseModelBase';
import AndroidReleaseInformation from '../core/release/common/AndroidReleaseInformation';
import iOSReleaseInformation from '../core/release/common/iOSReleaseInformation';
import type {SetProgressInfo} from '../libs/context/ProgressContextInfo';
import ServiceBase, {ServiceOptions} from './ServiceBase';

export default class ReleaseService extends ServiceBase {
	#servicePath = '/api/release/';

	constructor(cancelTokenSource: CancelTokenSource, setProgress: SetProgressInfo, options?: ServiceOptions) {
		super(cancelTokenSource, setProgress, options);
		super.tag = ReleaseService.name;
	}

	async getMobileReleaseInformation(): Promise<ResponseModelBase<AndroidReleaseInformation | iOSReleaseInformation>> {
		try {
			this._start();
			const response = await this.client.get(this.#servicePath + 'mobile');
			return this._processData(response);
		} finally {
			this._finalize();
		}
	}
}

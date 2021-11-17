import {CancelTokenSource} from 'axios';
import ResponseModelBase from '../core/common/ResponseModelBase';
import ASMRMobileReleaseInformation from '../core/releases/ASMRMobileReleaseInformation';
import type {SetProgressInfo} from '../libs/context/ProgressContextInfo';
import ServiceBase, {ServiceOptions} from './ServiceBase';

export default class ReleaseService extends ServiceBase {
	#servicePath = '/api/release/';

	constructor(cancelTokenSource: CancelTokenSource, setProgress: SetProgressInfo, options?: ServiceOptions) {
		super(cancelTokenSource, setProgress, options);
		super.tag = ReleaseService.name;
	}

	async getMobileReleaseInformation(): Promise<ResponseModelBase<ASMRMobileReleaseInformation>> {
		try {
			this._start();
			const response = await this.client.get(this.#servicePath + 'mobile');
			return this._processData(response);
		} finally {
			this._finalize();
		}
	}
}
import {createContext, Context} from 'react';
import type {ProgressContextInfo} from './ProgressContextInfo';

const ProgressContext: Context<ProgressContextInfo> = createContext([{loading: false, percentage: 0}, () => {}]);

export default ProgressContext;

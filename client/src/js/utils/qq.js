import { __myAppConfig as myConfig } from './env-config';

console.log(myConfig);
const __LOG = !myConfig.env.isProd;
const __qq = { log: __LOG ? console.log : () => null, error: console.error };

export default __qq;

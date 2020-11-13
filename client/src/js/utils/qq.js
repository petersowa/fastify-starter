const __LOG = !process.env.isProd;
const __qq = { log: __LOG ? console.log : () => null, error: console.error };

export default __qq;

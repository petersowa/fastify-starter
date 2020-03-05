import dotenv from 'dotenv';
console.log('***CONFIGS***', process.env.NODE_ENV, process.env);
if (process.env.NODE_ENV !== 'production') {
	const result = dotenv.config();
	if (result.error) {
		throw result.error;
	}
}

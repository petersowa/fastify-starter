import bcrypt from 'bcrypt';

/*
	Per bcrypt implementation, only the first 72 bytes
	of a string are used. Any extra bytes are ignored
	when matching passwords. Note that this is not the
	first 72 characters. It is possible for a string
	to contain less than 72 characters, while taking
	up more than 72 bytes (e.g. a UTF-8 encoded string 
	containing emojis).
*/

const saltRounds = 12;

function hash(pw: string): Promise<string> {
	return bcrypt.hash(pw, saltRounds);
}

function compare(pw: string, hash: string): Promise<boolean> {
	return bcrypt.compare(pw, hash);
}

export { hash, compare };

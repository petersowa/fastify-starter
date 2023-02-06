export interface Flash {
	add: (type: string, message: string) => void;
	get: (type: string) => string;
}

const flash = (): Flash => {
	interface FlashMessagesType {
		[propName: string]: string[] | undefined;
	}
	const messages: FlashMessagesType = {};

	function add(type: string, message: string): void {
		if (!(type in messages)) messages[type] = [];
		messages[type]?.push(message);
		console.log('flash add', { messages });
	}
	function get(type: string): string {
		console.log('flash get', { messages });
		if (!(type in messages)) return '';
		const typeMessages = messages[type] || [''];
		return typeMessages.pop() || '';
	}
	return { add, get };
};

export default flash;

function sessionInfo(): Record<string, unknown> {
	let info = {};
	function getInfo(): Record<string, unknown> {
		return info;
	}
	function setInfo(data: Record<string, unknown>): void {
		info = data;
	}
	return { getInfo, setInfo };
}

const appState = {
	modal: 'loginForm',
	info: sessionInfo(),
};

export default appState;

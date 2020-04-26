function sessionInfo(): {} {
	let info = {};
	function getInfo(): {} {
		return info;
	}
	function setInfo(data: {}): void {
		info = data;
	}
	return { getInfo, setInfo };
}

const appState = {
	modal: 'loginForm',
	info: sessionInfo(),
};

export default appState;

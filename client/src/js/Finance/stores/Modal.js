import { writable } from 'svelte/store';

function setModal(modal) {
	modalStore.update((data) => {
		return { ...data, modal };
	});
}

function clearModal() {
	modalStore.update((data) => {
		return { ...data, modal: { component: null } };
	});
}

const modalStore = writable({
	modal: { component: null, data: null },
});

export { modalStore, setModal, clearModal };

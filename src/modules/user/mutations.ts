import { api } from '$lib/api';

type SetUserTraderStatusParams = {
	isTrader: boolean;
};

export async function setUserTraderStatus({ isTrader }: SetUserTraderStatusParams) {
	return await api({
		url: `/trader-declaration`,
		method: 'PUT',
		data: {
			is_trader: isTrader
		}
	});
}

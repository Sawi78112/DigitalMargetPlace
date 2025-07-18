import { api, formData } from '$lib/api';
import type { TaxInformation } from '$lib/types';
import type { NewTaxInformationSchema } from './schemas';

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

export async function createTaxInformation(data: NewTaxInformationSchema): Promise<TaxInformation> {
	return api<TaxInformation>({
		url: '/tax-information',
		method: 'POST',
		data
	});
}

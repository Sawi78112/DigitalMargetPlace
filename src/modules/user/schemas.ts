import { z } from 'zod';
import type { Infer } from 'sveltekit-superforms';

export const newTaxInformationSchema = z.object({
	country: z.string().min(1, { message: 'Country is required' }),
	enabled_newsletter: z.boolean().optional(),
	acknowledged_certification: z.boolean({
		required_error: 'You must acknowledge the certification'
	})
});

export type NewTaxInformationSchema = Infer<typeof newTaxInformationSchema>;

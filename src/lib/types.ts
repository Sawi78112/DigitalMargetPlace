export type ApiError = {
	message: string;
	status: number;
	errors?: string[];
	fieldErrors?: Record<string, string>;
};

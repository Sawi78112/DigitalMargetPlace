export type ApiError = {
	message: string;
	status: number;
	errors?: string[];
	fieldErrors?: Record<string, string>;
};

export type User = {
	email: string;
	created_at: string;
	updated_at: string;
};

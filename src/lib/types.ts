export type UserRole = 'admin' | 'user';

export type ApiError = {
	message: string;
	status: number;
	errors?: string[];
	fieldErrors?: Record<string, string>;
};

export type AuthResult = {
	token: string;
	token_expiry: string;
};

export type Email = {
	email: string;
};

export type Password = {
	current_password: string;
	password: string;
};

export type User = {
	id: string;
	email: string;
	verified_at?: string;
	created_at: string;
	updated_at: string;
};

export type Profile = {
	id: string;
	first_name: string;
	middle_name: string;
	last_name: string;
	birthdate: string;
	gender: string;
	created_at: string;
	updated_at: string;
	user_id: string;
};

export type ForgotPasswordRequestResult = {
	id: string;
};

export type Product = {
	id: string;
	name: string;
	description: string;
	categories: string[];
};

export type Categories = {
	name: string;
	id: string;
};

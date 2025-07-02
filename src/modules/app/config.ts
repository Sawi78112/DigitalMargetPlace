import {
	ChartColumnIncreasing,
	CircleDollarSign,
	House,
	Library,
	Mail,
	ShoppingBag,
	Store,
	UsersRound,
	Workflow
} from 'lucide-svelte';
import type { ComponentType } from 'svelte';

export type BaseLink = {
	url: `/${string}`;
	icon: ComponentType;
	title: string;
};

export type SubLink = Omit<BaseLink, 'icon'>;

export const links = [
	{ title: 'Home', url: '/home', icon: House },
	{ title: 'Products', url: '/products', icon: Store },
	{ title: 'Collaborators', url: '/collaborators', icon: UsersRound },
	{ title: 'Checkout', url: '/checkout', icon: ShoppingBag },
	{ title: 'Emails', url: '/emails', icon: Mail },
	{ title: 'Workflows', url: '/workflows', icon: Workflow },
	{ title: 'Sales', url: '/sales', icon: CircleDollarSign },
	{ title: 'Analytics', url: '/analytics', icon: ChartColumnIncreasing },
	{ title: 'Payouts', url: '/payouts', icon: CircleDollarSign },
	{ title: 'Library', url: '/library', icon: Library }
];

export const GENDER = ['Female', 'Male'];

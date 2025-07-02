import type { ColumnDef } from '@tanstack/table-core';

import { ProductTableActions } from '.';
import type { Product } from '$lib/types';
import { renderComponent } from '$lib/components/ui/data-table/index.js';

export const columns: ColumnDef<Product>[] = [
	{
		accessorKey: 'title',
		header: 'Title'
	},
	{
		accessorKey: 'description',
		header: 'Description'
	},
	{
		accessorKey: 'price',
		header: 'Price'
	},
	{
		accessorKey: 'visibility',
		header: 'Visibility'
	},
	{
		accessorKey: 'categories',
		header: 'Categories'
	},
	{
		accessorKey: 'id',
		header: '',
		cell: ({ row }) => {
			return renderComponent(ProductTableActions, {
				product: row.original
			});
		}
	}
];

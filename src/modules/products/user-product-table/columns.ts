import type { ColumnDef } from '@tanstack/table-core';

import { ProductTableActions } from '.';
import type { Product } from '$lib/types';
import { renderComponent } from '$lib/components/ui/data-table/index.js';

export const columns: ColumnDef<Product>[] = [
	{
		accessorKey: 'name',
		header: 'Name'
	},
	{
		accessorKey: 'description',
		header: 'Description'
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

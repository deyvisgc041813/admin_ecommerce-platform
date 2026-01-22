import { Category } from "./category.interface";

export interface SubCategory {
    id?: number,
    subcategory_name?: string,
    category_id?: number,
    status?: string,
    alias_subcategory?: string,
    categoRy?: Category,
    type_sub_category: string,
    path: string,
}
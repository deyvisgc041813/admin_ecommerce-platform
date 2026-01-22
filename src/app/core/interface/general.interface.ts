export interface ICategoriaHome {
    categoryId?: number,
    subCategoria: ISubCategoriaHome[];
    name: string;
    color: string;
}
export interface ISubCategoriaHome {
    subcategoryId?: number
    category_id?: number
    name: string;
    path:string;
}
export interface FilterList {
    page: number,
    size: number,
    storeId?: number,
    data?: any 
}
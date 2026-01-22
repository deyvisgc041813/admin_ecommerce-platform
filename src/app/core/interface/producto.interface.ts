import { SubCategory } from "./subcategory.interface";

export interface Producto {
  id?: number,
  nombre: string,
  codigo?: string;
  subCategoria: SubCategory,
  modelo: string,
  descuento: number,
  marca: Marca,
  color: string,
  capacidad: number,
  descripcion: string,
  llevateHoy: string,
  ofertaEspecial: string,
  destacadoSemana: string,
  nuevoProducto: string,
  main_image_url?: File,
  imageDetails?: any,
  imageDeleted?: Object[],
  store: any[],
  recojoDespacho:string,
  is_accesorio: string,
  garantia?:string,
  accesorios?: any[]
}
export interface Marca {
  id? : number,
  name:  string,
  param_filters?: string,
  brand_img_url: string,
  brand_name: string,
  publicId_img?: string
}
export interface Color {
  id? : number,
  name:  string,
  param_filters?: string
}
export interface Garantia {
  id? : number,
  name:  string,
}
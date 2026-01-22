import { Category } from "./category.interface";

export interface Company {
    company_id?: number,
    email: string,
    facebook?: string,
    instagram?: number,
    logo: string,
    name: string,
    phone: Category,
    publicId: string,
    razon_social: string,
    bank_name:string,
    currency:string,
    interbank_account_number:string,
    account_number:string,
    ruc: string,
    status: string,
    tictock: string,
    twitter: string,
}
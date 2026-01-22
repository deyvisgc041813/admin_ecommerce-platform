

export interface Sede {
    store_id?: number,
    company_id: number,
    address: number,
    name: string,
    email:string,
    phone: string,
    created_at?: string,
    status?: string,
    departament_id: string,
    province_id: string,
    district_id: string
    departamento?: string,
    provincia?: string,
    distrito?: string,
    selected?:string
}
export interface Configurations {
    configuration_id?: number,
    company_id:number,
    type_service:string,
    public_key?: string,
    private_key?:string,
    expiration_date?:string,
    description?:string,
    name_service?:string,
    endpoint_url?:string,
    status?: string
}

import { environment } from "src/environments/environment";
export class UriConstante {
  public static readonly URL_UPLOAD_FILE_DEFAULT =
    environment.API_BASE_URL + "file_model";
  public static readonly AUTHENTICATION_RESOURCE = environment.API_BASE_URL + "authentication";
  public static readonly USERS_RESOURCE = environment.API_BASE_URL + "users";
  public static readonly PERMISSIONS_RESOURCE = environment.API_BASE_URL + "permissions";
  public static readonly MODULES_RESOURCE = environment.API_BASE_URL + "modules";
  public static readonly ROLES_RESOURCE = environment.API_BASE_URL + "role";
  public static readonly ROLES_PERMISSIONS_MODULES_RESOURCE = environment.API_BASE_URL + "role_permissions_modules";
  public static readonly ROLES_MODULES_RESOURCE = environment.API_BASE_URL + "roles_modules";
  public static readonly PRODUCT_RESOURCE =
    environment.API_BASE_URL + "product";
  public static readonly MENU_RESOURCE = environment.API_BASE_URL + "menu";
  public static readonly ECOMERCE_RESOURCE =
    environment.API_BASE_URL + "ecomerce";
  public static readonly CATEGORY_RESOURCE =
    environment.API_BASE_URL + "category";
  public static readonly BRAND_RESOURCE = environment.API_BASE_URL + "brand";
    public static readonly CONFIGURATIONS_RESOURCE = environment.API_BASE_URL + "configurations";
  public static readonly COMPANY_RESOURCE =
    environment.API_BASE_URL + "company";
  public static readonly SEDE_RESOURCE = environment.API_BASE_URL + "sede";
  public static readonly ORDER_RESOURCE = environment.API_BASE_URL + "order";
  public static readonly SUBCATEGORY_RESOURCE =
    environment.API_BASE_URL + "subCategory";

  public static readonly DEPARTAMENT_RESOURCE =
    environment.API_BASE_URL.replace("api/v1/admin/", "") + "departament";
  public static readonly PROVINCIA_RESOURCE =
    environment.API_BASE_URL.replace("api/v1/admin/", "") + "province";
  public static readonly DISTRITO_RESOURCE =
    environment.API_BASE_URL.replace("api/v1/admin/", "") + "district";
}
import { Color, Garantia } from "../interface/producto.interface";

export class DataDefault {
  public static readonly COLORDEFAULT: Color[] = [
    {
      id: 1,
      name: "Arena",
    },
    {
      id: 2,
      name: "Azul",
    },
    {
      id: 3,
      name: "Negro",
    },
    {
      id: 4,
      name: "Crema",
    },
    {
      id: 5,
      name: "Naranja",
    },
    {
      id: 6,
      name: "Celeste",
    },
    {
      id: 7,
      name: "Blanco",
    },
    {
      id: 8,
      name: "Otro",
    },
  ];
  public static readonly CAPACIDADLITROSDEFAULT: Color[] = [
    {
      id: 1,
      name: "250",
    },
    {
      id: 2,
      name: "600",
    },
    {
      id: 3,
      name: "750",
    },
    {
      id: 4,
      name: "1100",
    },
    {
      id: 5,
      name: "1200",
    },
    {
      id: 6,
      name: "1300",
    },
    {
      id: 7,
      name: "1500",
    },
    {
      id: 8,
      name: "2500",
    },
    {
      id: 9,
      name: "2800",
    },
  ];
  public static readonly CAPACIDADPERSONASDEFAULT: Color[] = [
    {
      id: 1,
      name: "2",
    },
    {
      id: 2,
      name: "5",
    },
    {
      id: 3,
      name: "7",
    },
    {
      id: 4,
      name: "10",
    },
    {
      id: 5,
      name: "15",
    },
  ];
  public static readonly PROMOCIONESDEFAULT: Color[] = [
    {
      id: 1,
      name: "10%",
    },
    {
      id: 2,
      name: "20%",
    },
    {
      id: 3,
      name: "30%",
    },
    {
      id: 4,
      name: "40%",
    },
    {
      id: 5,
      name: "50&",
    },
  ];
  public static readonly GARANTIADEFAULT: Garantia[] = [
    {
      id: 1,
      name: "De por vida",
    },
    {
      id: 2,
      name: "1 año",
    },
    {
      id: 3,
      name: "2 años",
    },
    {
      id: 4,
      name: "3 años",
    },
    {
      id: 5,
      name: "4 años",
    },
    {
      id: 6,
      name: "5 años",
    },
    {
      id: 7,
      name: "6 años",
    },
    {
      id: 8,
      name: "7 años",
    },
    {
      id: 9,
      name: "8 años",
    },
    {
      id: 10,
      name: "9 años",
    },
    {
      id: 11,
      name: "10 años",
    },
  ];

  public static readonly TIPO_DOCUMENTO: any[] = [
    {
      id: "dni",
      descripcion: "DNI",
    },
    {
      id: "carnet extranjeria",
      descripcion: "Carnet de Extranjeria",
    },
    {
      id: "ruc",
      descripcion: "Ruc",
    },
  ];
  public static readonly BANK: any[] = [
    {
      id: 1,
      descripcion: "Banco de Crédito del Perú (BCP)",
    },
    {
      id: 2,
      descripcion: "BBVA",
    },
    {
      id: 3,
      descripcion: "Interbank",
    },
    {
      id: 4,
      descripcion: "Scotiabank",
    },
    {
      id: 5,
      descripcion: "Banco de la Nación",
    },
    {
      id: 6,
      descripcion: "Mibanco",
    },
    {
      id: 7,
      descripcion: "Banco Pichincha",
    },
  ];
  public static readonly MONEDA: any[] = [
    {
      id: 1,
      descripcion: "Soles",
    },
    {
      id: 2,
      descripcion: "Dolares",
    },
  ];

  public static readonly SELECIONAR_TIPO_CATEGORIA_SUBCATEGORIA = [
    {
      val: "1",
      descripcion: "Mostrar en Home (Promocional)", // PARA REALIZAR MENU PRINCIPAL DEL ECOMERCE
    },
    {
      val: "2",
      descripcion: "Mostrar en Catálogo (Normal)", // PARA REALIZAR EL SUB MENU DE CADA SECCION DEL SISTEMA DEL ECOMERCE
    },
  ];
  public static readonly TIPO_SERVICIO = [
    { value: "PAYMENT", label: "Pagos" },
    { value: "EMAIL", label: "Correos" },
    { value: "API", label: "API Externa" },
    { value: "SMS", label: "Mensajería SMS" },
    { value: "STORAGE", label: "Almacenamiento" },
    { value: "WEBHOOK", label: "Webhooks" },
    { value: "API Externa", label: "API Externa" },
  ];
  public static readonly TIPOS_PAGO = [
    {
      value: "card",
      label: "Tarjeta de crédito / débito",
    },
    {
      value: "yape",
      label: "Yape",
    },
  ];
}

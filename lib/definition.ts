export interface InventoryList {
    id: number;
    pc_name: string;
    name: string;
    mac_address: string;
    computer_type: string;
    specs: string;
    supplier: string;
    date_purchased: string;
    date_installed: string;
}

export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
  };

export interface MobileInventoryList {
    id: number;
    assigned_to: string;
    department: string;
    brand: string;
    model_specs: string;
    imei: string;
    number: string;
    serial_number: string;
    inclusion: string;
    date_issued: string;
    is_active_id: number;
}

export interface fetchMobileInventoryList {
    id: number;
    assigned_to: string;
    department: string;
    imei: string;
    serial_number: string;
    date_issued: string;
    source_table: string;
}

export interface FetchInventoryList {
    id: number;
    pc_name: string;
    mac_address: string;
    computer_type: string;
    specs: string;
    supplier: string;
    date_purchased: string;
    source_table: string;
}

export type CreateList = {
    id: number;
    pc_name: string;
    mac_address: string;
    computer_type: string;
    specs: string;
    supplier: string;
    date_purchased: string;
}

export interface ServerAccountsInventory {
    id: number;
    name: string;
    department: string;
    username: string;
    password: string;
    is_active_id: number;
    notes: string;
}
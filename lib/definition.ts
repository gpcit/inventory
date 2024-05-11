export interface InventoryList {
    id: number;
    pc_name: string;
    name: string;
    mac_address: string;
    computer_type: string;
    specs: string;
    supplier: string;
    is_active_id: number;
    date_pullout: string;
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
    date_returned: string;
    is_active_id: number;
}

export interface PrinterInventoryList {
    id: number;
    printer_name: string;
    assigned_to: string;
    department: string;
    manufacturer: string;
    model: string;
    ink_type: string;
    serial_number: string;
    description: string;
    comment: string;
    date_purchased: string;
    date_installed: string;
    date_pullout: string;
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
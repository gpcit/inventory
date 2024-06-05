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

export interface User {
   
    id: number | null;
    name: string | null;
    username: string | null;
    email: string | null;
    role_id: number | null
    
  }

  export interface AuthUser {
   
    uid?: string | null | undefined;
    username?: string | null | undefined;
    role_id: number | null | undefined
        
  }


export interface MobileInventoryList {
    id: number;
    assigned_to: string;
    department: string;
    brand: string;
    model_specs: string;
    imei: string;
    email_password: string;
    number: string;
    serial_number: string;
    inclusion: string;
    date_issued: string;
    date_returned: string;
    is_active_id: number;
    email?: string
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

export interface ActivityLogInventory {
    id: number;
    user_id: number;
    user_name: string;
    actions: string;
    details: string;
    company_name: string;
    date_created: string;
}

export interface SupplyInventory {
    id: number;
    item_no: string;
    name: string;
    manufacturer: string;
    description: string;
    cost_per_item: number;
    stock_quantity: number;
    inventory_value: number;
    reorder_level: number;
    days_per_reorder: number;
    item_reorder_quantity: number;
    item_discontinued: string;
}

export interface DeliverInentory {
    id: number;
    quantity: number;
    description: string;
    location: string;
    name: string;
    date_acquired: string
}
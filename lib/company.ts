
export const tableName = [
        {name: 'gpc_inventory', accounts: 'gpc_accounts', company: 'Greenstone Packaging Corporation.', table: 'gpc_mobile_inventory', displayName: "GPC"},
        {name: 'gkc_inventory', accounts: 'gkc_accounts',company: 'Greenkraft Corporation.', table: 'gkc_mobile_inventory', displayName: "GKC"},
        {name: 'lsi_inventory', accounts: 'lsi_accounts',company: 'Lamitek Systems Incorporated.', table: 'lsi_mobile_inventory', displayName: "LSI"},
        {name: 'gsrc_inventory', accounts: 'gsrc_accounts',company: 'Green Siam Resources Corporation.', table: 'gsrc_mobile_inventory', displayName: "GSRC"},
        {name: 'gcc_inventory', accounts: 'gcc_accounts',company: 'Greencycle Corporation.', table: 'gcc_mobile_inventory', displayName: "GCC"},
        {name: 'steniel_inventory', accounts: 'steniel_accounts',company: 'Steniel.', table: 'steniel_mobile_inventory', displayName: "STENIEL"},   
    ]

export const tableInventoryMap: { [key: string]: string } = {
    gpc_inventory: 'GPC-CCP',
    gpc_sq_inventory: 'GPC-SQ',
    gkc_inventory: 'GKC',
    lsi_inventory: 'LSI-V',
    lsi_can_inventory: 'LSI-C',
    gsrc_inventory: 'GSRC',
    gcc_inventory: 'GCC',
    steniel_inventory: 'STENIEL',
    baling_inventory: 'BALING'
}

export const tableMobileMap: { [key: string]: string } = {
    gpc_mobile_inventory: 'GPC',
    gkc_mobile_inventory: 'GKC',
    lsi_mobile_inventory: 'LSI-V',
    gsrc_mobile_inventory: 'GSRC',
    gcc_mobile_inventory: 'GCC',
    steniel_mobile_inventory: 'STENIEL',
}

export const allTables = [
    {name: 'gpc_inventory'},
    {name: 'gpc_sq_inventory'},
    {name: 'lsi_inventory'},
    {name: 'lsi_can_inventory'},
    {name: 'gkc_inventory'},
    {name: 'gsrc_inventory'},
]


export const branchName = [
    {company: 'gpc_inventory', branch: [
        {name: 'Balintawak'}, {name: 'SQ'} 
    ]},
    {company: 'lsi_inventory', branch: [
        {name: 'Valenzuela'}, {name: 'Canlubang'}
    ]}
]
export const branchTableMap: { [key: string]: string } = {
    Balintawak: 'gpc_inventory',
    SQ: 'gpc_sq_inventory' || 'gpc_sq_accounts',
    Valenzuela: 'lsi_inventory',
    Canlubang: 'lsi_can_inventory' || 'lsi_can_accounts'
};

export const accountTableMap: { [key: string]: string } = {
    Balintawak: 'gpc_accounts',
    SQ: 'gpc_sq_accounts',
    Valenzuela: 'lsi_accounts',
    Canlubang: 'lsi_can_accounts'
};

export const printerTableMap: { [key: string]: string } = {
    Balintawak: 'gpc_printer',
    SQ: 'gpc_sq_printer',
    Valenzuela: 'lsi_printer',
    Canlubang: 'lsi_can_printer'
};

export const status = [
    {name: "Active", value: 1},
    {name: "Inactive", value: 2}
]

export const accountTables: { [key: string]: string } = {
    'gpc_accounts': 'GPC-CCP',
    'gpc_inventory': 'GPC-CCP',
    'gpc_sq_inventory': 'GPC-SQ',
    'gpc_mobile_inventory': 'GPC',
    'gpc_printer': 'GPC-CCP',
    'gpc_sq_printer': 'GPC-SQ',
    'gpc_sq_accounts': 'GPC-SQ',
    'lsi_accounts': 'LSI-V',
    'lsi_inventory': 'LSI-V',
    'lsi_mobile_inventory': 'LSI',
    'lsi_can_inventory': 'LSI-C',
    'lsi_printer': 'LSI-V',
    'lsi_can_accounts': 'LSI-C',
    'lsi_can_printers': 'LSI-C',
    'gkc_accounts': 'GKC',
    'gkc_inventory': 'GKC',
    'gkc_printer': 'GKC',
    'gkc_mobile_inventory': 'GKC',
    'gsrc_accounts': 'GSRC',
    'gsrc_printer': 'GSRC',
    'gsrc_mobile_inventory': 'GSRC',
    'gsrc_inventory': 'GSRC',
    'gcc_accounts': 'GCC',
    'gcc_printer': 'GCC',
    'gcc_mobile_inventory': 'GCC',
    'gcc_inventory': 'GCC',
    'steniel_accounts': 'STENIEL',
    'steniel_printer': 'STENIEL',
    'steniel_mobile_inventory': 'STENIEL',
    'steniel_inventory': 'STENIEL',
    'baling_inventory': 'BALING',
  };

export const roles: { [key: number] : string} = {
    1: 'Admin',
    2: 'Regular',
    3: 'Guest'
}
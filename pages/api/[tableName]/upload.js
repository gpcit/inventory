import multer from 'multer';
import { query } from '@/lib/db';
import xlsx from 'xlsx'
import { tableName } from '../../../lib/company'
const upload = multer();

export const config = {
  api: {
    bodyParser: false,
  },
};

async function parseExcel(filebuffer, sheetName) {
  const workbook = xlsx.read(filebuffer, {type : 'buffer'});
  // const sheetName = workbook.SheetNames[sheetIndex];
  const sheet = workbook.Sheets[sheetName];
  
  if(!sheet) {
    throw new Error(`Sheet '${sheetName}' not found in the Excel file. `)
  }
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  const headers = data[0];

  const rows = data.slice(1).map(row => {
    
    return headers.map((header, index) => {
      // Check if the value is a numeric date (45302 is a common representation for Excel date values)
      if (typeof row[index] === 'number' && row[index] > 1 && row[index] < 50000) {
        // Convert the Excel numeric date value to JavaScript Date object
        const excelDate = new Date((row[index] - 1) * 86400 * 1000);

        excelDate.setFullYear(excelDate.getFullYear() - 70)
        // Format the date as desired, e.g., 'MM-dd-yyyy'
        const formattedDate = excelDate.toISOString().split('T')[0]
        
        return formattedDate;
      }
      // Return other values as is
      return row[index];
    });
  });

  return { headers, rows };
}
export default async function handler(req, res) {
  const tablename = req.query.tableName;
  const sheetNameTable = tablename;
  let getSheet;
  if(sheetNameTable === 'gkc_mobile_inventory' || sheetNameTable === 'gkc_inventory' || sheetNameTable === 'gkc_accounts') {
    getSheet = 'Greenkraft'
  } else if (sheetNameTable === 'gpc_mobile_inventory' || sheetNameTable === 'gpc_inventory' || sheetNameTable === 'gpc_sq_inventory' || sheetNameTable === 'gpc_accounts' | sheetNameTable === 'gpc_sq_accounts') {
    getSheet = 'Greenstone'
  } else if (sheetNameTable === 'lsi_mobile_inventory' || sheetNameTable === 'lsi_inventory' || sheetNameTable === 'lsi_can_inventory' || sheetNameTable === 'lsi_accounts' || sheetNameTable === 'lsi_can_accounts') {
    getSheet = 'Lamitek'
  } else if (sheetNameTable === 'gsrc_mobile_inventory' || sheetNameTable === 'gsrc_inventory' || sheetNameTable === 'gsrc_accounts') {
    getSheet = 'GreenSiam'
  } else {
    getSheet = '';
  }
  if (req.method === 'POST') {
    try {
      upload.single('file')(req, res, async (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error uploading file');
        }
        const fileBuffer = req.file.buffer;
        try {
          const {headers, rows} = await parseExcel(fileBuffer, getSheet)
          let insertQuery;
          let values;
        if(sheetNameTable === 'gkc_accounts' || sheetNameTable === 'gpc_accounts' || sheetNameTable === 'gpc_sq_accounts' || sheetNameTable === 'lsi_accounts' || sheetNameTable === 'lsi_can_accounts' || sheetNameTable === 'gsrc_accounts') {
          
          const is_active_id = 1
          headers.push('is_active_id')
          const valuePlaceholders = rows.map(() => '(?)').join(',')

          console.log("result for header:", headers)
          console.log("result for rows: ", rows)
          insertQuery = `INSERT INTO ${tablename} (${headers.join(', ')}) VALUES ${valuePlaceholders}`;
          values = rows.map((row) => [...row, is_active_id])
          console.log("result for insert query: ", insertQuery)
        } else {
          console.log(headers)
          insertQuery = `INSERT INTO ${tablename} (${headers.join(', ')}) VALUES ?`;
          values = [rows];
        }
        const result = await query(insertQuery, values);
        return res.status(200).send('File uploaded successfully');
      } catch (error) {
      console.error('Error uploading file:', error);
      return res.status(500).send('Error uploading file');
        }
      })
  } catch (error){
    console.error('Error uploadig file:', error)
  }
 } else {
    res.status(405).send('Method Not Allowed');
  }
}

import { query } from '@/lib/db';
import xlsx from 'xlsx';

export default async function handler(req, res) {
  const tablename = req.query.tableName;
  const id = req.query.id;
  if (req.method === 'POST') {
    const { sheetName } = req.body
    try {
      // Fetch data from the database table
      const queryResult = await query(`SELECT assigned_to, department, brand, model_specs, serial_number, imei, number, email_password, inclusion, date_issued FROM ${tablename} where id = ${id}`);

      console.log('queryResult: ', queryResult)
      if(queryResult.length === 0) {
        return res.status(404).send(`No records found in ${tablename}`)
      }      
      // Extract column headers from the query result
      const headers = ['assigned_to', 'department', 'brand', 'model_specs', 'serial_number', 'imei', 'number', 'email_password', 'inclusion', 'date_issued'];

      // Extract rows from the query result
      const rows = queryResult.map(row => headers.map(header => row[header]));
      console.log("Result for rows: ", rows)
      console.log("Result for headers: ", headers)
      // Create a new workbook and add a worksheet
      const workbook = xlsx.utils.book_new();
      const worksheet = xlsx.utils.aoa_to_sheet([headers, ...rows]);
      console.log("Result for worksheet: ", worksheet)
      // Add the worksheet to the workbook
      xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);

      // Generate a buffer containing the Excel file
      const excelBuffer = xlsx.write(workbook, { type: 'buffer' });

      // Set headers to trigger file download
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=${tablename}.xlsx`);

      // Send the Excel file buffer as the response
      return res.status(200).send(excelBuffer);
    } catch (error) {
      console.error('Error exporting file:', error);
      return res.status(500).send('Error exporting file');
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
}

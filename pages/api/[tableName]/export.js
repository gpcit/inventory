import { query } from '@/lib/db';
import xlsx from 'xlsx';

export default async function handler(req, res) {
  const tablename = req.query.tableName;

  if (req.method === 'GET') {
    try {
      // Fetch data from the database table
      const queryResult = await query(`SELECT * FROM ${tablename}`);

      if(queryResult.lenght === 0) {
        return res.status(404).send(`No records found in ${tablename}`)
      }
      const transformedData = queryResult.map((row) => {
        // Determine the status based on the is_active_id value
        const status = row.is_active_id === 1 ? 'active' : 'inactive';
        const {date_created, ...filteredRow} = row
        // Create a new object with the transformed data
        return {
          ...filteredRow,
          status: status // Add a new property 'status' with the transformed value
        };
      });
      
      // Extract column headers from the query result
      const headers = Object.keys(transformedData[0]).filter((header) => header !== 'date_created');

      // Extract rows from the query result
      const rows = transformedData.map((row) => Object.values(row));
      
      // Create a new workbook and add a worksheet
      const workbook = xlsx.utils.book_new();
      const worksheet = xlsx.utils.aoa_to_sheet([headers, ...rows]);
      console.log("Result for worksheet: ", worksheet)
      // Add the worksheet to the workbook
      xlsx.utils.book_append_sheet(workbook, worksheet, tablename);

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

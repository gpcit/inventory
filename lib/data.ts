import mysql, { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import  {InventoryList}  from './definition';
import React from 'react';
import {z} from 'zod';

// Define a custom type for the query result

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});


export async function fetchInventoryList(tableName: string): Promise<InventoryList[]> {
    let connection;
    try{
        connection = await pool.getConnection();
        console.log(`successful ${connection}`)
        const  query =  `SELECT * FROM ${tableName}`;
        const [rows] = await connection.query(query);
        return rows as InventoryList[];
        
    } catch (error){
        console.log("Error fetching data", error)
        return []
    } finally {
        if (connection) {
            connection.release();
        }
    }
}


export async function fetchGPCInventoryList() {
    let connection;
    try{
        connection = await pool.getConnection();
        console.log(`successful ${connection}`)
        const  query =  `SELECT * FROM gpc_inventory`;
        const [rows] = await connection.query(query, []);
        return rows as InventoryList[];
    } catch (error){
        console.log("Error fetching data", error)
        return []
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

export async function fetchLSIInventoryList(){
    
    let connection;
    try{
        connection = await pool.getConnection(); 
        const query =  `SELECT * FROM lsi_inventory`;
        const [rows] = await connection.query(query);
        return rows as InventoryList[];
        
    } catch (error){
        console.log("Error fetching data", error)
        return []
    } finally {
        if (connection) {
            connection.release();
        }
    }
}




// Import the database connection pool

import pool from "../config/db.js";


export const insertAppQualification = async ({
  AppId,
  QualId,
  ColName,
  YearPass,
  Percentage,
  Degree,
  LastDegree,
  Location
}) => {
  try {
    // Perform the database query to insert data into the AppQualification table
    const result = await pool.request()
      .input('AppId', AppId)
      .input('QualId', QualId)
      .input('ColName', ColName)
      .input('YearPass', YearPass)
      .input('Percentage', Percentage)
      .input('Degree', Degree)
      .input('LastDegree', LastDegree)
      .input('Location', Location)
      .query(`
        INSERT INTO AppQualification (AppId, QualId, ColName, YearPass, Percentage, Degree, LastDegree, Location)
        VALUES (@AppId, @QualId, @ColName, @YearPass, @Percentage, @Degree, @LastDegree, @Location)
      `);

    return result;
  } catch (error) {
    console.error('Error inserting data into AppQualification:', error);
    throw error;
  }
};

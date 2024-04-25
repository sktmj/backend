// Import Sequelize library and database connection

import pool from '../config/db.js';
import { DataTypes,Model } from 'sequelize';
// Define the Caste model
class Caste extends Model {}

// Initialize the Caste model
Caste.init(
  {
    caste_gid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    religion_gid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    caste_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isvalid: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Description: {
      type: DataTypes.STRING
    }
  },
  {
    pool,
    modelName: 'Caste',
    tableName: 'Caste_master', // Assuming your table name is 'Caste_master'
    timestamps: false // Set this to true if your table has createdAt and updatedAt columns
  }
);

// Export the Caste model
export default Caste;

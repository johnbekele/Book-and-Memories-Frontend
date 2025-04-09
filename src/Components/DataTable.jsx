import React, { useState, useContext } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { ThemeContext } from '../Context/ThemeContext'; // Adjust the import path as needed

function DataTable({ rows, columns, density, hideFooterSelectedRowCount }) {
  // Get theme from context
  const { darkMode } = useContext(ThemeContext);

  // State for pagination
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  // Theme-based styles
  const getThemeStyles = () => {
    return {
      height: 400,
      width: '100%',
      backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
      color: darkMode ? '#ffffff' : '#1e1e1e',
      boxShadow: darkMode
        ? '0 4px 6px rgba(0, 0, 0, 0.3)'
        : '0 1px 3px rgba(0, 0, 0, 0.12)',
    };
  };

  // DataGrid theme styles
  const getDataGridStyles = () => {
    return {
      border: 0,
      color: darkMode ? '#e0e0e0' : 'inherit',
      '& .MuiDataGrid-cell': {
        borderBottom: darkMode ? '1px solid #333' : '1px solid #f0f0f0',
      },
      '& .MuiDataGrid-columnHeaders': {
        backgroundColor: darkMode ? '#333' : '#f5f5f5',
        color: darkMode ? '#fff' : 'inherit',
      },
      '& .MuiDataGrid-footerContainer': {
        backgroundColor: darkMode ? '#333' : '#f5f5f5',
        borderTop: darkMode ? '1px solid #444' : '1px solid #ddd',
      },
      '& .MuiTablePagination-root': {
        color: darkMode ? '#e0e0e0' : 'inherit',
      },
      '& .MuiCheckbox-root': {
        color: darkMode ? '#90caf9' : 'inherit',
      },
      '& .MuiDataGrid-row:hover': {
        backgroundColor: darkMode
          ? 'rgba(255, 255, 255, 0.08)'
          : 'rgba(0, 0, 0, 0.04)',
      },
    };
  };

  return (
    <Paper sx={getThemeStyles()}>
      <DataGrid
        rows={rows}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        disableRowSelectionOnClick
        sx={getDataGridStyles()}
      />
    </Paper>
  );
}

export default DataTable;

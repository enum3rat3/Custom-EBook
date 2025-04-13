import * as React from 'react';
import { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';

const columns = [
  { field: 'chId', headerName: 'Chapter ID', width: 120 },
  { field: 'bkId', headerName: 'Book ID', width: 100 },
  { field: 'startPage', headerName: 'Start Page', width: 120 },
  { field: 'endPage', headerName: 'End Page', width: 120 },
  { field: 'chPrice', headerName: 'Price (₹)', width: 120 },
  {
    field: 'chS3Path',
    headerName: 'S3 Preview',
    width: 200,
    renderCell: (params) => (
      <a
        href={`https://${params.value}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        View PDF
      </a>
    ),
  },
];

export default function CartGrid({ data }) {
  const [rows, setRows] = useState(
    data.map((item, index) => ({ ...item, id: index })) // Add `id` for DataGrid
  );

  // Function to move a row up
  const moveRowUp = (index) => {
    if (index === 0) return; // No row to move up if it's already the first row
    const updatedRows = [...rows];
    const [movedItem] = updatedRows.splice(index, 1);
    updatedRows.splice(index - 1, 0, movedItem); // Insert before the previous item
    setRows(updatedRows);
    applyRowAnimation(index - 1, index); // Apply animation
  };

  // Function to move a row down
  const moveRowDown = (index) => {
    if (index === rows.length - 1) return; // No row to move down if it's already the last row
    const updatedRows = [...rows];
    const [movedItem] = updatedRows.splice(index, 1);
    updatedRows.splice(index + 1, 0, movedItem); // Insert after the next item
    setRows(updatedRows);
    applyRowAnimation(index + 1, index); // Apply animation
  };

  // Function to trigger row animation
  const applyRowAnimation = (startIndex, endIndex) => {
    // Find the rows for animation
    const startRow = document.getElementById(`row-${startIndex}`);
    const endRow = document.getElementById(`row-${endIndex}`);

    if (startRow && endRow) {
      // Add CSS classes to trigger animation
      startRow.classList.add('transition-all', 'duration-300', 'transform', 'translate-y-4', 'opacity-0');
      endRow.classList.add('transition-all', 'duration-300', 'transform', 'translate-y-4', 'opacity-0');

      // Remove the classes after animation ends
      setTimeout(() => {
        startRow.classList.remove('translate-y-4', 'opacity-0');
        endRow.classList.remove('translate-y-4', 'opacity-0');
      }, 300); // Duration of the animation (300ms)
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="border rounded-md shadow-lg overflow-hidden">
        <DataGrid
          columns={[
            ...columns,
            {
              field: 'move',
              headerName: 'Move',
              width: 150,
              renderCell: (params) => {
                const rowIndex = rows.findIndex((row) => row.id === params.row.id);

                return (
                  <div className="flex justify-around items-center space-x-2">
                    <button
                      onClick={() => moveRowUp(rowIndex)}
                      disabled={rowIndex === 0} // Disable the "Up" button if it's already the first row
                      className="text-blue-600 hover:text-blue-800 disabled:text-gray-400 transition duration-200"
                    >
                      <ArrowCircleUpIcon fontSize="small" />
                    </button>
                    <button
                      onClick={() => moveRowDown(rowIndex)}
                      disabled={rowIndex === rows.length - 1} // Disable the "Down" button if it's already the last row
                      className="text-blue-600 hover:text-blue-800 disabled:text-gray-400 transition duration-200"
                    >
                      <ArrowCircleDownIcon fontSize="small" />
                    </button>
                  </div>
                );
              },
            },
          ]}
          rows={rows}
          hideFooter
          autoHeight
          disableColumnMenu
          disableSelectionOnClick
          sx={{
            // Custom styling
            border: '1px solid #ddd',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            '& .MuiDataGrid-cell': {
              padding: '8px',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f4f4f4',
              color: '#333',
              fontWeight: '600',
            },
            '& .MuiDataGrid-footerContainer': {
              display: 'none', // Hide the footer for a cleaner look
            },
          }}
          getRowClassName={(params) => `row-${params.row.id}`} // Add unique class to each row for animation
        />
      </div>
    </div>
  );
}

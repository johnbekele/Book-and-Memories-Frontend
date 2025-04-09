import React, { useState, useEffect } from 'react';
import { useFlagged } from '../../Hook/useFlagged';
import DataTable from '../../Components/DataTable';
import { useMediaQuery } from '@mui/material'; // Add this import for responsive design

function FlaggedUserPage() {
  const { flagged, isLoading, isError, error } = useFlagged();
  const isMobile = useMediaQuery('(max-width:768px)'); // Detect mobile screens

  console.log('Flagged users:', flagged);

  // Define columns for flagged comments
  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'username', headerName: 'Username', width: 150 },
    {
      field: 'fullName',
      headerName: 'Full Name',
      width: 180,
      renderCell: (params) => (
        <span>
          {params.row.firstName} {params.row.lastName}
        </span>
      ),
    },
    { field: 'comment', headerName: 'Comment', width: 250 },
    { field: 'reason', headerName: 'Reason', width: 300 },
    {
      field: 'date',
      headerName: 'Date Flagged',
      width: 180,
      renderCell: (params) => (
        <span>{new Date(params.row.date).toLocaleString()}</span>
      ),
    },
  ];

  // Transform flagged data to rows format
  const rows = flagged
    ? flagged.map((item) => ({
        id: item._id,
        username: item.userData?.username || 'Unknown',
        firstName: item.userData?.firstname || '',
        lastName: item.userData?.lastname || '',
        comment: item.comment,
        reason: item.reason,
        date: item.created_at,
        postId: item.postid,
        userId: item.userId,
        email: item.userData?.email || '',
      }))
    : [];

  return (
    <div className="flex flex-col p-2 sm:p-4 md:p-6 w-full mt-16 md:mt-20">
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Flagged Users
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Review and manage users that have been flagged in the system
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40 md:h-64">
          <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 md:px-4 md:py-3 rounded relative text-sm md:text-base">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline">
            {error?.message || 'Failed to load flagged users'}
          </span>
        </div>
      ) : flagged && flagged.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className={`h-[350px] md:h-[500px] w-full`}>
            <DataTable
              rows={rows}
              columns={columns}
              density={isMobile ? 'compact' : 'standard'}
              // Additional responsive props
              hideFooterSelectedRowCount={isMobile}
            />
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 text-gray-700 px-3 py-6 md:px-4 md:py-10 rounded text-center">
          <svg
            className="mx-auto h-8 w-8 md:h-12 md:w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-xs md:text-sm font-medium text-gray-900">
            No flagged users
          </h3>
          <p className="mt-1 text-xs md:text-sm text-gray-500">
            There are currently no flagged users in the system.
          </p>
        </div>
      )}
    </div>
  );
}

export default FlaggedUserPage;

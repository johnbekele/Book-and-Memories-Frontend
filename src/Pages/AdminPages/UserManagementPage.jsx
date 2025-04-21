import React, { useState, useEffect, use, useId } from 'react';
import { useFlagged } from '../../Hook/useFlagged.js';
import DataTable from '../../Components/DataTable.jsx';
import { useMediaQuery } from '@mui/material';
import Avatar from '../../Components/Avatar.jsx';
import SplitButton from '../../Components/SplitButton.jsx';
import { useLogger } from '../../Hook/useLogger.js';
import { useUser } from '../../Hook/useUser.js';

function UserManagementPage() {
  const logger = useLogger();
  const {
    user,
    escalate,
    deleteUser,
    freezUser,
    restoreUser,
    isLoading,
    isError,
    error,
  } = useUser();

  const isMobile = useMediaQuery('(max-width:768px)'); // Detect mobile screens
  const options = [
    { value: 'escalateAdmin', label: 'Escalate to Admin' },
    { value: 'escalateModerator', label: 'Escalate to Moderator' },
    { value: 'freezeAccount', label: 'Freeze User Account' },
    { value: 'restoreAccess', label: 'Restore User Access' },
    { value: 'deleteAccount', label: 'Delete Account' },
  ];
  const [status, setStatus] = useState({}); // State to manage status

  const handleDecision = (selectedOption, row) => {
    let torole = '';

    switch (selectedOption) {
      case 'escalateAdmin':
        torole = 'admin';
        handleEscalateToAdmin(row._id, torole);
        break;
      case 'escalateModerator':
        torole = 'moderator';
        handleEscalateToModeratore(row._id, torole);
        break;
      case 'freezeAccount':
        handleFreezAccount(row._id);
        break;
      case 'deleteAccount':
        handleDeleteAccount(row._id);
        break;
      case 'restoreAccess':
        handleRestorAccount(row._id);
        break;
      default:
        logger.log('Invalid option selected');
        break;
    }
  };

  const handleEscalateToAdmin = async (userId, torole) => {
    try {
      console.log('Trying escalate with', userId, torole);
      escalate(
        { userId, torole },
        {
          onError: (err) => {
            console.error('Mutation error:', err);
          },
          onSuccess: (res) => {
            console.log('Mutation success:', res);
          },
        }
      );
    } catch (err) {
      console.error('Escalation threw:', err);
    }
  };

  const handleEscalateToModeratore = async (userId, torole) => {
    console.log('toamoderator', userId, torole);
    escalate({ userId, torole });
  };
  const handleFreezAccount = async (userId) => {
    freezUser(userId);
  };

  const handleDeleteAccount = async (userId) => {
    try {
      console.log('delting user ', userId);
      deleteUser(userId, {
        onError: (err) => {
          console.error('Mutation error:', err);
        },
        onSuccess: (res) => {
          console.log('Mutation success:', res);
        },
      });
    } catch (err) {
      console.error('Escalation threw:', err);
    }
  };

  const handleRestorAccount = async (userId) => {
    try {
      await restoreUser(userId);
      console.log('user account restore successfully ');
    } catch (err) {
      console.log(err);
    }
  };

  const handlerowSelectionChange = (selectedRows) => {
    logger.log('Selected rows:', selectedRows);
  };

  // Define columns for flagged comments
  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    {
      field: 'user',
      headerName: 'User',
      width: 100,
      renderCell: (params) => params.value,
    },
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
    { field: 'email', headerName: 'Email', width: 200 },
    {
      field: 'role',
      headerName: 'Role',
      width: 250,
      renderCell: (params) => (
        <div className="flex flex-wrap gap-2">
          {params?.row.role &&
            Object.entries(params.row.role).map(([role, level]) => (
              <span
                key={role}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  role === 'Admin'
                    ? 'bg-red-100 text-red-800'
                    : role === 'Moderator'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {role}
              </span>
            ))}
        </div>
      ),
    },
    {
      field: 'flaggedComments',
      headerName: 'Flagged Comments',
      width: 100,
      renderCell: (params) => {
        const amount = params.row.flaggedComments.amount;
        if (amount >= 6) {
          return (
            <div className="flex flex-1 bg-red-200 text-red-600 font-bold">
              {amount} 🚩
            </div>
          );
        } else if (amount >= 3) {
          return (
            <div className="flex flex-1 bg-yellow-200 text-yellow-600">
              {amount} ⚠️
            </div>
          );
        } else {
          return (
            <div className="flex flex-1 bg-green-200 text-green-500">
              {amount}
            </div>
          );
        }
      },
    },
    {
      field: 'date',
      headerName: 'Created At',
      width: 180,
      renderCell: (params) => (
        <span>{new Date(params.row.date).toLocaleString()}</span>
      ),
    },
    {
      field: 'decision',
      headerName: 'Decision',
      width: 300,
      renderCell: (params) => params.value,
    },
    {
      field: 'statusValue',
      headerName: 'Status',
      width: 200,
      renderCell: (params) => {
        const status = String(params.row.statusValue || '').toLowerCase();

        if (status.includes('false') && status.includes('positive')) {
          return <span className="text-green-500">False Positive</span>;
        } else if (status.includes('escalate')) {
          return <span className="text-red-500">Escalalate</span>;
        } else if (status.includes('pending')) {
          return <span className="text-yellow-500">Pending</span>;
        } else {
          return <span className="text-gray-500">Pending ({status})</span>;
        }
      },
    },
  ];

  // Transform flagged data to rows format
  const rows = user
    ? user.map((item) => ({
        id: item._id,
        user: (
          <Avatar
            src={item.photo}
            alt={item.firstname || 'User'}
            className="h-8 w-8 rounded-full"
          />
        ),
        firstName: item.firstname || '',
        lastName: item.lastname || '',
        comment: item.comment,
        role: item.role,
        date: item.createdAt,
        flaggedComments: item.flaggedComments,
        userId: item.userId,
        email: item.email || '',
        decision: (
          <SplitButton
            options={options}
            handleDecision={(selectedOption) =>
              handleDecision(selectedOption, item)
            }
          />
        ),
        statusValue: item.status,
      }))
    : [];

  return (
    <div className="flex flex-col p-2 sm:p-4 md:p-6 w-full mt-10 md:mt-1">
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          User Management
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Review and manage users
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
      ) : user && user.length > 0 ? (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="w-full overflow-auto">
            <DataTable
              rows={rows}
              columns={columns}
              density={isMobile ? 'compact' : 'standard'}
              selectedRowsToParent={handlerowSelectionChange}
              hideFooterSelectedRowCount={isMobile}
              options={options}
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
            No user users
          </h3>
          <p className="mt-1 text-xs md:text-sm text-gray-500">
            There are currently no user users in the system.
          </p>
        </div>
      )}
    </div>
  );
}

export default UserManagementPage;

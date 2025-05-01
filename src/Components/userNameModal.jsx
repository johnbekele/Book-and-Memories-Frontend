import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useTheme } from '../Context/ThemeContext';
import { useActionData } from 'react-router-dom';

export default function UserNameModal({ userdata }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Use the theme context
  const { theme, colors } = useTheme();
  const isDark = theme === 'dark';

  // Modal style with responsive width
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {
      xs: '90%',
      sm: '80%',
      md: '60%',
      lg: '50%',
    },
    maxWidth: '600px',
    bgcolor: isDark ? colors.backgroundColor : 'background.paper',
    border: `2px solid ${isDark ? colors.borderColor : '#000'}`,
    boxShadow: 24,
    p: 4,
    borderRadius: '8px',
  };

  return (
    <div
      className=""
      style={{
        borderColor: isDark ? colors.borderColor : '#e2e8f0',
      }}
    >
      <span
        style={{
          color: colors.textcolor,
        }}
        className="text-xl"
        onClick={handleOpen}
      >
        {userdata.firstname + ' ' + userdata.lastname}
      </span>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <div className="flex flex-col ">
            <Typography
              variant="h6"
              component="h2"
              sx={{ color: colors.textcolor, mb: 2, textAlign: 'center' }}
            >
              About this account
            </Typography>
            <Typography
              variant="small"
              sx={{
                color: colors.textcolor,
                textAlign: 'center',
                fontSize: 'small',
              }}
            >
              {userdata.firstname}
            </Typography>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

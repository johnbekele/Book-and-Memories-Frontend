import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useTheme } from '../Context/ThemeContext';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function DeleteModal({ isHovering, commentID, deletePost }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Use the theme context
  const { theme, colors } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      style={{
        borderColor: isDark ? colors.borderColor : '#e2e8f0',
      }}
    >
      <span
        style={{
          color: isDark ? '#a0aec0' : '#718096',
          display: isHovering === commentID ? 'block' : 'none',
        }}
        className="text-xs cursor-default hover:underline hover:text-amber-50
                          active:text-white transition-colors
                          active:drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]"
        onClick={handleOpen}
      >
        delete
      </span>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            ...style,
            borderColor: isDark ? colors.borderColor : '#e2e8f0',
            color: isDark ? '#fff' : '#000',
          }}
        >
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            style={{ color: isDark ? '#ccc' : '#333' }}
          >
            Confirm Deletion
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{ mt: 2 }}
            style={{ color: isDark ? '#ccc' : '#333' }}
          >
            Are you sure you want to delete this item? This action cannot be
            undone.
            <div className="flex justify-end gap-4 mt-4">
              <span
                className="cursor-pointer text-red-600"
                onClick={deletePost}
              >
                Confirm
              </span>
              <span
                className="cursor-pointer text-gray-600"
                onClick={handleClose}
              >
                Cancel
              </span>
            </div>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}

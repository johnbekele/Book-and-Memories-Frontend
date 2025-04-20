import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '../Context/ThemeContext';

const reportReasons = [
  "I just don't like it",
  'Bullying or unwanted contact',
  'Suicide, self-injury or eating disorders',
  'Nudity or sexual activity',
  'Hate speech or symbols',
  'Violence or exploitation',
  'Selling or promoting restricted items',
  'Scam, fraud or spam',
  'False information',
  'Report as unlawful',
];

export default function ReportModal({ isHovering, commentID, reportComment }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { theme } = useTheme();
  const isDark = true; // force dark theme for this modal style

  return (
    <div>
      <span
        className="text-xs cursor-pointer hover:underline hover:text-red-500 "
        style={{
          display: isHovering === commentID ? 'block' : 'none',
          color: isDark ? '#a0aec0' : '#718096',
        }}
        onClick={handleOpen}
      >
        report
      </span>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: '#1c1c1e',
            color: 'white',
            borderRadius: 2,
            p: 2,
            boxShadow: 24,
          }}
        >
          <Box className="flex justify-between items-center mb-4">
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Report
            </Typography>
            <IconButton onClick={handleClose} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Typography variant="subtitle1" className="mb-4 text-gray-400">
            Why are you reporting this comment?
          </Typography>

          <Box className="space-y-2">
            {reportReasons.map((reason, index) => (
              <div
                key={index}
                className="bg-[#2c2c2e] hover:bg-[#3a3a3c] rounded px-3 py-2 cursor-pointer text-sm transition-colors"
                onClick={() => {
                  reportComment(commentID, reason);
                  handleClose();
                }}
              >
                {reason}
              </div>
            ))}
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

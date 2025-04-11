import * as React from 'react';
import {
  Button,
  ButtonGroup,
  MenuItem,
  Menu,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const options = ['Approve', 'Remove', 'Warn'];

export default function SplitButton() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const open = Boolean(anchorEl);
  const selectedOption = options[selectedIndex];

  const handleClick = () => {
    console.log(selectedOption);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (index) => {
    setSelectedIndex(index);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <ButtonGroup
        variant="contained"
        size={isMobile ? 'small' : 'medium'}
        sx={{ width: isMobile ? '100%' : 'auto' }}
      >
        <Button onClick={handleClick} sx={{ flexGrow: 1 }}>
          {selectedOption}
        </Button>
        <Button
          size="small"
          aria-label="select option"
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleMenuOpen}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {options.map((option, index) => (
          <MenuItem
            key={option}
            disabled={index === 2}
            selected={index === selectedIndex}
            onClick={() => handleMenuItemClick(index)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

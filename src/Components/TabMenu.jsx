// TabMenu.jsx
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useTheme } from '../Context/ThemeContext';
import { styled } from '@mui/material/styles';

// Styled components for better customization
const StyledTabs = styled(Tabs)(({ $theme, $colors }) => ({
  '& .MuiTabs-indicator': {
    backgroundColor: $colors.buttonText,
    height: 3,
    transition: 'all 0.3s ease-in-out',
  },
  '& .MuiTab-root': {
    color: $colors.textColor,
    position: 'relative',
    transition: 'all 0.3s ease-in-out',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '2px',
      backgroundColor: $colors.buttonText,
      transform: 'scaleX(0)',
      transformOrigin: 'center',
      transition: 'transform 0.3s ease-in-out',
    },
    '&.Mui-selected': {
      color: $colors.buttonText,
      transform: 'translateY(-2px)',
      '&::after': {
        transform: 'scaleX(1)',
      },
    },
    '&:hover': {
      backgroundColor:
        $theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
      transform: 'translateY(-2px)',
      '&::after': {
        transform: 'scaleX(0.5)',
      },
    },
  },
}));

const StyledTabPanel = styled(Box)(({ $colors }) => ({
  padding: '24px',
  backgroundColor: $colors.backgroundColor,
  color: $colors.textColor,
  minHeight: '200px',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  '@media (max-width: 600px)': {
    padding: '16px',
  },
}));

const StyledBox = styled(Box)(({ $theme, $colors }) => ({
  width: '100%',
  border: `1px solid ${$colors.borderColor}`,
  margin: '20px 0',
  borderRadius: '8px',
  overflow: 'hidden',
  transition: 'all 0.3s ease-in-out',
  boxShadow:
    $theme === 'dark'
      ? '0 4px 6px rgba(0, 0, 0, 0.3)'
      : '0 2px 4px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow:
      $theme === 'dark'
        ? '0 8px 12px rgba(0, 0, 0, 0.4)'
        : '0 4px 8px rgba(0, 0, 0, 0.15)',
  },
  '@media (max-width: 600px)': {
    margin: '10px 0',
  },
}));

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  const { colors } = useTheme();

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <StyledTabPanel $colors={colors}>{children}</StyledTabPanel>
      )}
    </div>
  );
}

export default function TabMenu(props) {
  const [value, setValue] = React.useState(0);
  const { theme, colors } = useTheme();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="mt-16">
      <StyledBox $theme={theme} $colors={colors}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <StyledTabs
            value={value}
            onChange={handleChange}
            $theme={theme}
            $colors={colors}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            <Tab label={props.tab1Label || 'Tab 1'} />
            <Tab label={props.tab2Label || 'Tab 2'} />
            <Tab label={props.tab3Label || 'Tab 3'} />
          </StyledTabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          {props.Tab1Component || 'Content 1'}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          {props.Tab2Component || 'Content 2'}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          {props.Tab3Component || 'Content 3'}
        </CustomTabPanel>
      </StyledBox>
    </div>
  );
}

// TabMenu.jsx
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

function CustomTabPanel(props) {
  const { children, value, index } = props;
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function TabMenu(props) {
  console.log('TabMenu rendering with props:', props);
  const [value, setValue] = React.useState(0);

  return (
    <div className="mt-16">
      <Box sx={{ width: '100%', border: '1px solid #ddd', margin: '20px 0' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={(e, newValue) => setValue(newValue)}>
            <Tab label={props.tab1Label || 'Tab 1'} />
            <Tab label={props.tab2Label || 'Tab 2'} />
            <Tab label={props.tab3Label || 'Tab 3'} />
          </Tabs>
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
      </Box>
    </div>
  );
}

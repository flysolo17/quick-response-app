import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DailyReportTable from "../component/DailyReportTable";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
interface DailyRecordPageProps {}

const DailyRecordPage: React.FunctionComponent<DailyRecordPageProps> = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="January" {...a11yProps(0)} />
          <Tab label="February" {...a11yProps(1)} />
          <Tab label="March" {...a11yProps(2)} />
          <Tab label="April" {...a11yProps(3)} />
          <Tab label="May" {...a11yProps(4)} />
          <Tab label="June" {...a11yProps(5)} />
          <Tab label="July" {...a11yProps(6)} />
          <Tab label="August" {...a11yProps(7)} />
          <Tab label="September" {...a11yProps(8)} />
          <Tab label="October" {...a11yProps(9)} />
          <Tab label="November" {...a11yProps(10)} />
          <Tab label="December" {...a11yProps(11)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <DailyReportTable month={1} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <DailyReportTable month={2} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <DailyReportTable month={3} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <DailyReportTable month={4} />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <DailyReportTable month={5} />
      </TabPanel>
      <TabPanel value={value} index={5}>
        <DailyReportTable month={6} />
      </TabPanel>
      <TabPanel value={value} index={6}>
        <DailyReportTable month={7} />
      </TabPanel>
      <TabPanel value={value} index={7}>
        <DailyReportTable month={8} />
      </TabPanel>
      <TabPanel value={value} index={8}>
        <DailyReportTable month={9} />
      </TabPanel>
      <TabPanel value={value} index={9}>
        <DailyReportTable month={10} />
      </TabPanel>
      <TabPanel value={value} index={10}>
        <DailyReportTable month={11} />
      </TabPanel>
      <TabPanel value={value} index={11}>
        <DailyReportTable month={12} />
      </TabPanel>
    </Box>
  );
};

export default DailyRecordPage;

import { createStackNavigator } from "@react-navigation/stack";
import BookEventForm from "../Resident/BookEventForm";
import AddBuilding from './AddBuilding';
import BuildingManagement from "./BuildingManagement"; // Correct path
import BuildingPage from "../Admin/BuildingPage";
import ExpenseAnalytics from "./ExpenseAnalytics";
import GenerateBills from './GenerateBills';
import ManageResident from './ManageResident';
import PaymentReports from './PaymentReports';
import ResidentList from "./ResidentList";
import ResidentReport from "./ResidentReport";
import WatchmanSignup from "./WatchmanSignup";

import SendNotifications from "./SendNotification";
import VisitorLogs from './VisitorLogs';

// Define the root stack param list with all your screens
export type RootStackParamList = {
    BuildingManagement: undefined;
    BuildingPage: { buildingId: string };
    AddBuilding: undefined;
    ResidentList: { buildingId: string };
    ManageResident: { residentId?: string; buildingId: string };
    GenerateBills: { buildingId: string };
    PaymentReports: { buildingId: string };
    VisitorLogs: { buildingId: string };
    SendNotifications: { 
      building: {
        id: string;
        name: string;
        blocks: Array<{ name: string; flats: number }>;
      };
    };
    ExpenseAnalytics: { buildingId: string };
    ResidentReport: { buildingId: string };
    WatchmanSignUp: { buildingId: string };

   
  };
  
  const Stack = createStackNavigator<RootStackParamList>();
  
  export default function RootNavigator() {
    return (
      <Stack.Navigator initialRouteName="BuildingManagement">
        <Stack.Screen name="BuildingManagement" component={BuildingManagement} />
        <Stack.Screen name="BuildingPage" component={BuildingPage} />
        <Stack.Screen name="AddBuilding" component={AddBuilding} />
        <Stack.Screen name="ResidentList" component={ResidentList} />
        <Stack.Screen name="ManageResident" component={ManageResident} />
        <Stack.Screen name="GenerateBills" component={GenerateBills} />
        <Stack.Screen name="PaymentReports" component={PaymentReports} />
        <Stack.Screen name="VisitorLogs" component={VisitorLogs} />
        <Stack.Screen name="SendNotifications" component={SendNotifications} />
        <Stack.Screen name="ExpenseAnalytics" component={ExpenseAnalytics} />
        <Stack.Screen name="ResidentReport" component={ResidentReport} />
        <Stack.Screen name="WatchmanSignUp" component={WatchmanSignup} />
        <Stack.Screen name="BookEventForm" component={BookEventForm} />

      </Stack.Navigator>
      );
  }
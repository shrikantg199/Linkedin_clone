import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import CustomDrawer from "../../components/CustomDrawer";
const DrawerLayout = () => {
  return (
    <GestureHandlerRootView>
      <Drawer
        screenOptions={{ headerShown: false }}
        drawerContent={(props) => <CustomDrawer {...props} />}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: () => null,
            drawerItemStyle: { backgroundColor: "transparent" },
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
};

export default DrawerLayout;

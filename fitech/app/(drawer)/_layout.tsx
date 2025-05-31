import { Drawer } from 'expo-router/drawer';

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: '#0F4C81',
        drawerInactiveTintColor: '#666',
        drawerType: 'slide',
        drawerStyle: {
          backgroundColor: '#F5F7FA', // soft background
          borderTopRightRadius: 24,
          borderBottomRightRadius: 24,
          width: 280,
        },
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '600',
          marginLeft: -10,
        },
        sceneContainerStyle: {
          backgroundColor: 'transparent',
        },
      }}
    >
      <Drawer.Screen
        name="home"
        options={{
          drawerItemStyle: { display: 'none' }, // 👈 hides it
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          drawerLabel: 'Perfil',
        }}
      />
    </Drawer>
  );
}

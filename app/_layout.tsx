import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { initializeDatabase } from '../services';

export default function RootLayout() {
  useEffect(() => {
    // Initialize database when app starts
    initializeDatabase()
      .then(() => console.log("Database initialized"))
      .catch(err => console.error("Error initializing database:", err));
  }, []);
  
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="student" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="driver" options={{ animation: 'slide_from_right' }} />
    </Stack>
  );
}

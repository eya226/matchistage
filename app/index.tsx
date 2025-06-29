import { Redirect } from 'expo-router';

export default function Index() {
  // For new users, redirect to welcome screen
  // In a real app, you'd check authentication status here
  return <Redirect href="/auth/welcome" />;
}
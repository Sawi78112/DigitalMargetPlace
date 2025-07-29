export * from './hooks'
export * from './login-form'
export * from './register-form'
export { useCurrentUser } from '@/lib/hooks/use-current-user'

// Export a function to set current user (placeholder for now)
export function setCurrentUser(user: any) {
  // This would typically be handled by your state management
  // Set current user in state
}

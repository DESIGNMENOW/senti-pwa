import { pb } from '#/lib/pocketbase'

export function isAuthenticated(): boolean {
  return pb.authStore.isValid
}

export function getCurrentUser() {
  return pb.authStore.record
}

export async function login(
  email: string,
  password: string,
) {
  return pb.collection('users').authWithPassword(
    email,
    password,
  )
}

export function logout() {
  pb.authStore.clear()
}

export function saveLogin(data) {
  localStorage.setItem('token', data.token)
}

export function getToken() {
  return localStorage.getItem('token')
}

export function getTokenPayload() {
  const token = getToken()

  if (!token || token.split('.').length !== 3) {
    return null
  }

  try {
    const encodedPayload = token
      .split('.')[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/')
    const paddedPayload = encodedPayload.padEnd(
      Math.ceil(encodedPayload.length / 4) * 4,
      '=',
    )
    const bytes = atob(paddedPayload)
    const decodedPayload = Array.prototype.map
      .call(
        bytes,
        (character) => `%${character.charCodeAt(0).toString(16).padStart(2, '0')}`,
      )
      .join('')

    return JSON.parse(decodeURIComponent(decodedPayload))
  } catch (error) {
    return null
  }
}

export function getSavedUserProfile() {
  try {
    const user = JSON.parse(localStorage.getItem('userProfile') || 'null')

    return user && typeof user === 'object' ? user : null
  } catch (error) {
    return null
  }
}

export function saveUserProfile(user) {
  if (!user || typeof user !== 'object') {
    return
  }

  const profile = {}
  const fields = [
    '_id',
    'name',
    'lastname',
    'username',
    'role',
  ]

  fields.forEach((field) => {
    if (user[field] !== undefined && user[field] !== null) {
      profile[field] = user[field]
    }
  })

  if (Object.keys(profile).length > 0) {
    localStorage.setItem('userProfile', JSON.stringify(profile))
  }
}

export function isAuthenticated() {
  const token = getToken()

  return Boolean(token && token !== 'undefined' && token !== 'null')
}

export function Logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  localStorage.removeItem('userProfile')
  localStorage.removeItem('cart')
}

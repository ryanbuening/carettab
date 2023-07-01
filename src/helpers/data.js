/**
 * Convert image blob data to base64
 * @param blob
 * @returns image as base64
 */
export const blobToBase64 = async (blob) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.readAsDataURL(blob)
  })
}

/**
 * Check license against AWS
 */
export const checkLicense = async (license) => {
  let validLicense = false
  try {
    const request = await fetch(`https://dtfv5mvrx9.execute-api.us-west-2.amazonaws.com/v1/license/${license}`, {
      method: 'GET',
      redirect: 'follow',
      headers: { authorizationToken: chrome.runtime.id },
    })
    const data = await request.json()
    validLicense = JSON.parse(data.data)
  } catch (error) {
    console.warn('Failed to check license', error)
    validLicense = false
  }
  return validLicense
}

/**
 * Compare two version numbers. Return 1 if greater than, -1 if less than, 0 if equal
 */
export const compareVersions = (version1, version2) => {
  /*
  compareVersions('1.0.0', '1.0.1') // Output: -1
  compareVersions('2.0', '1.9.9') // Output: 1
  compareVersions('1.2.0', '1.2') // Output: 0
  */

  let v1parts = version1.split('.')
  let v2parts = version2.split('.')

  // Remove trailing zeros
  while (v1parts.length > 0 && v1parts[v1parts.length - 1] === '0') v1parts.pop()
  while (v2parts.length > 0 && v2parts[v2parts.length - 1] === '0') v2parts.pop()

  // Ensure both arrays are the same length by padding with zeros if necessary
  while (v1parts.length < v2parts.length) v1parts.push('0')
  while (v2parts.length < v1parts.length) v2parts.push('0')

  for (let i = 0; i < v1parts.length; ++i) {
    if (parseInt(v1parts[i], 10) > parseInt(v2parts[i], 10)) {
      return 1
    }
    if (parseInt(v1parts[i], 10) < parseInt(v2parts[i], 10)) {
      return -1
    }
  }

  return 0
}

/**
 * Check if version is within a range. Uses "X" as a wildcard. Returns boolean.
 */
export const checkVersionInRange = (version, range) => {
  /*
  checkVersionInRange('3.0.1', '3.X.X') // Output: true
  checkVersionInRange('2.9.1', '3.X.X') // Output: false
  checkVersionInRange('3.1.0', '3.1.X') // Output: true
  checkVersionInRange('3.2.0', '3.1.X') // Output: false
  */
  let versionParts = version.split('.')
  let rangeParts = range.split('.')

  for (let i = 0; i < rangeParts.length; ++i) {
    if (rangeParts[i] === 'X') continue

    if (parseInt(versionParts[i], 10) > parseInt(rangeParts[i], 10)) {
      return false
    }
    if (parseInt(versionParts[i], 10) < parseInt(rangeParts[i], 10)) {
      return false
    }
  }

  return true
}

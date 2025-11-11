"use server"

export interface AddressValidationResult {
  isValid: boolean
  fullAddress?: string
  standardizedAddress?: {
    streetAddress: string
    city: string
    state: string
    zipCode: string
    zipPlus4?: string
  }
  dpvConfirmation?: string
  deliveryPoint?: string
  carrierRoute?: string
  businessFlag?: boolean
  error?: string
  details?: string
}

// USPS API configuration
const USPS_CONFIG = {
  tokenUrl: 'https://apis-tem.usps.com/oauth2/v3/token',
  addressUrl: 'https://apis-tem.usps.com/addresses/v3/address',
  credentials: {
    clientId: process.env.USPS_CONSUMER_KEY || '',
    clientSecret: process.env.USPS_CONSUMER_SECRET || '',
    customerId: process.env.USPS_CUSTOMER_ID || '1234567890'
  }
}

// Cache for access token
let accessToken: string | null = null
let tokenExpiry: Date | null = null

/**
 * Get OAuth2 access token from USPS
 */
async function getUSPSAccessToken(): Promise<string | null> {
  // Check if we have a valid cached token
  if (accessToken && tokenExpiry && new Date() < tokenExpiry) {
    return accessToken
  }

  try {
    const response = await fetch(USPS_CONFIG.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: USPS_CONFIG.credentials.clientId,
        client_secret: USPS_CONFIG.credentials.clientSecret,
        grant_type: 'client_credentials',
      }),
    })

    if (response.status === 200) {
      const data = await response.json()
      accessToken = data.access_token
      const expiresIn = data.expires_in || 3600
      tokenExpiry = new Date(Date.now() + expiresIn * 1000)
      console.log('✅ Got USPS access token, expires in:', expiresIn, 'seconds')
      return accessToken
    }

    const errorText = await response.text()
    console.error('Failed to get USPS access token:', response.status, errorText)
    return null
  } catch (error) {
    console.error('Error getting USPS access token:', error)
    return null
  }
}

/**
 * Server Action to validate a US address using USPS API
 * This runs on the server side only due to "use server" directive
 * Can be called directly from client components
 */
export async function validateUSPSAddress(
  address: string,
  city: string,
  state: string,
  zipCode?: string
): Promise<AddressValidationResult> {
  try {
    // Validate required fields
    if (!address || !city || !state) {
      return {
        isValid: false,
        error: 'Missing required address fields'
      }
    }

    console.log('Getting USPS access token...')
    const token = await getUSPSAccessToken()

    if (!token) {
      console.error('Failed to get USPS access token')
      return {
        isValid: false,
        error: 'Failed to authenticate with USPS API'
      }
    }

    console.log('Got token, making address validation request...')

    // Build query parameters
    const params = new URLSearchParams({
      streetAddress: address,
      city,
      state,
    })

    // Log the request for debugging
    console.log('USPS API Request:', {
      url: `${USPS_CONFIG.addressUrl}?${params}`,
      headers: {
        'Authorization': `Bearer ${token.substring(0, 10)}...`,
        'Accept': 'application/json',
        'x-user-id': USPS_CONFIG.credentials.customerId,
      },
      params: Object.fromEntries(params.entries())
    })

    // Make the request to USPS
    const response = await fetch(`${USPS_CONFIG.addressUrl}?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'x-user-id': USPS_CONFIG.credentials.customerId,
      },
    })

    console.log('USPS API Response Status:', response.status)

    if (response.status === 200) {
      const data = await response.json()
      console.log('USPS API Full Response:', JSON.stringify(data, null, 2))

      // Check if address was returned (it's nested in data.address)
      if (data.address?.streetAddress) {
        const addr = data.address
        const dpvConfirmation = data.additionalInfo?.DPVConfirmation || 'N/A'

        // Format the full address
        const fullZip = addr.ZIPPlus4 ? `${addr.ZIPCode}-${addr.ZIPPlus4}` : addr.ZIPCode
        const fullAddress = `${addr.streetAddress}, ${addr.city}, ${addr.state}, ${fullZip}`

        console.log('✅ Address validated:', fullAddress)
        console.log('DPV Confirmation:', dpvConfirmation)
        console.log('Additional Info:', data.additionalInfo)

        return {
          isValid: true,
          fullAddress,
          standardizedAddress: {
            streetAddress: addr.streetAddress,
            city: addr.city,
            state: addr.state,
            zipCode: addr.ZIPCode,
            zipPlus4: addr.ZIPPlus4,
          },
          deliveryPoint: data.additionalInfo?.deliveryPoint,
          carrierRoute: data.additionalInfo?.carrierRoute,
          businessFlag: data.additionalInfo?.business === 'Y',
          dpvConfirmation,
        }
      }

      return {
        isValid: false,
        error: 'Address not found or not deliverable',
      }
    }

    // Handle error responses
    const errorText = await response.text()
    console.log('USPS API Error Response:', errorText)

    try {
      const errorData = JSON.parse(errorText)

      // Check if it's a validation error (400) with specific message
      if (response.status === 400 && errorData.error) {
        const errorMessage = errorData.error.message || 'Invalid address'
        console.log('Address validation failed:', errorMessage)

        return {
          isValid: false,
          error: 'Address not found or not deliverable',
          details: errorMessage
        }
      }
    } catch (parseError) {
      console.error('Failed to parse error response:', parseError)
    }

    // Check if it's a 404 (address not found)
    if (response.status === 404) {
      console.log('Address not found (404)')
      return {
        isValid: false,
        error: 'Address not found or not deliverable',
      }
    }

    // For other errors, return generic message
    return {
      isValid: false,
      error: 'Service temporarily unavailable. Please try again later.',
    }

  } catch (error) {
    console.error('Error in validateUSPSAddress Server Action:', error)
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Address validation service error'
    }
  }
}
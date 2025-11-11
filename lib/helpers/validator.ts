/**
 * Validation Service
 * Contains validation functions for form fields and external API integrations
 */

import { AuthFormValidator } from '../constants'

// Date of Birth Validation
export const DOB_VALIDATION_FUNCTION = (value: string): { isValid: boolean; error?: string } => {
  const [mmStr, ddStr, yyyyStr] = value.split('-')
  const mm = Number(mmStr)
  const dd = Number(ddStr)
  const yyyy = Number(yyyyStr)
  const date = new Date(yyyy, mm - 1, dd)

  // Check if the date is valid
  const isValidDate =
    date.getFullYear() === yyyy &&
    date.getMonth() === mm - 1 &&
    date.getDate() === dd

  if (!isValidDate) {
    return { isValid: false, error: AuthFormValidator.DOB_INVALID_MESSAGE }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0) // Reset time to start of day

  // Check if date is in the future
  if (date > today) {
    return { isValid: false, error: AuthFormValidator.DOB_FUTURE_MESSAGE }
  }

  // Check if date is too old (more than 150 years ago)
  const cutoff = new Date()
  cutoff.setFullYear(cutoff.getFullYear() - AuthFormValidator.DOB_MAX_AGE_YEARS_VALUE)
  if (date < cutoff) {
    return { isValid: false, error: AuthFormValidator.DOB_TOO_OLD_MESSAGE }
  }

  return { isValid: true }
}

// USPS Address Verification Types
export interface USPSAddress {
  streetAddress: string
  city: string
  state: string
  zipCode: string
  zipPlus4?: string
}

export interface USPSVerificationResult {
  isValid: boolean
  standardizedAddress?: USPSAddress
  error?: string
  deliveryPoint?: string
  carrierRoute?: string
  businessFlag?: boolean
}

/**
 * USPS Address Verification Service
 * Uses USPS Web Tools API to verify and standardize US addresses
 */
export class USPSAddressVerification {
  private clientId: string
  private clientSecret: string
  private customerRegistrationId: string
  private baseUrl = 'https://apis-tem.usps.com/addresses/v3/address'
  private tokenUrl = 'https://apis-tem.usps.com/oauth2/v3/token'
  private accessToken?: string
  private tokenExpiry?: Date
  private refreshToken?: string

  constructor(clientId?: string, clientSecret?: string, customerRegistrationId?: string) {
    this.clientId = clientId || process.env.USPS_CONSUMER_KEY || ''
    this.clientSecret = clientSecret || process.env.USPS_CONSUMER_SECRET || ''
    this.customerRegistrationId = customerRegistrationId || '1234567890'

    if (!this.clientId || !this.clientSecret) {
      console.warn('USPS API credentials not configured. Address verification will be skipped.')
    }
  }

  /**
   * Get OAuth2 access token for USPS API
   */
  private async getAccessToken(): Promise<boolean> {
    try {
      const response = await fetch(this.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'client_credentials',
        }),
      })

      if (response.status === 200) {
        const data = await response.json()
        this.accessToken = data.access_token
        const expiresIn = data.expires_in || 3600
        this.tokenExpiry = new Date(Date.now() + expiresIn * 1000)
        this.refreshToken = data.refresh_token
        return true
      }

      console.error(`Failed to get access token: ${response.status}`)
      return false
    } catch (error) {
      console.error('Error getting USPS access token:', error)
      return false
    }
  }

  /**
   * Ensure we have a valid token before making API calls
   */
  private async ensureValidToken(): Promise<boolean> {
    if (!this.accessToken || !this.tokenExpiry || new Date() >= this.tokenExpiry) {
      return await this.getAccessToken()
    }
    return true
  }

  /**
   * Verify and standardize a US address using USPS API
   */
  async verifyAddress(address: {
    streetAddress: string
    city: string
    state: string
    zipCode?: string
  }): Promise<USPSVerificationResult> {
    if (!this.clientId || !this.clientSecret) {
      return {
        isValid: false,
        error: 'USPS API credentials not configured',
      }
    }

    try {
      if (!await this.ensureValidToken()) {
        return {
          isValid: false,
          error: 'Failed to get access token',
        }
      }

      const params = new URLSearchParams({
        streetAddress: address.streetAddress,
        city: address.city,
        state: address.state,
      })

      if (address.zipCode) {
        params.append('ZIPCode', address.zipCode)
      }

      const response = await fetch(`${this.baseUrl}?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/json',
          'x-user-id': this.customerRegistrationId,
        },
      })

      if (response.status === 200) {
        const data = await response.json()

        // The API returns the address directly, not nested
        if (data.streetAddress) {
          return {
            isValid: true,
            standardizedAddress: {
              streetAddress: data.streetAddress,
              city: data.city,
              state: data.state,
              zipCode: data.ZIPCode,
              zipPlus4: data.ZIPPlus4,
            },
            deliveryPoint: data.deliveryPoint,
            carrierRoute: data.carrierRoute,
            businessFlag: data.business,
          }
        }

        return {
          isValid: false,
          error: 'Address not found or not deliverable',
        }
      } else {
        const errorText = await response.text()
        return {
          isValid: false,
          error: `Failed to verify address: ${response.status} ${errorText}`,
        }
      }
    } catch (error) {
      console.error('Error verifying address:', error)
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Address verification failed',
      }
    }
  }

  /**
   * Format a standardized address for display
   */
  formatAddress(address: USPSAddress): string {
    const zip = address.zipPlus4
      ? `${address.zipCode}-${address.zipPlus4}`
      : address.zipCode

    return `${address.streetAddress}, ${address.city}, ${address.state} ${zip}`
  }
}

// Export a singleton instance using environment variables
export const uspsVerifier = new USPSAddressVerification()
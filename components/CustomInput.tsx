import { FormControl, FormField, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import type { Control, FieldPath } from 'react-hook-form'
import type { z } from 'zod'
import { AuthFormSchema } from '@/lib/utils'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

const schema = AuthFormSchema({type: "sign-up"})

interface CustomInputProps {
  control: Control<z.infer<typeof schema>>;
  name: FieldPath<z.infer<typeof schema>>;
  label: string;
  placeholder: string;
}

const CustomInput = ({ control, name, label, placeholder }: CustomInputProps) => {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const formatDateOfBirth = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '').slice(0, 8)
    const mm = digitsOnly.slice(0, 2)
    const dd = digitsOnly.slice(2, 4)
    const yyyy = digitsOnly.slice(4, 8)
    return [mm, dd, yyyy].filter(Boolean).join('-')
  }

  const formatSSN = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '').slice(0, 9)
    const a = digitsOnly.slice(0, 3)
    const b = digitsOnly.slice(3, 5)
    const c = digitsOnly.slice(5, 9)
    return [a, b, c].filter(Boolean).join('-')
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="form-item">
          <FormLabel className="form-label">{label}</FormLabel>
          <div className="flex w-full flex-col">
            <FormControl>
              <div className="relative">
                <Input
                  placeholder={placeholder}
                  className="input-class"
                  type={name === 'password' ? (showPassword ? 'text' : 'password') : 'text'}
                  inputMode={name === 'dateOfBirth' || name === 'ssn' ? 'numeric' : undefined}
                  autoComplete="off"
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const raw = e.target.value
                    let nextValue = raw
                    if (name === 'dateOfBirth') {
                      nextValue = formatDateOfBirth(raw)
                    } else if (name === 'ssn') {
                      nextValue = formatSSN(raw)
                    }
                    field.onChange(nextValue)
                  }}
                />
                {name === 'password' && (
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>
            </FormControl>
            <FormMessage
              className="form-message mt-2"
            />
          </div>
        </div>
      )}
    />
  )
}

export default CustomInput
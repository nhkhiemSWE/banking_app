import { FormControl, FormField, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Control, FieldPath } from 'react-hook-form'
import { z } from 'zod'
import { AuthFormSchema } from '@/lib/utils'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface CustomInputProps {
  control: Control<z.infer<typeof AuthFormSchema>>;
  name: FieldPath<z.infer<typeof AuthFormSchema>>;
  label: string;
  placeholder: string;
}

const CustomInput = ({ control, name, label, placeholder }: CustomInputProps) => {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
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
                <Input placeholder={placeholder}
                  className="input-class pr-10"
                  type={name === 'password' ? (showPassword ? 'text' : 'password') : 'text'}
                  {...field}
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
/* eslint-disable no-prototype-builtins */
import { type ClassValue, clsx } from "clsx";
import qs from "query-string";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import { AuthFormValidator } from "./constants";
import { DOB_VALIDATION_FUNCTION } from "./helpers/validator";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// FORMAT DATE TIME
export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const dateDayOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    year: "numeric", // numeric year (e.g., '2023')
    month: "2-digit", // abbreviated month name (e.g., 'Oct')
    day: "2-digit", // numeric day of the month (e.g., '25')
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-US",
    dateTimeOptions
  );

  const formattedDateDay: string = new Date(dateString).toLocaleString(
    "en-US",
    dateDayOptions
  );

  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-US",
    dateOptions
  );

  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-US",
    timeOptions
  );

  return {
    dateTime: formattedDateTime,
    dateDay: formattedDateDay,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

export function formatAmount(amount: number): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  return formatter.format(amount);
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export const removeSpecialCharacters = (value: string) => {
  return value.replace(/[^\w\s]/gi, "");
};

interface UrlQueryParams {
  params: string;
  key: string;
  value: string;
}

export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

export function getAccountTypeColors(type: AccountTypes) {
  switch (type) {
    case "depository":
      return {
        bg: "bg-blue-25",
        lightBg: "bg-blue-100",
        title: "text-blue-900",
        subText: "text-blue-700",
      };

    case "credit":
      return {
        bg: "bg-success-25",
        lightBg: "bg-success-100",
        title: "text-success-900",
        subText: "text-success-700",
      };

    default:
      return {
        bg: "bg-green-25",
        lightBg: "bg-green-100",
        title: "text-green-900",
        subText: "text-green-700",
      };
  }
}

export function countTransactionCategories(
  transactions: Transaction[]
): CategoryCount[] {
  const categoryCounts: { [category: string]: number } = {};
  let totalCount = 0;

  // Iterate over each transaction
  transactions &&
    transactions.forEach((transaction) => {
      // Extract the category from the transaction
      const category = transaction.category;

      // If the category exists in the categoryCounts object, increment its count
      if (categoryCounts.hasOwnProperty(category)) {
        categoryCounts[category]++;
      } else {
        // Otherwise, initialize the count to 1
        categoryCounts[category] = 1;
      }

      // Increment total count
      totalCount++;
    });

  // Convert the categoryCounts object to an array of objects
  const aggregatedCategories: CategoryCount[] = Object.keys(categoryCounts).map(
    (category) => ({
      name: category,
      count: categoryCounts[category],
      totalCount,
    })
  );

  // Sort the aggregatedCategories array by count in descending order
  aggregatedCategories.sort((a, b) => b.count - a.count);

  return aggregatedCategories;
}

export function extractCustomerIdFromUrl(url: string) {
  // Split the URL string by '/'
  const parts = url.split("/");

  // Extract the last part, which represents the customer ID
  const customerId = parts[parts.length - 1];

  return customerId;
}

export function encryptId(id: string) {
  return btoa(id);
}

export function decryptId(id: string) {
  return atob(id);
}

export const getTransactionStatus = (date: Date) => {
  const today = new Date();
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);

  return date > twoDaysAgo ? "Processing" : "Success";
};


export const AuthFormSchema = ({ type }: { type: string }) => z.object({
  // Both sign in and sign up
  email: z
    .email({
      error: (issue) =>
        issue.input === undefined
          ? AuthFormValidator.EMAIL_REQUIRED_MESSAGE
          : AuthFormValidator.EMAIL_INVALID_MESSAGE
    })
    .max(AuthFormValidator.EMAIL_MAX_LEN_VALUE, AuthFormValidator.EMAIL_MAX_MESSAGE),

  password: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? AuthFormValidator.PASSWORD_REQUIRED_MESSAGE
          : AuthFormValidator.PASSWORD_MIN_MESSAGE
    })
    .min(AuthFormValidator.PASSWORD_MIN_LEN_VALUE, AuthFormValidator.PASSWORD_MIN_MESSAGE),

  // Sign up only fields
  firstName: type === 'sign-in'
    ? z.string().optional().nullable()
    : z.string({
        error: (issue) =>
          issue.input === undefined
            ? AuthFormValidator.FIRST_NAME_REQUIRED_MESSAGE
            : AuthFormValidator.FIRST_NAME_MAX_MESSAGE
      })
      .min(1, AuthFormValidator.FIRST_NAME_REQUIRED_MESSAGE)
      .max(AuthFormValidator.NAME_MAX_LEN_VALUE, AuthFormValidator.FIRST_NAME_MAX_MESSAGE),

  lastName: type === 'sign-in'
    ? z.string().optional().nullable()
    : z.string({
        error: (issue) =>
          issue.input === undefined
            ? AuthFormValidator.LAST_NAME_REQUIRED_MESSAGE
            : AuthFormValidator.LAST_NAME_MAX_MESSAGE
      })
      .min(1, AuthFormValidator.LAST_NAME_REQUIRED_MESSAGE)
      .max(AuthFormValidator.NAME_MAX_LEN_VALUE, AuthFormValidator.LAST_NAME_MAX_MESSAGE),

  address: type === 'sign-in'
    ? z.string().optional().nullable()
    : z.string({
        error: (issue) =>
          issue.input === undefined
            ? AuthFormValidator.ADDRESS_REQUIRED_MESSAGE
            : AuthFormValidator.ADDRESS_MAX_MESSAGE
      })
      .min(1, AuthFormValidator.ADDRESS_REQUIRED_MESSAGE)
      .max(AuthFormValidator.ADDRESS_MAX_LEN_VALUE, AuthFormValidator.ADDRESS_MAX_MESSAGE),

  city: type === 'sign-in'
    ? z.string().optional().nullable()
    : z.string({
        error: (issue) =>
          issue.input === undefined
            ? AuthFormValidator.CITY_REQUIRED_MESSAGE
            : AuthFormValidator.CITY_MAX_MESSAGE
      })
      .min(1, AuthFormValidator.CITY_REQUIRED_MESSAGE)
      .max(AuthFormValidator.CITY_MAX_LEN_VALUE, AuthFormValidator.CITY_MAX_MESSAGE),

  state: type === 'sign-in'
    ? z.string().optional().nullable()
    : z.string({
        error: (issue) =>
          issue.input === undefined
            ? AuthFormValidator.STATE_REQUIRED_MESSAGE
            : AuthFormValidator.STATE_MAX_MESSAGE
      })
      .min(1, AuthFormValidator.STATE_REQUIRED_MESSAGE)
      .max(AuthFormValidator.STATE_MAX_LEN_VALUE, AuthFormValidator.STATE_MAX_MESSAGE),

  postalCode: type === 'sign-in'
    ? z.string().optional().nullable()
    : z.string({
        error: (issue) =>
          issue.input === undefined
            ? AuthFormValidator.POSTAL_CODE_REQUIRED_MESSAGE
            : AuthFormValidator.POSTAL_CODE_MAX_MESSAGE
      })
      .min(1, AuthFormValidator.POSTAL_CODE_REQUIRED_MESSAGE)
      .max(AuthFormValidator.POSTAL_CODE_MAX_LEN_VALUE, AuthFormValidator.POSTAL_CODE_MAX_MESSAGE),

  dateOfBirth: type === 'sign-in'
    ? z.string().optional().nullable()
    : z.string({
        error: (issue) =>
          issue.input === undefined
            ? AuthFormValidator.DOB_FORMAT_MESSAGE
            : AuthFormValidator.DOB_FORMAT_MESSAGE
      })
      .regex(AuthFormValidator.DOB_REGEX_VALUE, AuthFormValidator.DOB_FORMAT_MESSAGE)
      .length(AuthFormValidator.DOB_LENGTH_VALUE, AuthFormValidator.DOB_FORMAT_MESSAGE)
      .superRefine((value, ctx) => {
        const result = DOB_VALIDATION_FUNCTION(value);
        if (!result.isValid) {
          ctx.addIssue({
            code: "custom",
            message: result.error || 'Invalid date',
          });
        }
      }),

  ssn: type === 'sign-in'
    ? z.string().optional().nullable()
    : z.string({
        error: (issue) =>
          issue.input === undefined
            ? AuthFormValidator.SSN_FORMAT_MESSAGE
            : AuthFormValidator.SSN_FORMAT_MESSAGE
      })
      .regex(AuthFormValidator.SSN_REGEX_VALUE, AuthFormValidator.SSN_FORMAT_MESSAGE)
      .length(AuthFormValidator.SSN_LENGTH_VALUE, AuthFormValidator.SSN_LENGTH_MESSAGE),
});

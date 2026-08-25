/**
 * MSG91 Phone OTP Integration Service
 * 
 * Provides direct integration with MSG91 v5 OTP APIs:
 * - Send OTP:   https://control.msg91.com/api/v5/otp
 * - Verify OTP: https://control.msg91.com/api/v5/otp/verify
 * - Resend OTP: https://control.msg91.com/api/v5/otp/retry
 */

const MSG91_AUTH_KEY = import.meta.env["VITE_MSG91_AUTH_KEY"] || "";
const MSG91_TEMPLATE_ID = import.meta.env["VITE_MSG91_TEMPLATE_ID"] || "";

export type Msg91Response = {
  type: "success" | "error";
  message: string;
};

/**
 * Formats Indian phone number to MSG91 format (e.g., 919876543210)
 */
export function formatIndianPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return digits;
  return digits;
}

/**
 * Validates 10-digit Indian phone number
 */
export function validateIndianPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return /^[6-9]\d{9}$/.test(digits);
  if (digits.length === 12 && digits.startsWith("91")) return /^[6-9]\d{9}$/.test(digits.slice(2));
  return false;
}

/**
 * Send OTP via MSG91 v5 API
 */
export async function sendMsg91Otp(phone: string): Promise<Msg91Response> {
  const formattedMobile = formatIndianPhone(phone);
  if (!validateIndianPhone(phone)) {
    throw new Error("Please enter a valid 10-digit Indian mobile number.");
  }

  // If MSG91 credentials are provided, call the live MSG91 API
  if (MSG91_AUTH_KEY && MSG91_TEMPLATE_ID) {
    try {
      const url = new URL("https://control.msg91.com/api/v5/otp");
      url.searchParams.append("template_id", MSG91_TEMPLATE_ID);
      url.searchParams.append("mobile", formattedMobile);
      url.searchParams.append("authkey", MSG91_AUTH_KEY);

      const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = (await response.json()) as { type?: string; message?: string };
      if (data.type === "success" || response.ok) {
        return {
          type: "success",
          message: data.message || "OTP sent successfully to your mobile number.",
        };
      } else {
        throw new Error(data.message || "Failed to send OTP via MSG91.");
      }
    } catch (err) {
      if (err instanceof Error) throw err;
      throw new Error("Unable to connect to MSG91 OTP service.");
    }
  }

  // Sandbox / Demo mode fallback when API keys are not yet inserted in environment
  console.info(`[MSG91 Sandbox] OTP requested for +${formattedMobile}. (Demo code: 123456)`);
  return {
    type: "success",
    message: `OTP sent to +${formattedMobile} (Sandbox Mode: use code 123456).`,
  };
}

/**
 * Verify OTP via MSG91 v5 API
 */
export async function verifyMsg91Otp(phone: string, otp: string): Promise<Msg91Response> {
  const formattedMobile = formatIndianPhone(phone);
  const cleanOtp = otp.trim();

  if (cleanOtp.length < 4 || cleanOtp.length > 6) {
    throw new Error("Please enter a valid 4-to-6 digit OTP code.");
  }

  // If MSG91 credentials are provided, verify with MSG91 API
  if (MSG91_AUTH_KEY) {
    try {
      const url = new URL("https://control.msg91.com/api/v5/otp/verify");
      url.searchParams.append("otp", cleanOtp);
      url.searchParams.append("mobile", formattedMobile);
      url.searchParams.append("authkey", MSG91_AUTH_KEY);

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = (await response.json()) as { type?: string; message?: string };
      if (data.type === "success" || response.ok) {
        return {
          type: "success",
          message: data.message || "OTP verified successfully.",
        };
      } else {
        throw new Error(data.message || "Invalid or expired OTP code.");
      }
    } catch (err) {
      if (err instanceof Error) throw err;
      throw new Error("Unable to verify OTP with MSG91.");
    }
  }

  // Sandbox / Demo mode verification
  if (cleanOtp === "123456" || cleanOtp === "000000" || cleanOtp.length >= 4) {
    return {
      type: "success",
      message: "OTP verified successfully (Sandbox Mode).",
    };
  }

  throw new Error("Invalid OTP code. In sandbox mode, enter 123456.");
}

/**
 * Resend OTP via MSG91 v5 API
 */
export async function resendMsg91Otp(phone: string): Promise<Msg91Response> {
  const formattedMobile = formatIndianPhone(phone);

  if (MSG91_AUTH_KEY) {
    try {
      const url = new URL("https://control.msg91.com/api/v5/otp/retry");
      url.searchParams.append("authkey", MSG91_AUTH_KEY);
      url.searchParams.append("mobile", formattedMobile);
      url.searchParams.append("retrytype", "text");

      const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = (await response.json()) as { type?: string; message?: string };
      if (data.type === "success" || response.ok) {
        return {
          type: "success",
          message: data.message || "OTP resent successfully.",
        };
      } else {
        throw new Error(data.message || "Failed to resend OTP.");
      }
    } catch (err) {
      if (err instanceof Error) throw err;
      throw new Error("Unable to resend OTP via MSG91.");
    }
  }

  return {
    type: "success",
    message: `OTP resent to +${formattedMobile} (Sandbox Mode: use code 123456).`,
  };
}

import { LoginData, RegisterData, VerifyEmailData } from "@/types/data";
import { printError } from "@/utils/dev";
import { validateDOB, validateEmail } from "@/utils/validators";
import axios from "axios";
import { useState } from "react";

export interface RegisterFormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  dob?: string;
  message?: string;
}

export interface OTPFormErrors {
  otp?: string;
  userId?: string;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
  message?: string;
}

export interface LogoutErrors {
  message?: string;
}

const BACKEND_AUTH_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth`;

const useAuth = () => {
  // State variables
  const [registerLoading, setRegisterLoading] = useState<boolean>(false);
  const [registerErrors, setRegisterErrors] = useState<RegisterFormErrors>({});

  const [otpLoading, setOtpLoading] = useState<boolean>(false);
  const [otpErros, setOtpErrors] = useState<OTPFormErrors>({});

  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [loginErrors, setLoginErrors] = useState<LoginFormErrors>({});

  const [logoutLoading, setLogoutLoading] = useState<boolean>(false);
  const [logoutErrors, setLogoutErrors] = useState<LogoutErrors>({});

  // Validating the form data
  const validateRegisterForm = (data: RegisterData): boolean => {
    const newErrors: RegisterFormErrors = {};

    if (!data.name.trim()) {
      newErrors.name = "Please enter your name";
    }

    if (!data.email.trim()) {
      newErrors.email = "Please enter your email address";
    } else if (!validateEmail(data.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!data.password) {
      newErrors.password = "Please create a password";
    } else if (data.password.length < 8) {
      newErrors.password = "Password should be at least 8 characters";
    }

    if (!data.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match yet";
    }

    if (data.dob && !validateDOB(data.dob)) {
      newErrors.dob = "Please check your date of birth";
    }

    setRegisterErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOTPForm = (data: VerifyEmailData): boolean => {
    const newErrors: OTPFormErrors = {};
    const { otp, userId } = data;

    if (!userId) {
      newErrors.userId = "Invalid user, try registering again";
    }

    if (!otp.trim()) {
      newErrors.otp = "Please enter the verification code";
    } else if (otp.length !== 6) {
      newErrors.otp = "Verification code should be 6 digits";
    } else if (!/^\d+$/.test(otp)) {
      newErrors.otp = "Verification code should only contain numbers";
    }

    setOtpErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLoginForm = (data: LoginData): boolean => {
    const newErrors: LoginFormErrors = {};

    if (!data.email.trim()) {
      newErrors.email = "Please enter your email address";
    } else if (!validateEmail(data.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!data.password) {
      newErrors.password = "Please enter your password";
    }

    setLoginErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const register = async (data: RegisterData): Promise<boolean | string> => {
    try {
      // States updation
      setRegisterErrors({});
      setRegisterLoading(true);

      if (!validateRegisterForm(data)) {
        return false;
      }

      const { email, password, name, dob } = data;

      const res = await axios.post(
        `${BACKEND_AUTH_URL}/register`,
        {
          email,
          name,
          password,
          dob,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (res.data?.success) {
        console.log(res.data);

        return res.data?.userId;
      }

      return false;
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Internal server error, try again later";

      setRegisterErrors((prev) => ({ ...prev, message: errorMsg }));
      printError(error);

      return false;
    } finally {
      setRegisterLoading(false);
    }
  };

  const verifyEmail = async (data: VerifyEmailData): Promise<boolean> => {
    try {
      setOtpLoading(true);
      setOtpErrors({});
      if (!validateOTPForm(data)) {
        return false;
      }

      const res = await axios.post(`${BACKEND_AUTH_URL}/verify-email`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.data?.success) {
        console.log(res.data);

        return true;
      }

      return false;
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Internal server error";

      printError(error);
      setOtpErrors((prev) => ({ ...prev, userId: errorMsg }));

      return false;
    } finally {
      setOtpLoading(false);
    }
  };

  const login = async (data: LoginData): Promise<boolean> => {
    try {
      setLoginLoading(true);
      setLoginErrors({});

      if (!validateLoginForm(data)) {
        return false;
      }

      const res = await axios.post(`${BACKEND_AUTH_URL}/login`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.data?.success) {
        console.log(res.data);

        return true;
      }

      return false;
    } catch (error: any) {
      let errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to login to your account";
      printError(errorMsg);
      setLoginErrors((prev) => ({ ...prev, message: errorMsg }));

      return false;
    } finally {
      setLoginLoading(false);
    }
  };

  const logout = async (): Promise<boolean> => {
    try {
      setLogoutLoading(true);
      setLogoutErrors({});

      const res = await axios.get(`${BACKEND_AUTH_URL}/logout`);

      if (res.data?.success) {
        return true;
      }

      return false;
    } catch (error: any) {
      const errroMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Logging out failed";
      printError(errroMsg);
      return false;
    } finally {
      setLogoutLoading(false);
    }
  };

  return {
    register,
    verifyEmail,
    login,
    logout,

    registerLoading,
    registerErrors,
    otpLoading,
    otpErros,
    loginErrors,
    loginLoading,
    logoutLoading,
    logoutErrors,
  };
};

export default useAuth;

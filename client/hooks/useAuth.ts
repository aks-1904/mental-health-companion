import { RegisterData } from "@/types/data";
import { printError } from "@/utils/dev";
import { validateDOB, validateEmail, validateName } from "@/utils/validators";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface RegisterFormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  dob?: string;
  message?: string;
}

const BACKEND_AUTH_URL = `${process.env.BACKEND_URL}/api/v1/auth`;

const useAuth = () => {
  // Validating the form data
  const validateForm = (data: RegisterData): boolean => {
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

    // if (!data.dob) {
    //   newErrors.dob = "Please select your date of birth";
    // } else if (!validateDOB(data.dob)) {
    //   newErrors.dob = "Please check your date of birth";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const router = useRouter();

  const register = async (data: RegisterData) => {
    try {
      // States updation
      setErrors({});
      setLoading(true);

      if (!validateForm(data)) {
        return;
      }

      const { email, password, name } = data;

      const res = await axios.post(
        `${BACKEND_AUTH_URL}/register`,
        {
          email,
          name,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (res.data?.success) {
        console.log(res.data);
        router.push("/otp");
      }
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Internal server error, try again later";

      setErrors({ message: errorMsg });
      printError(error);
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, errors };
};

export default useAuth;

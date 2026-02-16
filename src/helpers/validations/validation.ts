export const Validations = {
  validateEmail: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
  },
};

export const validateAuthFields = (email?: string, password?: string, code?: string) => {
  const errors: { email?: string; password?: string; code?: string } = {};

  if (email !== undefined) {
    if (!email) {
      errors.email = 'Email is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = 'Enter valid email address.';
    }
  }
  if (password !== undefined) {
    if (!password) {
      errors.password = 'Password is required.';
    } else {
      if (password.length < 6) {
        errors.password = 'Must be at least 6 characters.';
      }
      if (!/[A-Z]/.test(password)) {
        errors.password = 'Must include at least one uppercase letter.';
      }
      if (!/[a-z]/.test(password)) {
        errors.password = 'Must include at least one lowercase letter.';
      }
      if (!/\d/.test(password)) {
        errors.password = 'Must include at least one number.';
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.password = 'Must include at least one special character.';
      }
    }
  }
  if (code !== undefined) {
    if (!Number.isInteger(code)) {
      errors.code = 'Code must be a number.';
    } else if (code.toString().length !== 6) {
      errors.code = 'Code must be a 6-digit number.';
    }
  }

  return errors;
};

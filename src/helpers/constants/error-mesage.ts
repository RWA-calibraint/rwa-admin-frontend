export const ERROR_MESSAGE = {
  DEFAULT: 'Something went wrong.',
  SESSION_EXPIRED: 'Session expired. Redirecting to login...',
  FILE_SIZE_LIMIT: 'File size must lesser that 50MB!',
  IMAGE_SIZE_LIMIT: 'File size must lesser that 5MB!',
  IMAGE_SIZE_LESS: 'Image size must be greater that 100KB!',
  FILE_NAME_INVALID: 'File name must be unique!',
  FILE_CONTENT_DUPLICATE: 'File name and content must be unique',
  INVALID_FILE: 'Invalid file type!',
  PASSWORD_ENCRYPTED_FILE: 'Password encrypted file was not allowed',
  FAILED_TO_READ_FILE: 'Failed to read file',
  NO_OF_FILES: (limit: number, fileType: string) => `Can't upload more than ${limit} ${fileType}!`,
  OPERATION_FAILED: 'Operation Failed',
};

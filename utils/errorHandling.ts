export function handleApiError(error: any): string {
  console.error('API Error:', error);
  
  if (error?.message) {
    return error.message;
  }
  
  if (error?.code) {
    switch (error.code) {
      case 'PGRST116':
        return 'Resource not found';
      case 'PGRST104':
        return 'Invalid input data';
      case '23505':
        return 'This item already exists';
      default:
        return `Error code: ${error.code}`;
    }
  }
  
  return 'An unexpected error occurred';
}
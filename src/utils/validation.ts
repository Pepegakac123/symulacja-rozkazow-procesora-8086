export const isValidHexValue = (value: string): boolean => {
	return /^[0-9A-Fa-f]*$/.test(value) && value.length <= 4;
  };
  
  export const formatHexValue = (value: string): string => {
	return value.padStart(4, '0').toUpperCase();
  };
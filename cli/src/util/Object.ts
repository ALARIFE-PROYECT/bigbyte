export const allObjectsHaveKeys = <T extends object>(array: T[], requiredKeys: string[]): boolean => {
  return array.every(obj =>
    requiredKeys.every(key => key in obj)
  );
}
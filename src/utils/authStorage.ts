export const setItem = (key: string, value: unknown): void => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Erro ao salvar o item "${key}" no localStorage:`, error);
  }
};

export const getItem = <T>(key: string): T | null => {
  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue === null) {
      return null;
    }
    if (serializedValue.startsWith('"') && serializedValue.endsWith('"')) {
        return JSON.parse(serializedValue);
    }
    return serializedValue as T;
  } catch (error) {
    const rawValue = localStorage.getItem(key);
    return rawValue as T | null;
  }
};

export const removeItem = (key: string): void => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Erro ao remover o item "${key}" do localStorage:`, error);
    }
}
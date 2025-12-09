import themeStore from '@/stores/theme';

export function useColorToken() {
    return themeStore.colorToken;
}
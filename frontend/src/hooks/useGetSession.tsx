import { getCookie } from '@/utils/cookie.tsx';
import { cookies } from '@/constants/constants.ts';

export default function useGetSession() {
  const getSession = () => {
    let userCookies = getCookie(cookies.SESSION);
    return userCookies ? JSON.parse(userCookies) : false;
  };
  return { getSession };
}

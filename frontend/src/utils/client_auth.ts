import {deleteCookie} from "@/utils/cookieFunctions";
import {AuthContextType} from "@/context/auth";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {getUser, UserDataType} from "@/utils/auth";

export async function logoutUser(context: AuthContextType, router: AppRouterInstance): Promise<null> {
    await deleteCookie('access');
    await deleteCookie('refresh');

    context.setUser(null);
    router.push('/login');

    return null;
}

export async function getUserOrLogout(
    context: AuthContextType,
    router: AppRouterInstance
): Promise<UserDataType | null> {
    return await getUser() ?? await logoutUser(context, router);
}

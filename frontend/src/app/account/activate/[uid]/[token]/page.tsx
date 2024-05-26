"use server";

import {userActivate} from "@/utils/auth";
import {Error, Success} from "@/app/account/activate/[uid]/[token]/activate_status";

export default async function ActivatingPage({params}: { params: { uid: string, token: string } }) {
    return await userActivate(params.uid, params.token) ? <Success/> : <Error/>
}

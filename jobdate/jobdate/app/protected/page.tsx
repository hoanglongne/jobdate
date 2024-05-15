import Swipe from "@/components/Swipe";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";


export default async function SwipePage() {

    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }


    return (

        <Swipe />

    );
}
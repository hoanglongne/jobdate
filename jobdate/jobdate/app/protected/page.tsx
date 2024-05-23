import Swipe from "@/components/Swipe";
import { createClient } from "@/utils/supabase/server";
import { CardData } from "@/utils/types";
import { redirect } from "next/navigation";


export default async function SwipePage() {

    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    const { data, error } = await supabase
        .from('jobs_fetched')
        .select(`
            jobs (
                id,
                role,
                company_name,
                yoe,
                jd, 
                job_link,
                logo_url,
                skillset,
                salary_range,
                work_type,
                contract_type,
                location
            )
            `
        ).eq('user', user.id);


    return (
        <Swipe cardsData={data as unknown as CardData[]} />
    );
}
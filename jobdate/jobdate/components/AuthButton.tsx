import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AuthButton() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";

    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  };

  return user ? (
    <div className="flex items-center gap-4 flex-col text-sm font-lilitaOne">

      <span className="text-[#FBDFFF]">
        Hey, {user.email}!
      </span>
      <form action={signOut}>
        <button className="py-2 px-5 text-[#47475B] border-2 border-[#47475B] rounded-md no-underline bg-[#d76666] hover:bg-[#c55555] transition duration-200">
          Logout
        </button>
      </form>
    </div>
  ) : (
    <Link
      href="/login"
      className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
    >
      Login
    </Link>
  );
}

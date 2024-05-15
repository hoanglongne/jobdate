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
    <div className="flex items-center gap-4 flex-col text-sm font-semibold">

      <span className="text-xl text-card">
        Hey, {user.email}!
      </span>
      <h3 className='text-xl text-card' >You wanna logout?</h3>
      <form action={signOut} className="flex gap-2 font-kanit font-medium">
        <button className="text-sm py-2 px-6 text-[#DB684F] border-2 border-[#F2A290] rounded-md no-underline bg-[#FFCFCF] hover:bg-[#ffc1c1] transition duration-200">
          Logout
        </button>
        <Link href="/protected">
          <button className="py-2 px-5 text-[#33333d] border-2 border-[#47475B] rounded-md no-underline bg-[#dadada] hover:bg-[#c3c3c3] transition duration-200">
            Back
          </button>
        </Link>
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

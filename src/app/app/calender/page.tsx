import { auth } from "../../../../lib/auth";

export default async function page() {
  const session = await auth();

  if (!session?.user) {
    return <div>Unauthorized </div>;
  }

  return (
    <div className="cont p-2 w-full h-full">
      <div
        id="application-container"
        className="w-full h-full transition-colors left-[72px] grid grid-cols-5 duration-200 px-5 py-6  shadow-custom rounded-sm "
      >
        calender jjkj
      </div>
      {session.user.name};
    </div>
  );
}

import { redirect } from "next/navigation";

const UserIndexPage = async () => {
  redirect("/user/courses");
};

export default UserIndexPage;

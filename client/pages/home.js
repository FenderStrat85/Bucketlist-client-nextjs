import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const home = () => {
  const { data: session } = useSession();
  const router = useRouter();
  // console.log(session.user);
  // if (!session.id) {
  //   router.push("api/auth/signin");
  // }

  return (
    <div>
      {session ? (
        <div>
          <h1>I am the home page</h1>
        </div>
      ) : (
        <button onClick={() => router.push("api/auth/signin")}>
          Take me to the login page
        </button>
      )}
    </div>
  );
};
export default home;

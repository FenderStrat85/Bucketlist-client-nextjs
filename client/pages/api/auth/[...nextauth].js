import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialProvider({
      name: "Sign In",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "johndoe@test.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: (credentials) => {
        //database look up

        if (
          credentials.email === "test@test.com" &&
          credentials.password === "123"
        ) {
          console.log("success!", credentials);
          return { id: 2, name: "John", email: "johndoe@test.com" };
        }
        //login failed
        console.log(credentials);
        return null;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      //user object available from authorize => if nothing is returned then a token is not added and thus a session is not created
      if (token) {
        session.id = token.id;
      }
      return session;
    },
  },
  secret: "test",
  jwt: {
    secret: "test",
    encryption: true,
  },
  // pages: {
  //   signIn: "auth/authentication",
  // },
});

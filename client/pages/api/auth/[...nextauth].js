import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import { gql, useMutation } from "@apollo/client";

const LOGIN = gql`
  mutation LoginUser($loginInput: LoginUserInput) {
    loginUser(loginInput: $loginInput) {
      _id
      accessToken
    }
  }
`;

// const [loginUser, { data, loading, error }] = useMutation(LOGIN);

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
      authorize: async (credentials) => {
        //database look up
        const userInput = {
          email: credentials.email,
          password: credentials.password,
        };
        const response = await fetch("http://localhost:4000/", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `mutation loginUser($loginInput: LoginUserInput) {
                loginUser(loginInput:$loginInput) {
                  _id
                  accessToken
                }
              }`,
            variables: {
              loginInput: userInput,
            },
          }),
        });
        const responseData = await response.json();
        if (responseData.data) {
          return responseData.data.loginUser;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      console.log("user inside jwt callback", user);
      if (user) {
        token.id = user.accessToken;
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

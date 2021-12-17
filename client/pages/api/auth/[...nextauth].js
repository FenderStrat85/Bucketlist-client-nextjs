import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";

// const [loginUser, { data, loading, error }] = useMutation(LOGIN);

export default NextAuth({
  providers: [
    CredentialProvider({
      id: "sign-in",
      name: "User Information",
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

    CredentialProvider({
      id: "create-account",
      name: "Create Account",
      credentials: {
        firstName: {
          label: "First name",
          type: "text",
          placeholder: "name",
        },
        lastName: {
          label: "last name",
          type: "text",
          placeholder: "surname",
        },
        newUserEmail: {
          label: "Email",
          type: "email",
          placeholder: "johndoe@test.com",
        },
        newUserPassword: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        //database look up
        const newUserInput = {
          email: credentials.newUserEmail,
          password: credentials.newUserPassword,
          firstName: credentials.firstName,
          lastName: credentials.lastName,
        };
        const response = await fetch("http://localhost:4000/", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `mutation createUser($registrationInput: RegistrationUserInput) {
                createUser(registrationInput:$registrationInput) {
                  _id
                  accessToken
                }
              }`,
            variables: {
              registrationInput: newUserInput,
            },
          }),
        });
        const responseData = await response.json();
        console.log(responseData);
        if (responseData.data) {
          return responseData.data.createUser;
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
        token.user = user._id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      //user object available from authorize => if nothing is returned then a token is not added and thus a session is not created
      if (token) {
        session.id = token.id;
        session.user = token.user;
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

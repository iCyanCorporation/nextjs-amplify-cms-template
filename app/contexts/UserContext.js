"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import {
  resetPassword,
  getCurrentUser,
  fetchUserAttributes,
  fetchAuthSession,
  getGroupInfo,
  confirmResetPassword,
  signIn,
  signOut,
  signUp,
  confirmSignUp,
  signInWithRedirect,
  // updateUserAttributes,
  updateUserAttribute,
  federatedSignIn,
} from "aws-amplify/auth";
export const CreateUserContext = createContext();

import { Amplify } from "aws-amplify";
import config from "@/amplify_outputs.json";
import { Hub } from "aws-amplify/utils";
import { useRouter } from "next/navigation";
import "aws-amplify/auth/enable-oauth-listener";

Amplify.configure(config, { ssr: true });

const UserProvider = ({ children }) => {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [location, setLocation] = useState(null);
  const [attributes, setAttributes] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isSubscription, setIsSubscription] = useState(false);
  const [session, setSession] = useState();

  const handleLogin = async (emailOrUsername, password) => {
    try {
      const { isSignedIn, nextStep } = await signIn(
        {
          username: emailOrUsername,
          password: password,
        },
        { global: true }
      );
      if (isSignedIn) {
        await checkIsLogin();
      } else {
        return nextStep.signInStep;
      }
    } catch (error) {
      if (
        error.name === "UserAlreadyAuthenticatedException" ||
        error.code === "UserAlreadyAuthenticated"
      ) {
        // move to dashboard
        router.push("/");
        return null;
      }
      return "Login failed. Please try again.";
    }
    return null;
  };

  // const getUserLocation = async () => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         setLocation({
  //           latitude: position.coords.latitude,
  //           longitude: position.coords.longitude,
  //         });
  //       },
  //       (e) => {}
  //     );
  //   }
  // };

  //   const GoogleLoginButton = () => {
  //     const router = useRouter();
  //     const [isLogin, setIsLogin] = useState(false);

  //     async function loginWithGoogle() {
  //       try {
  //         setIsLogin(true);
  //         const res = await checkIsLogin();
  //         if (res) {
  //           router.push("/");
  //           return;
  //         } else {
  //           // Trigger federated sign-in
  //           await signInWithRedirect({ provider: "Google" });
  //         }
  //       } catch (error) {
  //         if (error.name === "UserAlreadyAuthenticatedException") {
  //           router.push("/");
  //           return;
  //         }
  //       }
  //       setIsLogin(false);
  //     }

  //     return (
  //       <Button
  //         variant={"outlined"}
  //         onClick={loginWithGoogle}
  //         className="w-full p-5 space-x-2 border-2 border-gray-200 hover:opacity-60"
  //       >
  //         {isLogin ? (
  //           <div className="flex justify-center" aria-label="読み込み中">
  //             <div className="animate-spin h-4 w-4 border-4 border-white rounded-full border-t-transparent"></div>
  //           </div>
  //         ) : (
  //           <>
  //             <FcGoogle size={24} />
  //             <p className="text-gray-700">Login with Google</p>
  //           </>
  //         )}
  //       </Button>
  //     );
  //   };

  const getSession = async () => {
    try {
      const authSession = await fetchAuthSession();
      setSession(authSession);
    } catch (e) {}
  };

  const checkIsSubscription = async (getUser) => {
    if (!getUser) return;

    // if the date of last subscription is not over 1 day ago, then it is subscription
    const res = await fetch(`/api/subscription?id=${getUser.username}`, {
      method: "GET",
    });
    const data = await res.json();
    const nowDatetimeStr = new Date().toISOString();

    if (data.length > 0) {
      const subscription = data[0];
      const lastSubscriptionDate = new Date(subscription.createdAt);
      const nowDatetime = new Date(nowDatetimeStr);
      const diff = nowDatetime - lastSubscriptionDate;
      const diffDays = diff / (1000 * 60);
      if (diffDays < 1) {
        setIsSubscription(true);
      }
      setIsSubscription(false); // test
    }
  };

  const checkIsLogin = async () => {
    try {
      const user = await getCurrentUser();

      if (user) {
        await setUser(user);
        let userAttributes = await fetchUserAttributes();

        if (userAttributes) {
          await setAttributes(userAttributes);
          if (userAttributes["custom:subscribePlan"] == "standard") {
            setIsPremium(true);
          }

          await checkIsSubscription(user);
        }

        return true;
      } else {
        await setUser(null);
      }
    } catch (e) {}
    return false;
  };

  const checkUserAttributes = async () => {
    if (user) {
      let userAttributes = await fetchUserAttributes();

      if (userAttributes) {
        await setAttributes(userAttributes);
        if (userAttributes["custom:subscribePlan"] == "standard") {
          setIsPremium(true);
        }

        await checkIsSubscription(user);
      }
    }
  };

  async function handleSignUp({ username, password, email }) {
    try {
      const userAttributes = {};
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: username,
        password: password,
        options: {
          userAttributes: userAttributes,
        },
      });

      if (isSignUpComplete) {
        return null;
      } else {
        if (nextStep) {
          switch (nextStep.signUpStep) {
            case "CONFIRM_SIGN_UP":
              return null;
            case "DONE":
              return "Something went wrong. Please try again.";

            default:
              return nextStep.signUpStep;
          }
        }

        return nextStep;
      }
    } catch (error) {
      switch (error.name) {
        case "UsernameExistsException":
          return "Username already exists. Please try again.";
        case "InvalidParameterException":
          return "Invalid email address. Please try again.";
        default:
          return "An error occurred. Please try again.";
      }
    }
  }

  const GoogleSignUpButton = () => {
    const signUpWithGoogle = async () => {
      try {
        await signInWithRedirect({ provider: "Google" });
      } catch (e) {}
    };

    return (
      <Button
        variant={"outlined"}
        onClick={signUpWithGoogle}
        className="w-full p-5 space-x-2 border-2 border-gray-200 hover:opacity-60"
      >
        <FcGoogle size={24} />
        <p className="text-gray-700">Sign Up with Google</p>
      </Button>
    );
  };

  async function handleSignUpConfirmation({ username, confirmationCode }) {
    try {
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username,
        confirmationCode,
      });
      if (isSignUpComplete) {
        return null;
      } else {
        return nextStep;
      }
    } catch (error) {
      return error;
    }
  }

  const handleLogout = async () => {
    try {
      await signOut({ global: true });
      setUser(null);
      setAttributes(null);
    } catch (e) {
      return e;
    }
    return null;
  };

  async function handleResetPassword(username) {
    try {
      const output = await resetPassword({ username });
      const message = await handleResetPasswordNextSteps(output);
      if (message == "EMAIL") {
        return null;
      } else {
        return message;
      }
    } catch (error) {
      if (error.name === "UserNotFoundException") {
        return "User not found. Please try again.";
      } else {
        return "An error occurred. Please try again.";
      }
    }
    return null;
  }

  function handleResetPasswordNextSteps(output) {
    const { nextStep } = output;
    switch (nextStep.resetPasswordStep) {
      case "CONFIRM_RESET_PASSWORD_WITH_CODE":
        const codeDeliveryDetails = nextStep.codeDeliveryDetails;
        return codeDeliveryDetails.deliveryMedium;

      case "DONE":
        return null;
    }
  }

  async function handleConfirmResetPassword({
    username,
    confirmationCode,
    newPassword,
  }) {
    try {
      const res = await confirmResetPassword({
        username,
        confirmationCode,
        newPassword,
      });
      if (res === "SUCCESS" || !res) {
      }
    } catch (error) {
      return "Password reset failed. Please try again.";
    }
    return null;
  }

  async function handleUpdateUserAttribute(attributeKey, value) {
    try {
      const output = await updateUserAttribute({
        userAttribute: {
          attributeKey,
          value,
        },
      });
      handleUpdateUserAttributeNextSteps(output);
    } catch (error) {}
  }

  function handleUpdateUserAttributeNextSteps(output) {
    const { nextStep } = output;

    switch (nextStep.updateAttributeStep) {
      case "CONFIRM_ATTRIBUTE_WITH_CODE":
        const codeDeliveryDetails = nextStep.codeDeliveryDetails;
        break;
      case "DONE":
        break;
    }
  }

  // useEffect(() => {
  //   getUserLocation();
  // }, []);

  const global = {
    user,
    setUser,
    location,
    setLocation,
    attributes,
    session,
    getSession,
    handleLogin,
    handleSignUp,
    handleLogout,
    checkIsLogin,
    handleResetPassword,
    handleConfirmResetPassword,
    handleSignUpConfirmation,
    handleUpdateUserAttribute,
    checkUserAttributes,
    // Attributes
    isPremium,
    isSubscription,
    GoogleSignUpButton,
    // GoogleLoginButton,
    // getUserLocation,
  };

  return (
    <CreateUserContext.Provider value={global}>
      {children}
    </CreateUserContext.Provider>
  );
};

export default UserProvider;
export const useUserContext = () => useContext(CreateUserContext);

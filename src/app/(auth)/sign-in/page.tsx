"use client";
import { Button } from "components/ui/button";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

const page = () => {
  const googleSignIn = async () => {
    const data = await authClient.signIn.social({
      provider: "google",
    });
  };

  return (
    <>
      <main>
        <div className="flex items-center justify-center h-screen">
          <section className="flex items-center justify-center border-2 border-secondary p-6 rounded-lg">
            <div className="px-4 py-6">
              <h2 className="text-lg mb-1">Sign in</h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">
                Sign in to your account using your preferred provider
              </p>
              <div className="pace-y-2 mb-4">
                <Button
                  className="w-full cursor-pointer"
                  variant="secondary"
                  onClick={() => googleSignIn()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 50 50"
                    className="w-3.5 h-3.5"
                  >
                    <path
                      fill="currentColor"
                      d="M 25.996094 48 C 13.3125 48 2.992188 37.683594 2.992188 25 C 2.992188 12.316406 13.3125 2 25.996094 2 C 31.742188 2 37.242188 4.128906 41.488281 7.996094 L 42.261719 8.703125 L 34.675781 16.289063 L 33.972656 15.6875 C 31.746094 13.78125 28.914063 12.730469 25.996094 12.730469 C 19.230469 12.730469 13.722656 18.234375 13.722656 25 C 13.722656 31.765625 19.230469 37.269531 25.996094 37.269531 C 30.875 37.269531 34.730469 34.777344 36.546875 30.53125 L 24.996094 30.53125 L 24.996094 20.175781 L 47.546875 20.207031 L 47.714844 21 C 48.890625 26.582031 47.949219 34.792969 43.183594 40.667969 C 39.238281 45.53125 33.457031 48 25.996094 48 Z"
                    ></path>
                  </svg>
                  <span>Google</span>
                </Button>
              </div>
              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <p
                  className="
                text-xs text-neutral-500 dark:text-neutral-400"
                >
                  Don't have an account?{" "}
                  <Link
                    href="/sign-up"
                    className="text-black dark:text-white hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default page;

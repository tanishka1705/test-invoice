import { useSelector } from "react-redux";
import { AppState } from "../store/store";
import Image from "next/image";
import { useEffect, useState } from "react";
import AlertDialogExample from "../alerts/AlertDialog";
import { getCookie } from "@/utils/cookies";
import { useRouter } from "next/router";

const Navbar = () => {
  const uEmail = useSelector<AppState>(
    (state) => state.user.user.email
  ) as string;
  const [isOpen, onClose] = useState<boolean>(false);
  const [auth, setAuth] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    getCookie() ? setAuth(true) : setAuth(false);
  }, []);

  

  return (
    <>
      <header className="w-full bg-white border-b-2 border-[#f3f3f3] flex justify-between p-4">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
            <li className="inline-flex items-center">
              <a
                href="#"
                className="inline-flex items-center text-sm font-medium text-stone-600 hover:text-[#6860c7]"
              >
                <svg
                  className="w-3 h-3 me-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                </svg>
                Home
              </a>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                <a
                  href="#"
                  className="ms-1 text-sm capitalize font-medium text-stone-600 hover:text-[#6860c7] md:ms-2"
                >
                  {router.asPath === '/generateInvoice' ? 'Generate Invoice' : router.asPath === '/history' ? "Invoice History" : router.asPath.slice(1)}
                </a>
              </div>
            </li>
          </ol>
        </nav>
        <nav>
          {auth ? (
            <ul className="flex items-center">
              <div className="flex">
                <li className="font-semibold mx-3 text-md underline text-slate-700">
                  {uEmail}
                </li>
                <li
                  className="font-bolder mx-3 text-lg cursor-pointer"
                  title="Logout"
                >
                  <Image
                    src="/images/logout.png"
                    alt=""
                    width={100}
                    height={100}
                    className="w-6"
                    onClick={() => onClose(true)}
                  />
                </li>
              </div>
            </ul>
          ) : (
            <ul className="flex justify-end items-center mx-4">
              <li
                className="font-semibold text-lg px-4 py-1 cursor-pointer rounded-sm bg-[#5a51be] text-stone-100 bg"
                onClick={() => router.push("/")}
              >
                Login
              </li>
            </ul>
          )}
        </nav>
      </header>
      {
        <AlertDialogExample
          _id=""
          isOpen={isOpen}
          onClose={onClose}
          filter="logout"
        />
      }
    </>
  );
};

export default Navbar;

import Link from 'next/link';
import NavLinks from './navlinks';
import GpcLogo from './gpclogo';
import { lato } from '@/styles/font';

  export default function SideBar() {
    return (
      <>
        <div className="flex flex-col h-full p-1">
          <Link
            className={`${lato.className} flex items-center justify-center h-20 mb-2 bg-green-700 rounded-md md:h-40 sidebar`}
            href="/"
          >
            {/* Centering the GpcLogo */}
            <div className="text-white">
              <GpcLogo />
            </div>
          </Link>
          <div className="flex flex-row space-x-2 grow md:flex-col md:space-x-0 md:space-y-2">
            <NavLinks/>
            
            <div className="hidden w-full h-auto rounded-md grow sidenav md:block"></div>
          </div>
        </div>
        </>
      );
  }
  
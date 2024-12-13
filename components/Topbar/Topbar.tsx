import Image from 'next/image';
import HellfestLogo from '../../public/logo_hellfest.svg';
import { SidebarTrigger } from '../ui/sidebar';

const Topbar = () => {
  return (
    <div className='flex flex-row w-full'>
      <SidebarTrigger className='w-10 h-10' />
      <div className='flex justify-center h-12 w-full'>
        <Image
          src={HellfestLogo}
          className=''
          alt='Logo'
          width={80}
          height={80}
        />
      </div>
    </div>
  );
};

export default Topbar;

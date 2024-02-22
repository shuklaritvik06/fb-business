import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import Image from 'next/image'
import toast from 'react-hot-toast'

const UserMenu = () => {
  const handleSignOut = () => {
    try {
      fetch('/api/logout', {
        method: 'POST',
      }).then(() => {
        toast.success('Logged Out Successfully!')
        localStorage.removeItem('facebook_page_data')
        localStorage.removeItem('facebook_user_access_token')
        window.location.href = '/login'
      })
    } catch (error: any) {
      toast.error(error.message)
      console.log('Error logging out:', error)
    }
  }
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
          <div className="relative mx-auto mb-2 w-fit">
            <Image
              src="/default_user.webp"
              width={50}
              height={50}
              alt="Profile Picture"
              className="rounded-full object-cover"
            />
            <div className="absolute -right-1 top-8 h-3 w-3 rounded-full bg-green-400"></div>
          </div>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute bottom-12 left-16 mt-2 w-56 origin-bottom-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
          <div className="px-1 py-1 ">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleSignOut}
                  className={`${
                    active ? 'bg-primary text-white' : 'text-gray-900'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  Sign Out
                </button>
              )}
            </Menu.Item>
          </div>
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-primary text-white' : 'text-gray-900'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  Settings
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default UserMenu

import { Fragment, useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Dialog, Transition } from '@headlessui/react';
import { useAuth } from '../../contexts/AuthContext';

const navigation = [
  {
    name: 'Inicio',
    href: '/dashboard',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v0a2 2 0 002-2h14a2 2 0 002 2v0a2 2 0 002 2v0" />
      </svg>
    ),
    category: 'main'
  }
];

const stationNavigation = [
  {
    name: 'Estaciones',
    href: '/dashboard/estaciones',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-120q-33 0-56.5-23.5T120-200v-160q0-33 23.5-56.5T200-440h400v-160h80v160h80q33 0 56.5 23.5T840-360v160q0 33-23.5 56.5T760-120H200Zm0-80h560v-160H200v160Zm80-40q17 0 28.5-11.5T320-280q0-17-11.5-28.5T280-320q-17 0-28.5 11.5T240-280q0 17 11.5 28.5T280-240Zm140 0q17 0 28.5-11.5T460-280q0-17-11.5-28.5T420-320q-17 0-28.5 11.5T380-280q0 17 11.5 28.5T420-240Zm140 0q17 0 28.5-11.5T600-280q0-17-11.5-28.5T560-320q-17 0-28.5 11.5T520-280q0 17 11.5 28.5T560-240Zm10-390-58-58q26-24 58-38t70-14q38 0 70 14t58 38l-58 58q-14-14-31.5-22t-38.5-8q-21 0-38.5 8T570-630ZM470-730l-56-56q44-44 102-69t124-25q66 0 124 25t102 69l-56 56q-33-33-76.5-51.5T640-800q-50 0-93.5 18.5T470-730ZM200-200v-160 160Z"/></svg>
    ),
    category: 'station'
  },
  {
    name: 'Canales',
    href: '/dashboard/canales',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m140-220-60-60 300-300 160 160 284-320 56 56-340 384-160-160-240 240Z"/></svg>
    ),
    category: 'station'
  }
];

const usersNavigation = [
  {
    name: 'Roles',
    href: '/dashboard/roles',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M320-320q33 0 56.5-23.5T400-400q0-33-23.5-56.5T320-480q-33 0-56.5 23.5T240-400q0 33 23.5 56.5T320-320Zm320 0q33 0 56.5-23.5T720-400q0-33-23.5-56.5T640-480q-33 0-56.5 23.5T560-400q0 33 23.5 56.5T640-320ZM480-560q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0 480q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
    ),
    category: 'users',
    adminOnly: true
  },
  {
    name: 'Usuarios',
    href: '/dashboard/usuarios',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M0-240v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63H780Zm-455-80h311q-10-20-55.5-35T480-370q-55 0-100.5 15T325-320ZM160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440Zm640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Zm0-80q17 0 28.5-11.5T520-600q0-17-11.5-28.5T480-640q-17 0-28.5 11.5T440-600q0 17 11.5 28.5T480-560Zm1 240Zm-1-280Z"/></svg>
    ),
    category: 'users',
    adminOnly: true
  }
];

const locationNavigation = [
  {
    name: 'Provincias',
    href: '/dashboard/provincias',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    category: 'location',
    adminOnly: true
  },
  {
    name: 'Municipios',
    href: '/dashboard/municipios',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    category: 'location',
    adminOnly: true
  },
  {
    name: 'Localidades',
    href: '/dashboard/localidades',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    category: 'location',
    adminOnly: true
  }
];

const systemNavigation = [
  {
    name: 'Configuración',
    href: '/dashboard/configuracion',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    category: 'system'
  }
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Sidebar({ open, setOpen, setCurrentModule }) {
  const { url } = usePage();
  const { user, isAdmin } = useAuth();

  const handleNavClick = (navItem) => {
    setCurrentModule(navItem.name);
    setOpen(false);
  };

  const renderNavSection = (items, title) => (
    <div className="space-y-1 z-[1000]">
      {title && (
        <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </h3>
      )}
      {items
        .filter(item => !item.adminOnly || isAdmin)
        .map((item) => {
          const isActive = url === item.href || url.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => handleNavClick(item)}
              className={classNames(
                isActive
                  ? 'bg-[#05249E] text-white'
                  : 'text-gray-700 hover:bg-gray-100',
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors'
              )}
            >
              <span
                className={classNames(
                  isActive
                    ? 'text-white'
                    : 'text-gray-400 group-hover:text-gray-500',
                  'mr-3 flex-shrink-0'
                )}
              >
                {item.icon}
              </span>
              {item.name}
            </Link>
          );
        })}
    </div>
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center h-16 px-4 bg-[#05249E] text-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="36px" fill="currentColor"><path d="M491-200q12-1 20.5-9.5T520-230q0-14-9-22.5t-23-7.5q-41 3-87-22.5T343-375q-2-11-10.5-18t-19.5-7q-14 0-23 10.5t-6 24.5q17 91 80 130t127 35ZM480-80q-137 0-228.5-94T160-408q0-100 79.5-217.5T480-880q161 137 240.5 254.5T800-408q0 140-91.5 234T480-80Zm0-80q104 0 172-70.5T720-408q0-73-60.5-165T480-774Q361-665 300.5-573T240-408q0 107 68 177.5T480-160Zm0-320Z"/></svg>
          </div>
          <div>
            <h1 className="text-lg font-bold">Aguas</h1>
            <p className="text-xs text-white/80">Sistema de Monitoreo</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-2 py-4 bg-white space-y-6 overflow-y-auto">
        {renderNavSection(navigation)}
        {renderNavSection(stationNavigation, "Estaciones")}
        {isAdmin && renderNavSection(usersNavigation, "Usuarios")}
        {isAdmin && renderNavSection(locationNavigation, "Ubicación")}
        {renderNavSection(systemNavigation, "Sistema")}
      </nav>
    </div>
  );

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Cerrar sidebar</span>
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <SidebarContent />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200">
          <SidebarContent />
        </div>
      </div>
    </>
  );
}


import { useSidebar } from "./SidebarContext";
import { useState } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
import {
	FiMenu,
	FiX,
	FiHome,
	FiPackage,
	FiSearch,
} from "react-icons/fi";

const navItems = [
	{ path: "/", label: "Dashboard", icon: FiHome },
	{ path: "/items", label: "Itens", icon: FiPackage },
];

export function Sidebar() {
	const { isOpen, close } = useSidebar();
	const location = useLocation();

	return (
		<>
			<div
				className={`fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
				onClick={close}
				aria-hidden="true"
			/>
			<aside
				className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
				role="navigation"
				aria-label="Menu principal"
			>
				<div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
					<h1 className="text-lg font-semibold text-gray-900">Achei Comunidade</h1>
					<button
						className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
						onClick={close}
						aria-label="Fechar menu"
					>
						<FiX size={24} />
					</button>
				</div>

				<nav className="p-4 space-y-1" aria-label="Navegação principal">
					{navItems.map((item) => (
						<NavLink
							key={item.path}
							to={item.path}
							onClick={close}
							className={({ isActive }) =>
								`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
									? "bg-primary-50 text-primary-700"
									: "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`
							}
						>
							<item.icon size={20} aria-hidden="true" />
							{item.label}
						</NavLink>
					))}
				</nav>
			</aside>
		</>
	);
}

export function Header() {
	const { isOpen, toggle } = useSidebar();
	const location = useLocation();

	return (
		<header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 lg:ml-64">
			<div className="flex h-full items-center justify-between px-4">
				<div className="flex items-center gap-4">
					<button
						className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
						onClick={toggle}
						aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
						aria-expanded={isOpen}
						aria-controls="sidebar"
					>
						<FiMenu size={24} />
					</button>

					<h2 className="text-lg font-semibold text-gray-900 hidden sm:block">
						{location.pathname === "/" ? "Dashboard" : "Itens Encontrados"}
					</h2>
				</div>

				<div className="flex items-center gap-4">
					<div className="hidden sm:block w-64">
						<SearchInput />
					</div>
				</div>
			</div>
		</header>
	);
}

function SearchInput() {
	const [value, setValue] = useState("");
	const location = useLocation();

	return (
		<div className="relative">
			<FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} aria-hidden="true" />
			<input
				type="search"
				placeholder="Buscar itens..."
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						const params = new URLSearchParams(location.search);
						if (value.trim()) params.set("search", value.trim());
						else params.delete("search");
						window.history.pushState({}, "", `${location.pathname}?${params}`);
						window.dispatchEvent(new Event("search-change"));
					}
				}}
				className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
				aria-label="Buscar itens"
			/>
		</div>
	);
}
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useFoundItems } from "../hooks/useFoundItems";
import { useCategories } from "../hooks/useFoundItems";
import { ItemCard, ItemCardSkeleton } from "../components/ItemCard";
import { Sidebar, Header } from "../components/Layout";
import { SidebarProvider } from "../components/SidebarContext";
import { FiX, FiPackage, FiAlertCircle, FiCheckCircle, FiSearch } from "react-icons/fi";

const statusOptions = [
	{ value: "disponivel", label: "A procurar", icon: FiAlertCircle, color: "text-amber-600" },
	{ value: "devolvido", label: "Devolvido", icon: FiCheckCircle, color: "text-green-600" },
] as const;

export function Dashboard() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [search, setSearch] = useState(searchParams.get("search") ?? "");
	const [debouncedSearch, setDebouncedSearch] = useState(search);

	const status = (searchParams.get("status") as "disponivel" | "devolvido") ?? "disponivel";
	const category = searchParams.get("category") ?? undefined;
	const page = Number(searchParams.get("page") ?? 1);
	const limit = 12;

	const { data: itemsData, isLoading, isError, error } = useFoundItems({
		status,
		category,
		search: debouncedSearch || undefined,
		page,
		limit,
	});

	const { data: categories } = useCategories();

	const totalItems = itemsData?.meta?.total ?? 0;
	const totalPages = Math.ceil(totalItems / limit);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(search);
		}, 300);
		return () => clearTimeout(timer);
	}, [search]);

	function handleSearchChange(value: string) {
		setSearch(value);
		const params = new URLSearchParams(searchParams);
		if (value.trim()) params.set("search", value.trim());
		else params.delete("search");
		params.delete("page");
		setSearchParams(params);
	}

	function handleStatusChange(newStatus: "disponivel" | "devolvido") {
		const params = new URLSearchParams(searchParams);
		params.set("status", newStatus);
		params.delete("page");
		setSearchParams(params);
	}

	function handleCategoryChange(newCategory: string | undefined) {
		const params = new URLSearchParams(searchParams);
		if (newCategory) params.set("category", newCategory);
		else params.delete("category");
		params.delete("page");
		setSearchParams(params);
	}

	function handlePageChange(newPage: number) {
		const params = new URLSearchParams(searchParams);
		params.set("page", String(newPage));
		setSearchParams(params);
	}

	function clearFilters() {
		setSearch("");
		const params = new URLSearchParams();
		params.set("status", "disponivel");
		setSearchParams(params);
	}

	const hasFilters = search || category || status !== "disponivel";

	return (
		<SidebarProvider>
			<Sidebar />
			<div className="lg:ml-64 min-h-screen bg-gray-50">
				<Header />
				<main className="max-w-7xl mx-auto px-4 py-6">
					<div className="mb-6">
						<h1 className="text-2xl font-bold text-gray-900">Itens Encontrados</h1>
						<p className="text-gray-500 mt-1">
							{totalItems} {totalItems === 1 ? "item" : "itens"} encontrado{totalItems !== 1 ? "s" : ""}
						</p>
					</div>

					<div className="flex flex-col sm:flex-row gap-4 mb-6">
						<div className="flex-1">
							<input
								type="search"
								placeholder="Buscar por título ou descrição..."
								value={search}
								onChange={(e) => handleSearchChange(e.target.value)}
								className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
							/>
						</div>

						<div className="flex items-center gap-2">
							<select
								value={status}
								onChange={(e) => handleStatusChange(e.target.value as "disponivel" | "devolvido")}
								className="px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
							>
								{statusOptions.map((s) => (
									<option key={s.value} value={s.value}>
										{s.label}
									</option>
								))}
							</select>

							<select
								value={category ?? ""}
								onChange={(e) => handleCategoryChange(e.target.value || undefined)}
								className="px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
							>
								<option value="">Todas as categorias</option>
								{categories?.map((c) => (
									<option key={c.id} value={c.slug}>
										{c.name}
									</option>
								))}
							</select>

							{hasFilters && (
								<button
									onClick={clearFilters}
									className="px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
								>
									<FiX size={16} />
									Limpar
								</button>
							)}
						</div>
					</div>

					{isLoading ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
							{[...Array(8)].map((_, i) => <ItemCardSkeleton key={i} />)}
						</div>
					) : isError ? (
						<div className="text-center py-12">
							<FiAlertCircle size={48} className="text-gray-300 mx-auto mb-4" />
							<p className="text-gray-600">Erro ao carregar itens</p>
						</div>
					) : itemsData?.data.length === 0 ? (
						<div className="text-center py-12">
							<FiPackage size={48} className="text-gray-300 mx-auto mb-4" />
							<h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum item encontrado</h3>
							<p className="text-gray-500 mb-4">
								{search ? `Nenhum resultado para "${search}"` : "Não há itens com os filtros atuais"}
							</p>
							{hasFilters && (
								<button onClick={clearFilters} className="text-primary-600 hover:underline">
									Limpar filtros
								</button>
							)}
						</div>
					) : (
						<>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
								{itemsData!.data.map((item) => (
									<ItemCard key={item.id} item={item} />
								))}
							</div>

							{totalPages > 1 && (
								<div className="mt-8 flex items-center justify-center gap-2">
									<button
										onClick={() => handlePageChange(page - 1)}
										disabled={page === 1}
										className="px-4 py-2 text-sm border border-gray-300 rounded-lg bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
									>
										Anterior
									</button>

									<span className="px-4 py-2 text-sm text-gray-600">
										Página {page} de {totalPages}
									</span>

									<button
										onClick={() => handlePageChange(page + 1)}
										disabled={page === totalPages}
										className="px-4 py-2 text-sm border border-gray-300 rounded-lg bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
									>
										Próxima
									</button>
								</div>
							)}
						</>
					)}
				</main>
			</div>
		</SidebarProvider>
	);
}
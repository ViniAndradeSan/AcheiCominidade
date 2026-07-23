import { useParams } from "react-router-dom";
import { useFoundItem } from "../hooks/useFoundItems";
import { FiArrowLeft, FiPackage, FiMapPin, FiClock, FiCheckCircle, FiAlertCircle, FiEdit, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const statusConfig = {
	disponivel: { label: "A procurar", icon: FiAlertCircle, color: "text-amber-600 bg-amber-50" },
	devolvido: { label: "Devolvido", icon: FiCheckCircle, color: "text-green-600 bg-green-50" },
} as const;

export function ItemDetailPage() {
	const { id } = useParams<{ id: string }>();
	const { data: item, isLoading, isError, refetch } = useFoundItem(id ?? "");

	if (isLoading) return <PageSkeleton />;
	if (isError || !item) return <ErrorState message="Item não encontrado" onRetry={refetch} />;

	const status = statusConfig[item.status];
	const StatusIcon = status.icon;

	return (
		<div className="min-h-screen bg-gray-50">
			<Header />

			<div className="max-w-4xl mx-auto px-4 py-8">
				<div className="flex items-center gap-4 mb-6">
					<Link
						to="/"
						className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100"
						aria-label="Voltar"
					>
						<FiArrowLeft size={24} />
					</Link>
					<h1 className="text-2xl font-bold text-gray-900">{item.title}</h1>
				</div>

				<div className="grid lg:grid-cols-3 gap-6">
					<div className="lg:col-span-2 space-y-6">
						<PhotoSection photoUrl={item.photoUrl} title={item.title} />

						{item.description && (
							<section className="p-6 bg-white rounded-lg border border-gray-200">
								<h2 className="text-lg font-semibold text-gray-900 mb-3">Descrição</h2>
								<p className="text-gray-600 whitespace-pre-wrap">{item.description}</p>
							</section>
						)}

						<section className="p-6 bg-white rounded-lg border border-gray-200">
							<h2 className="text-lg font-semibold text-gray-900 mb-4">Informações</h2>
							<dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<dt className="text-sm text-gray-500">Categoria</dt>
									<dd className="mt-1 font-medium text-gray-900">{item.category?.name ?? "—"}</dd>
								</div>
								<div>
									<dt className="text-sm text-gray-500">Status</dt>
									<dd className="mt-1">
										<span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
											<StatusIcon size={14} aria-hidden="true" />
											{status.label}
										</span>
									</dd>
								</div>
								<div className="sm:col-span-2">
									<dt className="text-sm text-gray-500">Local encontrado</dt>
									<dd className="mt-1 flex items-center gap-2 text-gray-900">
										<FiMapPin size={18} className="text-gray-400" aria-hidden="true" />
										{item.foundLocationText}
									</dd>
								</div>
								{(item.foundLatitude !== null && item.foundLongitude !== null) && (
									<div className="sm:col-span-2">
										<dt className="text-sm text-gray-500">Coordenadas</dt>
										<dd className="mt-1 font-mono text-sm text-gray-900">
											{item.foundLatitude.toFixed(6)}, {item.foundLongitude.toFixed(6)}
										</dd>
									</div>
								)}
								<div>
									<dt className="text-sm text-gray-500">Encontrado em</dt>
									<dd className="mt-1 text-gray-900">
										{format(new Date(item.foundAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
									</dd>
								</div>
								<div>
									<dt className="text-sm text-gray-500">Cadastrado em</dt>
									<dd className="mt-1 text-gray-900">
										{format(new Date(item.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
									</dd>
								</div>
							</dl>
						</section>

						{item.status === "devolvido" && item.itemReturn && (
							<section className="p-6 bg-white rounded-lg border border-gray-200 bg-green-50">
								<h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
									<FiCheckCircle size={20} className="text-green-600" />
									Devolução
								</h2>
								<dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<dt className="text-sm text-gray-500">Devolvido em</dt>
										<dd className="mt-1 text-gray-900">
											{format(new Date(item.itemReturn.returnedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
										</dd>
									</div>
									{item.itemReturn.observation && (
										<div className="sm:col-span-2">
											<dt className="text-sm text-gray-500">Observação</dt>
											<dd className="mt-1 text-gray-900">{item.itemReturn.observation}</dd>
										</div>
									)}
								</dl>
							</section>
						)}
					</div>

					<aside className="space-y-4">
						<div className="p-6 bg-white rounded-lg border border-gray-200">
							<h3 className="font-semibold text-gray-900 mb-4">Ações</h3>
							<div className="space-y-2">
								<Link
									to={`/items/${item.id}/edit`}
									className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
								>
									<FiEdit size={18} />
									Editar
								</Link>
								<button
									className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-50 text-red-600 font-medium hover:bg-red-100"
								>
									<FiTrash2 size={18} />
									Excluir
								</button>
							</div>
						</div>

						<div className="p-6 bg-white rounded-lg border border-gray-200">
							<h3 className="font-semibold text-gray-900 mb-4">Compartilhar</h3>
							<button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50">
								<FiPackage size={18} />
								Copiar link
							</button>
						</div>
					</aside>
				</div>
			</div>
		</div>
	);
}

function Header() {
	return (
		<header className="sticky top-0 z-30 bg-white border-b border-gray-200">
			<div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
				<h1 className="text-lg font-semibold text-gray-900">Achei Comunidade</h1>
			</div>
		</header>
	);
}

function PhotoSection({ photoUrl, title }: { photoUrl: string; title: string }) {
	return (
		<div className="relative aspect-video w-full bg-gray-100 rounded-xl overflow-hidden">
			{photoUrl ? (
				<img src={photoUrl} alt={title} className="w-full h-full object-cover" />
			) : (
				<div className="w-full h-full flex items-center justify-center">
					<FiPackage size={64} className="text-gray-300" />
				</div>
			)}
		</div>
	);
}

function PageSkeleton() {
	return (
		<div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-pulse">
			<div className="h-8 bg-gray-200 rounded w-1/4" />
			<div className="aspect-video bg-gray-200 rounded-xl" />
			<div className="space-y-4">
				<div className="h-6 bg-gray-200 rounded w-1/3" />
				<div className="h-4 bg-gray-200 rounded w-full" />
				<div className="h-4 bg-gray-200 rounded w-2/3" />
			</div>
		</div>
	);
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
	return (
		<div className="max-w-4xl mx-auto px-4 py-16 text-center">
			<FiAlertCircle size={48} className="text-gray-300 mx-auto mb-4" />
			<h2 className="text-xl font-semibold text-gray-900 mb-2">{message}</h2>
			<button
				onClick={onRetry}
				className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
			>
				Tentar novamente
			</button>
		</div>
	);
}
import { FiPackage, FiMapPin, FiClock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import type { FoundItem, ItemStatus } from "../types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const statusConfig: Record<ItemStatus, { label: string; className: string; icon: React.FC<{ size?: number }> }> = {
	disponivel: {
		label: "A procurar",
		className: "bg-amber-100 text-amber-800",
		icon: FiAlertCircle,
	},
	devolvido: {
		label: "Devolvido",
		className: "bg-green-100 text-green-800",
		icon: FiCheckCircle,
	},
};

export function ItemCard({ item }: { item: FoundItem }) {
	const status = statusConfig[item.status];
	const StatusIcon = status.icon;

	return (
		<Link
			to={`/items/${item.id}`}
			className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all"
		>
			<div className="flex gap-4">
				<div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden relative">
					{item.photoUrl ? (
						<img
							src={item.photoUrl}
							alt={item.title}
							className="w-full h-full object-cover"
							loading="lazy"
						/>
					) : (
						<FiPackage className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400" size={28} />
					)}
				</div>

				<div className="flex-1 min-w-0">
					<div className="flex items-start justify-between gap-2">
						<h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
						<span
							className={`flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.className}`}
						>
							<StatusIcon size={12} aria-hidden="true" />
							{status.label}
						</span>
					</div>

					{item.description && (
						<p className="mt-1 text-sm text-gray-500 line-clamp-2">{item.description}</p>
					)}

					<div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-500">
						<span className="flex items-center gap-1">
							<FiPackage size={14} aria-hidden="true" />
							{item.category?.name ?? "Sem categoria"}
						</span>
						<span className="flex items-center gap-1">
							<FiMapPin size={14} aria-hidden="true" />
							{item.foundLocationText}
						</span>
						<span className="flex items-center gap-1">
							<FiClock size={14} aria-hidden="true" />
							{format(new Date(item.foundAt), "dd/MM/yyyy", { locale: ptBR })}
						</span>
					</div>
				</div>
			</div>
		</Link>
	);
}

export function ItemCardSkeleton() {
	return (
		<div className="p-4 bg-white border border-gray-200 rounded-lg animate-pulse">
			<div className="flex gap-4">
				<div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg" />
				<div className="flex-1 space-y-3">
					<div className="h-5 bg-gray-200 rounded w-3/4" />
					<div className="h-4 bg-gray-200 rounded w-1/2" />
					<div className="h-4 bg-gray-200 rounded w-full" />
					<div className="flex gap-4">
						<div className="h-4 bg-gray-200 rounded w-24" />
						<div className="h-4 bg-gray-200 rounded w-32" />
						<div className="h-4 bg-gray-200 rounded w-28" />
					</div>
				</div>
			</div>
		</div>
	);
}

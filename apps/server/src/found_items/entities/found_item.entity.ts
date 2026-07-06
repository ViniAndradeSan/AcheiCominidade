export class FoundItem {
	id: string;
	title: string;
	description: string | null;
	categoryId: string;
	status: string;
	photoUrl: string;
	foundLocationText: string;
	foundLatitude: number | null;
	foundLongitude: number | null;
	foundAt: Date;
	createdAt: Date;
	updatedAt: Date;
}

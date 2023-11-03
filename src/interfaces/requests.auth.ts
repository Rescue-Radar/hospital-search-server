type location = {
	latitude: number;
	longitude: number;
};

export interface user_request {
	name: string;
	phoneNumber: number;
	latitude: location["latitude"];
	longitude: location["longitude"];
	userId: string;
}

export interface JwtPayload {
	userId: string;
}

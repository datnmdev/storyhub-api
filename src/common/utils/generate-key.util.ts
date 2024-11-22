const KeyGenerator = {
	accessTokenKey: (accessToken: string) => {
		return `token:access-token:${accessToken}`;
	},
	refreshTokenKey: (refreshToken: string) => {
		return `token:refresh-token:${refreshToken}`;
	},
	googleOauthStateKey: (state: string) => {
		return `oauth:google:state:${state}`;
	}
};

export default KeyGenerator;

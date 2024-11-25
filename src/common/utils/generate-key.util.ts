const KeyGenerator = {
	accessTokenKey: (accessToken: string) => {
		return `auth:token:access-token:${accessToken}`;
	},
	refreshTokenKey: (refreshToken: string) => {
		return `auth:token:refresh-token:${refreshToken}`;
	},
	googleOauthStateKey: (state: string) => {
		return `auth:google:state:${state}`;
	},
	otpToVerifyAccountKey: (accountId: number) => {
		return `auth:verify-account:${accountId}`
	}
};

export default KeyGenerator;

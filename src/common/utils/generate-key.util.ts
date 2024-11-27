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
	},
	otpToResetPasswordKey: (accountId: number) => {
		return `auth:reset-password:${accountId}`
	},
	stateToResetPasswordKey: (accountId: number) => {
		return `auth:reset-password:state:${accountId}`
	} ,
	paymentStatusKey: (orderId: string) => {
		return `payment:deposite-transaction:${orderId}`
	}
};

export default KeyGenerator;

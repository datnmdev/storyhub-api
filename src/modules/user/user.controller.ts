import { User } from '@/common/decorators/user.decorator';
import { Body, Controller, Get, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileInfoDto } from './dto/update-profile-info.dto';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('/get-profile')
	async getProfile(@User('userId') userId: number) {
		return await this.userService.getProfile(userId);
	}

	@Put('/update-profile')
	async updateProfile(@Body() data: UpdateUserDto) {
		return await this.userService.updateProfile(data);
	}

	@Put()
	updateProfileInfo(@User('userId') userId: number, @Body() updateProfileInfoDto: UpdateProfileInfoDto) {
		return this.userService.updateProfileInfo(userId, updateProfileInfoDto);
	}
}
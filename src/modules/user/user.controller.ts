import { User } from '@/common/decorators/user.decorator';
import { Body, Controller, Get, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User as UserEntity } from './entities/user.entity';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('/get-profile')
	async getProfile(@User('userId') userId: number) {
		return await this.userService.getProfile(userId);
	}

	@Put('/update-profile')
	async updateProfile(@Body() data: UpdateUserDto): Promise<UserEntity> {
		return await this.userService.updateProfile(data);
	}
}
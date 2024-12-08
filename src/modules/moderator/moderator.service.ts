import { Injectable } from "@nestjs/common";
import { GetModeratorDto } from "./dto/get-moderator.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Moderator } from "./entities/moderator.entity";
import { Brackets, DataSource, Repository } from "typeorm";
import UrlResolverUtils from "@/common/utils/url-resolver.util";
import { UrlCipherService } from "@/common/url-cipher/url-cipher.service";
import { plainToInstance } from "class-transformer";
import { UrlCipherPayload } from "@/common/url-cipher/url-cipher.class";
import { CreateEmailPasswordCredentialDataDto, CreateModeratorDto, CreateUserDataDto } from "./dto/create-moderator.dto";
import { User } from "../user/entities/user.entity";
import { ModeratorStatus } from "@/common/constants/moderator.constants";
import { UrlPrefix } from "@/common/constants/url-resolver.constants";
import { UpdateModeratorDataDto, UpdateModeratorDto, UpdateUserDataDto } from "./dto/update-moderator.dto";
import { Account } from "../auth/entities/account.entity";
import { AccountStatus, AuthType, Role } from "@/common/constants/account.constants";
import { EmailPasswordCredential } from "../auth/entities/email-password-credential.entity";
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { BullService } from "@/common/bull/bull.service";
import { JobName } from "@/common/constants/bull.constants";
import RandExp from 'randexp';

@Injectable()
export class ModeratorService {
    constructor(
        @InjectRepository(Moderator)
        private readonly moderatorRepository: Repository<Moderator>,
        private readonly urlCipherService: UrlCipherService,
        private readonly dataSource: DataSource,
        private readonly bullService: BullService
    ) { }

    async isCccdExisted(cccd: string) {
        const moderator = await this.moderatorRepository.findOne({
            where: {
                cccd
            }
        })
        if (moderator) {
            return true;
        }
        return false;
    }

    async getModeratorWithFilter(getModeratorDto: GetModeratorDto) {
        const qb = await this.moderatorRepository
            .createQueryBuilder('moderator')
            .innerJoin('moderator.user', 'user')
            .innerJoin('user.account', 'account')
            .innerJoin('account.emailPasswordCredential', 'emailPasswordCredential')
            .where(new Brackets(qb => {
                if (getModeratorDto.keyword) {
                    if (!isNaN(Number(getModeratorDto.keyword))) {
                        qb.where('moderator.id = :moderatorId', {
                            moderatorId: Number(getModeratorDto.keyword)
                        })
                    } else {
                        qb.where('MATCH (user.name) AGAINST (:name)', {
                            name: getModeratorDto.keyword
                        })
                    }
                }
            }))
            .andWhere(new Brackets(qb => {
                if (getModeratorDto.id) {
                    qb.where('moderator.id = :id', {
                        id: getModeratorDto.id
                    })
                }
            }))
            .andWhere(new Brackets(qb => {
                if (getModeratorDto.name) {
                    qb.where('user.name = :name', {
                        name: getModeratorDto.name
                    })
                }
            }))
            .andWhere(new Brackets(qb => {
                if (getModeratorDto.cccd) {
                    qb.where('moderator.cccd = :cccd', {
                        cccd: getModeratorDto.cccd
                    })
                }
            }))
            .andWhere(new Brackets(qb => {
                if (getModeratorDto.gender) {
                    getModeratorDto.gender.forEach((gender, index) => {
                        qb.orWhere(`user.gender = :gender${index}`, {
                            [`gender${index}`]: gender
                        })
                    })
                }
            }))
            .andWhere(new Brackets(qb => {
                if (getModeratorDto.statuses) {
                    getModeratorDto.statuses.forEach((status, index) => {
                        qb.orWhere(`moderator.status = :status${index}`, {
                            [`status${index}`]: status
                        })
                    })
                }
            }))
            .orderBy("user.updated_at", "DESC")
            .addOrderBy("user.created_at", "DESC")
            .select([
                'user.*',
                'moderator.*',
                'emailPasswordCredential.email AS email'        
            ])
            .limit(getModeratorDto.limit)
            .offset((getModeratorDto.page - 1) * getModeratorDto.limit);

        const moderators = await qb.getRawMany();
        const count = await qb.getCount();
        return [
            moderators.map(moderator => {
                moderator = {
                    ...moderator,
                    managerId: moderator.manager_id,
                    avatar: moderator.avatar === null
                        ? moderator.avatar
                        : UrlResolverUtils.createUrl('/url-resolver', this.urlCipherService.generate(plainToInstance(UrlCipherPayload, {
                            url: moderator.avatar,
                            expireIn: 4 * 60 * 60,
                            iat: Date.now()
                        } as UrlCipherPayload)))
                }
                delete moderator['manager_id'];
                return moderator;
            }),
            count
        ]
    }

    async createModerator(managerId: number, createModeratorDto: CreateModeratorDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            await queryRunner.startTransaction();

            // Tạo người dùng
            const userEntity = plainToInstance(User, plainToInstance(CreateUserDataDto, createModeratorDto));
            if (userEntity.avatar !== undefined) {
                userEntity.avatar = UrlPrefix.INTERNAL_AWS_S3.concat(userEntity.avatar);
            }
            const newUser = await queryRunner.manager.save(userEntity);

            // Tạo tài khoản đăng nhập cho người dùng
            const accountEntity = plainToInstance(Account, {
                id: newUser.id,
                roleId: Role.MODERATOR,
                status: AccountStatus.UNACTIVATED,
                authType: AuthType.EMAIL_PASSWORD
            } as Account)
            const newAccount = await queryRunner.manager.save(accountEntity);
            const randomPassword = new RandExp(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,16}$/).gen();
            const emailPasswordCredentialEntity = plainToInstance(EmailPasswordCredential, {
                id: newAccount.id,
                email: createModeratorDto.email,
                password: await bcrypt.hash(randomPassword, 10)
            } as EmailPasswordCredential);
            await queryRunner.manager.save(emailPasswordCredentialEntity);

            // Gửi mail thông báo thông tin đăng nhập đến cho kiểm duyệt viên
            await this.bullService.addJob(JobName.SEND_ACCOUNT_INFO_TO_MODERATOR, {
                email: createModeratorDto.email,
                password: randomPassword,
                to: createModeratorDto.email
            })
            
            // Lưu thông tin chính của nhân viên kiểm duyệt
            const moderatorEntity = plainToInstance(Moderator, {
                id: newUser.id,
                cccd: createModeratorDto.cccd,
                status: ModeratorStatus.WORKING,
                doj: createModeratorDto.doj,
                address: createModeratorDto.address,
                managerId
            } as Moderator)
            const newModerator = await queryRunner.manager.save(moderatorEntity);
            await queryRunner.commitTransaction();
            return newModerator;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async updateModerator(updateModeratorDto: UpdateModeratorDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            await queryRunner.startTransaction();
            const updateUserData = plainToInstance(UpdateUserDataDto, updateModeratorDto);
            if (updateUserData.avatar !== undefined) {
                updateUserData.avatar = UrlPrefix.INTERNAL_AWS_S3.concat(updateUserData.avatar);
            }
            await queryRunner.manager.update(User, updateModeratorDto.id, {
                ...updateUserData,
                updatedAt: new Date()
            });

            const updateModeratorData = plainToInstance(UpdateModeratorDataDto, updateModeratorDto);
            await queryRunner.manager.update(Moderator, updateModeratorDto.id, updateModeratorData);
            await queryRunner.commitTransaction();
            return true;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            return false;
        } finally {
            await queryRunner.release();
        }
    }
}
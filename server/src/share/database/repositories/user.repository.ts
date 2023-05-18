import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './abstract.repository';
import { UserDocument, UserModel } from '../schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserRepository extends AbstractRepository<UserDocument> {
  constructor(@InjectModel(UserModel.name) userModel: Model<UserDocument>) {
    super(userModel);
  }
}

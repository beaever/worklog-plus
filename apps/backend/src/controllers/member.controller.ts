import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../middleware/auth';
import * as memberService from '../services/member.service';
import type { AddMemberInput, UpdateMemberAccessInput } from '../schemas/member.schema';

export const getMembers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const members = await memberService.getMembers(req.params['projectId'] as string, req.user!.userId);
    res.status(200).json({ success: true, data: members });
  } catch (error) {
    next(error);
  }
};

export const addMember = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const member = await memberService.addMember(
      req.params['projectId'] as string,
      req.user!.userId,
      req.user!.role,
      req.body as AddMemberInput,
    );
    res.status(201).json({ success: true, data: member });
  } catch (error) {
    next(error);
  }
};

export const updateMemberAccess = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const member = await memberService.updateMemberAccess(
      req.params['projectId'] as string,
      req.params['userId'] as string,
      req.user!.userId,
      req.user!.role,
      req.body as UpdateMemberAccessInput,
    );
    res.status(200).json({ success: true, data: member });
  } catch (error) {
    next(error);
  }
};

export const removeMember = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await memberService.removeMember(
      req.params['projectId'] as string,
      req.params['userId'] as string,
      req.user!.userId,
      req.user!.role,
    );
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

import { StudyPathGoal, UserStudyPath, UserTimeSpendingPerDay } from '@prisma/client';
import { BaseRecord } from './BaseRecord';
import { Question } from './Questions';
import { RequireAtLeastOne } from './Utils';

/**
 * The level of the user.
 *
 * - STANDARD: the user is a standard user (DEPRECATED)
 * - ADMIN: the user is an admin - has access to all features
 * - TRIAL: the user is on a trial - Limited access - not currently implemented
 * - FREE: the user is on the free plan - A standard user of TechBlitz
 * - PREMIUM: the user is on the premium plan - This user is subscribed to the premium plan (unlimited features)
 * - LIFETIME: the user is on the lifetime plan - This user has lifetime access to all features (limited ai credits & roadmap generation) (no subscription required)
 */
export type UserLevel = 'STANDARD' | 'ADMIN' | 'TRIAL' | 'FREE' | 'PREMIUM' | 'LIFETIME';

/**
 * Represents a user in the system.
 */
export interface User extends BaseRecord {
  email: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  userProfilePicture?: string | null;

  lastLogin: Date | null;

  userLevel: UserLevel;
  answers: string[];

  correctDailyStreak: number | null;
  totalDailyStreak: number | null;

  /** a toggle the user can turn on to indicate how long it took them to answer a question */
  showTimeTaken?: boolean;
  sendPushNotifications?: boolean;

  /** the user's code editor theme */
  codeEditorTheme?: string | null;

  /** the number of ai question help tokens the user has */
  aiQuestionHelpTokens?: number;

  /** a flag to indicate if the user has a custom username */
  isCustomUsername?: boolean;

  experienceLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'MASTER';

  // optional stripe emails for paid users
  stripeEmails?: string[];

  // where the user found out about techblitz
  howDidYouHearAboutTechBlitz?: string | null;

  // the user's referral code
  referralCode?: string | null;

  // user entered text that will be used to assist in ai generation
  aboutMeAiHelp?: string | null;

  // the user's bookmarked questions (an array of question ids)
  bookmarkedQuestions?: Question[];

  // the study paths the user has enrolled in
  studyPathEnrollments?: UserStudyPath[] | null;

  // the study path goals the user has set for themselves
  studyPathGoals?: StudyPathGoal[] | null;

  // the user's time spending per day
  timeSpendingPerDay?: UserTimeSpendingPerDay | null;

  // a flag to indicate if the user has sent the 7 day no challenge email
  hasSent7DayNoChallengeEmail?: boolean | null;

  // a flag to indicate if the user wants to receive promotional emails
  sendPromotionalEmails?: boolean;

  // the user's custom coupon
  userCustomCoupon?: string | null;

  // a flag to indicate if the user has created a custom signup coupon
  hasCreatedCustomSignupCoupon?: boolean | null;

  // the date the user's custom coupon expires
  userCustomCouponExpiresAt?: Date | null;

  // total user experience points
  userXp?: number;

  // weekly user experience points
  weeklyUserXp?: number;
}

export type UserRecord = Pick<
  User,
  | 'uid'
  | 'email'
  | 'username'
  | 'firstName'
  | 'lastName'
  | 'userProfilePicture'
  | 'createdAt'
  | 'updatedAt'
  | 'lastLogin'
  | 'userLevel'
  | 'correctDailyStreak'
  | 'totalDailyStreak'
  | 'showTimeTaken'
  | 'sendPushNotifications'
  | 'codeEditorTheme'
  | 'aiQuestionHelpTokens'
  | 'isCustomUsername'
  | 'experienceLevel'
  | 'stripeEmails'
  | 'howDidYouHearAboutTechBlitz'
  | 'referralCode'
  | 'aboutMeAiHelp'
  | 'studyPathEnrollments'
  | 'studyPathGoals'
  | 'timeSpendingPerDay'
  | 'hasSent7DayNoChallengeEmail'
  | 'sendPromotionalEmails'
  | 'userCustomCoupon'
  | 'hasCreatedCustomSignupCoupon'
  | 'userCustomCouponExpiresAt'
  | 'userXp'
  | 'weeklyUserXp'
>;

// First, create a type that excludes 'uid' from the partial requirement
export type UpdatableUserFields = Omit<UserRecord, 'uid'>;

// Then create the type for updates that requires uid and at least one other field
export type UserUpdatePayload = {
  uid: UserRecord['uid'];
} & RequireAtLeastOne<UpdatableUserFields>;

export type UserWithOutAnswers = Pick<User, Exclude<keyof User, 'answers'>>;

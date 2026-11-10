/**
 * FSM 4 trạng thái quan hệ loại bỏ triệt để Boolean Soup (Slide 33)
 */
export type RelationshipPhase =
  | 'FRIENDS'
  | 'DATING_NO_LOVE'
  | 'OFFICIAL_LOVE'
  | 'GHOSTED_EXIT';

export interface EffortSignal {
  readonly id: string;
  readonly actor: 'EM' | 'AI_DO';
  readonly description: string;
  readonly timestamp: number;
}
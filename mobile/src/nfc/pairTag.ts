import { assignTag, TagDto } from '../api/habits';
import { writeFailureMessage, writeNdefUrl } from './writeNdefUrl';

export type PairOutcome =
  | { status: 'written'; tag: TagDto }
  | { status: 'not_written'; tag: TagDto; reason: string };

export async function assignAndWriteTag(habitId: number): Promise<PairOutcome> {
  const tag = await assignTag(habitId);
  const result = await writeNdefUrl(tag.ndefUrl);

  if (result.status === 'written') {
    return { status: 'written', tag };
  }
  return { status: 'not_written', tag, reason: writeFailureMessage(result) };
}

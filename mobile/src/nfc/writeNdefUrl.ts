import NfcManager, { NdefStatus, NfcError, NfcTech, Ndef } from 'react-native-nfc-manager';
import {Platform} from 'react-native';
import { setNfcPromptVisible } from './nfcPrompt';

export type WriteFailure =
  | 'nfc_unsupported'
  | 'nfc_disabled'
  | 'tag_read_only'
  | 'tag_too_small'
  | 'tag_lost'
  | 'unknown';

export type WriteResult =
  | { status: 'written' }
  | { status: 'cancelled' }
  | { status: 'failed'; reason: WriteFailure };

const failed = (reason: WriteFailure): WriteResult => ({ status: 'failed', reason });

export async function writeNdefUrl(url: string): Promise<WriteResult> {
  try {
    if (!(await NfcManager.isSupported())) {
      return failed('nfc_unsupported');
    }
    await NfcManager.start();
    if (!(await NfcManager.isEnabled())) {
      return failed('nfc_disabled');
    }

    if (Platform.OS === 'android') {
      setNfcPromptVisible(true);
    }

    await NfcManager.requestTechnology(NfcTech.Ndef, {
      alertMessage: 'Hold your phone near the NFC sticker',
    });

    const ndefStatus = await NfcManager.ndefHandler.getNdefStatus();
    if (ndefStatus.status === NdefStatus.ReadOnly) {
      return failed('tag_read_only');
    }

    const bytes = Ndef.encodeMessage([Ndef.uriRecord(url)]);
    if (!bytes) {
      return failed('unknown');
    }
    if (ndefStatus.capacity > 0 && bytes.length > ndefStatus.capacity) {
      return failed('tag_too_small');
    }

    await NfcManager.ndefHandler.writeNdefMessage(bytes);
    return { status: 'written' };
  } catch (error) {
    if (error instanceof NfcError.UserCancel) {
      return { status: 'cancelled' };
    }
    if (error instanceof NfcError.TagNotWritable) {
      return failed('tag_read_only');
    }
    if (error instanceof NfcError.TagSizeTooSmall) {
      return failed('tag_too_small');
    }
    if (error instanceof NfcError.TagConnectionLost) {
      return failed('tag_lost');
    }
    return failed('unknown');
  } finally {
    NfcManager.cancelTechnologyRequest().catch(() => {});
    setNfcPromptVisible(false);
  }
}

export function writeFailureMessage(result: WriteResult): string {
  if (result.status === 'cancelled') {
    return 'Writing to the sticker was cancelled.';
  }
  if (result.status === 'written') {
    return 'The address was written to the sticker.';
  }
  switch (result.reason) {
    case 'nfc_unsupported':
      return 'This phone does not support NFC.';
    case 'nfc_disabled':
      return 'NFC is turned off. Turn it on in your phone settings and try again.';
    case 'tag_read_only':
      return 'This sticker is write-protected. Use a different, blank sticker.';
    case 'tag_too_small':
      return 'The address does not fit on this sticker. Use an NTAG215 sticker or one with more capacity.';
    case 'tag_lost':
      return 'The sticker was moved away during writing. Place your phone against it and hold it still for a moment.';
    default:
      return 'Could not write to the sticker. Hold your phone near it and try again.';
  }
}

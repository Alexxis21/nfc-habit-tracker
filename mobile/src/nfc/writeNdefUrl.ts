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
      alertMessage: 'Zbliż telefon do naklejki NFC',
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
    return 'Zapis na naklejce został anulowany.';
  }
  if (result.status === 'written') {
    return 'Adres zapisany na naklejce.';
  }
  switch (result.reason) {
    case 'nfc_unsupported':
      return 'Ten telefon nie obsługuje NFC.';
    case 'nfc_disabled':
      return 'NFC jest wyłączone. Włącz je w ustawieniach telefonu i spróbuj ponownie.';
    case 'tag_read_only':
      return 'Ta naklejka jest zablokowana do zapisu. Użyj innej, czystej naklejki.';
    case 'tag_too_small':
      return 'Adres nie mieści się na tej naklejce. Użyj naklejki NTAG215 lub o większej pojemności.';
    case 'tag_lost':
      return 'Naklejka została oddalona w trakcie zapisu. Przyłóż telefon i przytrzymaj go chwilę nieruchomo.';
    default:
      return 'Nie udało się zapisać na naklejce. Zbliż telefon do naklejki i spróbuj ponownie.';
  }
}
